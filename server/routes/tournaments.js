/**
 * Tournament Routes
 * API endpoints for tournament management
 */

const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Fixture = require('../models/Fixture');
const Ladder = require('../models/Ladder');
const TournamentService = require('../services/TournamentService');
const DrawGeneratorService = require('../services/DrawGeneratorService');
const { body, validationResult } = require('express-validator');

// Create Tournament
router.post('/', [
  body('tournamentName').notEmpty().withMessage('Tournament name is required'),
  body('eventType').isIn(['National', 'Sanctioned']).withMessage('Invalid event type'),
  body('discipline').isIn(['Singles', 'Pairs', 'Triples', 'Fours']).withMessage('Invalid discipline'),
  body('playType').isIn(['Select', 'Standard Play', 'Pennants', 'Set Play']).withMessage('Invalid play type'),
  body('numberOfSections').isInt({ min: 1, max: 8 }).withMessage('Sections must be 1-8'),
  body('numberOfGreens').isInt({ min: 1, max: 4 }).withMessage('Greens must be 1-4')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Tournament
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Tournament
router.put('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find({}).sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Draws (auto-divide and generate)
router.post('/:id/initialize-draws', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const teams = await Team.find({ tournament: req.params.id });
    if (teams.length === 0) {
      return res.status(400).json({ error: 'No teams registered' });
    }

    const drawResult = await TournamentService.initializeDraws(tournament, teams);
    
    // Save fixtures to database
    const fixtures = [];
    Object.keys(drawResult.draws).forEach(sectionNum => {
      drawResult.draws[sectionNum].forEach((fixture, idx) => {
        fixtures.push(new Fixture({
          tournament: req.params.id,
          round: 'Sectional',
          roundNumber: 1,
          team1: fixture.team1._id,
          team2: fixture.team2?._id,
          section: parseInt(sectionNum),
          status: 'Scheduled',
          isBye: fixture.isBye
        }));
      });
    });

    await Fixture.insertMany(fixtures);
    tournament.status = 'Registering';
    await tournament.save();

    res.json({ message: 'Draws initialized', fixturesCreated: fixtures.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Fixtures
router.get('/:id/fixtures', async (req, res) => {
  try {
    const { round, section, status } = req.query;
    const query = { tournament: req.params.id };
    
    if (round) query.round = round;
    if (section) query.section = parseInt(section);
    if (status) query.status = status;

    const fixtures = await Fixture.find(query)
      .populate('team1')
      .populate('team2')
      .sort({ date: 1, green: 1 });
    
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record Match Result
router.post('/:tournamentId/fixtures/:fixtureId/result', async (req, res) => {
  try {
    const { team1Score, team2Score } = req.body;
    
    const fixture = await Fixture.findById(req.params.fixtureId)
      .populate('team1')
      .populate('team2');
    
    if (!fixture) {
      return res.status(404).json({ error: 'Fixture not found' });
    }

    fixture.result = {
      team1Score,
      team2Score,
      winner: team1Score > team2Score ? fixture.team1._id : fixture.team2._id,
      isDraw: team1Score === team2Score
    };
    fixture.status = 'Completed';
    await fixture.save();

    res.json(fixture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get or Create Ladder
router.get('/:id/ladder/:section', async (req, res) => {
  try {
    let ladder = await Ladder.findOne({
      tournament: req.params.id,
      section: parseInt(req.params.section),
      type: 'Sectional'
    }).populate('entries.team');

    if (!ladder) {
      // Create initial ladder
      const teams = await Team.find({
        tournament: req.params.id,
        section: parseInt(req.params.section)
      });

      const entries = teams.map((team, idx) => ({
        team: team._id,
        position: idx + 1,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDrawn: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        bonusPoints: 0,
        totalPoints: 0
      }));

      ladder = new Ladder({
        tournament: req.params.id,
        section: parseInt(req.params.section),
        type: 'Sectional',
        entries
      });
      await ladder.save();
    }

    res.json(ladder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
