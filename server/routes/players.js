/**
 * Player Routes
 * API endpoints for player management
 */

const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { body, validationResult } = require('express-validator');

// Create/Register Player
router.post('/', [
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
  body('email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Player by Email
router.get('/email/:email', async (req, res) => {
  try {
    const player = await Player.findOne({ email: req.params.email });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Player Stats
router.get('/:id/stats', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({
      player: player.name,
      careerStats: player.careerStats,
      nationalEventStats: player.nationalEventStats,
      selectionEligibility: player.selectionEligibility
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Players by Club
router.get('/club/:club', async (req, res) => {
  try {
    const players = await Player.find({ club: req.params.club }).sort({ lastName: 1, firstName: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get National Event Eligible Players
router.get('/eligible/national', async (req, res) => {
  try {
    const players = await Player.find({
      'selectionEligibility.isNationalEligible': true,
      status: 'Active'
    }).sort({ 'careerStats.winPercentage': -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
