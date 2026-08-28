const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  
  // Report Details
  reportName: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: [
      'Draw',
      'Ladder',
      'Fixtures',
      'Results',
      'Player Stats',
      'Tournament Summary',
      'Finals Bracket',
      'Custom'
    ],
    required: true
  },
  
  // Content
  content: mongoose.Schema.Types.Mixed,
  
  // Export Formats
  exportFormats: {
    hasPDF: Boolean,
    hasExcel: Boolean,
    hasJSON: Boolean,
    hasPrint: Boolean
  },
  
  // File References
  pdfPath: String,
  excelPath: String,
  
  // Metadata
  generatedAt: {
    type: Date,
    default: Date.now
  },
  generatedBy: mongoose.Schema.Types.ObjectId,
  
  // Report Scope
  reportScope: {
    section: Number,
    round: String,
    dateGenerated: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
