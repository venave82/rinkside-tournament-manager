const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  
  // Draw Information
  drawName: String,
  round: {
    type: String,
    enum: ['Sectional', 'Quarter Final', 'Semi Final', 'Final', 'Playoffs'],
    required: true
  },
  
  // Section (if applicable)
  section: {
    type: Number,
    min: 1,
    max: 8
  },
  
  // Draw Details
  drawMatrix: [
    {
      position: Number,
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      },
      isBye: Boolean,
      seed: Number
    }
  ],
  
  // Bracket Structure
  bracketStructure: {
    type: String,
    enum: ['Round Robin', 'Single Elimination', 'Double Elimination', 'Finals Series'],
    default: 'Round Robin'
  },
  
  // Configuration
  numberOfTeams: Number,
  numberOfRounds: Number,
  teamsPerRound: Number,
  numberOfByes: Number,
  
  // Generation Method
  generationMethod: {
    type: String,
    enum: ['Manual', 'Auto Random', 'Auto Seeded', 'Auto Balanced'],
    default: 'Auto Balanced'
  },
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Finalized', 'Published', 'In Progress', 'Completed'],
    default: 'Draft'
  },
  
  // Metadata
  generatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date,
  createdBy: mongoose.Schema.Types.ObjectId,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Draw', DrawSchema);
