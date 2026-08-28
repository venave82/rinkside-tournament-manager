/**
 * Team Routes
 * API endpoints for team management
 */

const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { body, validationResult } = require('express-validator');

// Register Team
router.post('/', [
  body('tournament').notEmpty().withMessage('Tournament ID required'),
  body('teamName').notEmpty().withMessage('Team name required'),
  body('players').isArray({ min: 1 }).withMessage('At least one player required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const team = new Team(req.body);
    await team.save();
    await team.populate('players');
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Team
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('players');
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Teams by Tournament
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const teams = await Team.find({ tournament: req.params.tournamentId })
      .populate('players')
      .sort({ section: 1, teamName: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Team
router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
