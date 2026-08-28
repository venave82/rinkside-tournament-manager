/**
 * Report Routes
 * API endpoints for report generation and export
 */

const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Tournament = require('../models/Tournament');
const Fixture = require('../models/Fixture');
const Ladder = require('../models/Ladder');
const Player = require('../models/Player');
const ExportService = require('../services/ExportService');
const TournamentService = require('../services/TournamentService');
const ScoringService = require('../services/ScoringService');

// Generate Draw Report (PDF/Excel)
router.post('/draw/:tournamentId', async (req, res) => {
  try {
    const { section, format } = req.body; // format: 'pdf', 'excel', 'json'
    
    const tournament = await Tournament.findById(req.params.tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const fixtures = await Fixture.find({ tournament: req.params.tournamentId })
      .populate('team1')
      .populate('team2');

    let filepath;
    if (format === 'pdf') {
      filepath = await ExportService.exportDrawToPDF(tournament, fixtures, section);
    } else if (format === 'excel') {
      filepath = await ExportService.exportToJSON(fixtures, 'draw');
    } else {
      filepath = await ExportService.exportToJSON(fixtures, 'draw');
    }

    const report = new Report({
      tournament: req.params.tournamentId,
      reportName: `Draw - Section ${section || 'All'}`,
      reportType: 'Draw',
      content: fixtures,
      exportFormats: { hasPDF: format === 'pdf', hasExcel: format === 'excel', hasJSON: true },
      pdfPath: format === 'pdf' ? filepath : null,
      generatedBy: req.user?.id,
      reportScope: { section }
    });
    await report.save();

    res.json({ message: 'Report generated', filepath, reportId: report._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Ladder Report
router.post('/ladder/:tournamentId/:section', async (req, res) => {
  try {
    const { format } = req.body; // format: 'pdf', 'excel', 'json'
    
    const ladder = await Ladder.findOne({
      tournament: req.params.tournamentId,
      section: parseInt(req.params.section)
    }).populate('entries.team');

    if (!ladder) {
      return res.status(404).json({ error: 'Ladder not found' });
    }

    let filepath;
    if (format === 'excel') {
      filepath = await ExportService.exportLadderToExcel(ladder, { _id: req.params.tournamentId });
    } else {
      filepath = await ExportService.exportToJSON(ladder, `ladder_section_${req.params.section}`);
    }

    const report = new Report({
      tournament: req.params.tournamentId,
      reportName: `Ladder - Section ${req.params.section}`,
      reportType: 'Ladder',
      content: ladder,
      exportFormats: { hasExcel: format === 'excel', hasJSON: true },
      excelPath: format === 'excel' ? filepath : null,
      generatedBy: req.user?.id,
      reportScope: { section: parseInt(req.params.section) }
    });
    await report.save();

    res.json({ message: 'Ladder report generated', filepath, reportId: report._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Tournament Summary
router.get('/summary/:tournamentId', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const fixtures = await Fixture.find({ tournament: req.params.tournamentId });
    const ladders = await Ladder.find({ tournament: req.params.tournamentId }).populate('entries.team');

    const summary = TournamentService.generateTournamentSummary(tournament, ladders, fixtures);

    const report = new Report({
      tournament: req.params.tournamentId,
      reportName: 'Tournament Summary',
      reportType: 'Tournament Summary',
      content: summary,
      exportFormats: { hasPDF: true, hasExcel: true, hasJSON: true },
      generatedBy: req.user?.id
    });
    await report.save();

    res.json({ summary, reportId: report._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Player Stats Report
router.get('/player-stats/:playerId/:tournamentId', async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const tournament = await Tournament.findById(req.params.tournamentId);
    const isNational = tournament?.eventType === 'National';

    // Would fetch player's matches from fixtures
    const stats = player.nationalEventStats || [];

    const report = new Report({
      tournament: req.params.tournamentId,
      reportName: `Player Stats - ${player.firstName} ${player.lastName}`,
      reportType: 'Player Stats',
      content: { player, stats },
      exportFormats: { hasPDF: true, hasJSON: true },
      generatedBy: req.user?.id
    });
    await report.save();

    res.json({ stats, reportId: report._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Reports for Tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const reports = await Report.find({ tournament: req.params.tournamentId })
      .sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Report
router.delete('/:reportId', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.reportId);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
