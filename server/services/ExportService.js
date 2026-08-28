/**
 * Export Service
 * Handles PDF, Excel, and Print exports for various reports
 */

const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class ExportService {
  /**
   * Export draw to PDF
   * @param {Object} tournament - Tournament object
   * @param {Array} fixtures - Fixtures array
   * @param {String} section - Section number (optional)
   * @returns {String} Path to generated PDF
   */
  static async exportDrawToPDF(tournament, fixtures, section = null) {
    const doc = new PDFDocument();
    const filename = `draw_${tournament._id}_${section || 'all'}_${Date.now()}.pdf`;
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    
    // Ensure directory exists
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(20).text(tournament.tournamentName, { align: 'center' });
    doc.fontSize(12).text(`${tournament.location?.club || 'Club TBD'} - ${tournament.location?.address || ''}`, { align: 'center' });
    doc.fontSize(10).text(`Draw - ${section ? `Section ${section}` : 'All Sections'}`, { align: 'center' });
    doc.moveDown();
    
    // Draw details
    doc.fontSize(10).text(`Discipline: ${tournament.discipline} | Format: ${tournament.playType}`, { align: 'left' });
    doc.text(`Total Fixtures: ${fixtures.length}`, { align: 'left' });
    doc.moveDown();
    
    // Fixtures table
    let yPosition = doc.y;
    const pageHeight = doc.page.height;
    
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Round', 50, yPosition, { width: 50 });
    doc.text('Team 1', 120, yPosition, { width: 130 });
    doc.text('Team 2', 280, yPosition, { width: 130 });
    doc.text('Green', 430, yPosition, { width: 50 });
    
    yPosition += 20;
    doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
    yPosition += 10;
    
    doc.font('Helvetica').fontSize(8);
    
    fixtures.forEach((fixture, index) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 50;
      }
      
      const round = fixture.round || 1;
      const team1Name = fixture.team1?.teamName || 'BYE';
      const team2Name = fixture.isBye ? 'BYE' : (fixture.team2?.teamName || '');
      const green = fixture.green || '-';
      
      doc.text(round.toString(), 50, yPosition, { width: 50 });
      doc.text(team1Name, 120, yPosition, { width: 130 });
      doc.text(team2Name, 280, yPosition, { width: 130 });
      doc.text(green.toString(), 430, yPosition, { width: 50 });
      
      yPosition += 16;
    });
    
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }

  /**
   * Export ladder to Excel
   * @param {Object} ladder - Ladder object
   * @param {Object} tournament - Tournament details
   * @returns {String} Path to generated Excel file
   */
  static async exportLadderToExcel(ladder, tournament) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ladder');
    
    // Headers
    worksheet.columns = [
      { header: 'Position', key: 'position', width: 10 },
      { header: 'Team', key: 'teamName', width: 25 },
      { header: 'Played', key: 'gamesPlayed', width: 10 },
      { header: 'Won', key: 'gamesWon', width: 10 },
      { header: 'Lost', key: 'gamesLost', width: 10 },
      { header: 'Drawn', key: 'gamesDrawn', width: 10 },
      { header: 'Points For', key: 'pointsFor', width: 12 },
      { header: 'Points Against', key: 'pointsAgainst', width: 15 },
      { header: 'Bonus Points', key: 'bonusPoints', width: 13 },
      { header: 'Total Points', key: 'totalPoints', width: 13 },
      { header: 'Win %', key: 'percentage', width: 10 }
    ];
    
    // Add data
    ladder.entries.forEach(entry => {
      worksheet.addRow({
        position: entry.position,
        teamName: entry.team?.teamName || entry.teamName,
        gamesPlayed: entry.gamesPlayed,
        gamesWon: entry.gamesWon,
        gamesLost: entry.gamesLost,
        gamesDrawn: entry.gamesDrawn,
        pointsFor: entry.pointsFor,
        pointsAgainst: entry.pointsAgainst,
        bonusPoints: entry.bonusPoints,
        totalPoints: entry.totalPoints,
        percentage: entry.percentage
      });
    });
    
    // Styling
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    const filename = `ladder_${tournament._id}_${Date.now()}.xlsx`;
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    await workbook.xlsx.writeFile(filepath);
    return filepath;
  }

  /**
   * Export to JSON for storage/sharing
   * @param {Object} data - Data to export
   * @param {String} type - Export type (draw, ladder, results)
   * @returns {String} Path to JSON file
   */
  static async exportToJSON(data, type) {
    const filename = `${type}_${Date.now()}.json`;
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return filepath;
  }

  /**
   * Export player stats to PDF
   * @param {Object} player - Player object
   * @param {Object} stats - Player stats
   * @returns {String} Path to generated PDF
   */
  static async exportPlayerStatsToPDF(player, stats) {
    const doc = new PDFDocument();
    const filename = `player_stats_${player._id}_${Date.now()}.pdf`;
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(18).text(`${player.firstName} ${player.lastName}`, { align: 'center' });
    doc.fontSize(12).text('Player Statistics', { align: 'center' });
    doc.moveDown();
    
    // Player info
    doc.fontSize(10);
    doc.text(`Club: ${player.club || 'N/A'}`);
    doc.text(`Bowls ID: ${player.bowlsId || 'N/A'}`);
    doc.text(`Handicap: ${player.handicap || 'N/A'}`);
    doc.moveDown();
    
    // Career stats
    doc.fontSize(12).font('Helvetica-Bold').text('Career Statistics');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total Tournaments: ${stats.careerStats?.totalTournaments || 0}`);
    doc.text(`Total Games: ${stats.careerStats?.totalGames || 0}`);
    doc.text(`Total Wins: ${stats.careerStats?.totalWins || 0}`);
    doc.text(`Win Percentage: ${stats.careerStats?.winPercentage || 0}%`);
    doc.text(`Finals Appearances: ${stats.careerStats?.finalsAppearances || 0}`);
    doc.text(`Finals Wins: ${stats.careerStats?.finalsWins || 0}`);
    doc.moveDown();
    
    // Current tournament stats
    if (stats.nationalEventStats && stats.nationalEventStats.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('National Event Statistics');
      stats.nationalEventStats.forEach((eventStat, idx) => {
        doc.fontSize(9).font('Helvetica');
        doc.text(`Event ${idx + 1}:`);
        doc.text(`  Games: ${eventStat.gamesPlayed}, Wins: ${eventStat.gamesWon}, Loss: ${eventStat.gameLost}`);
        doc.text(`  Points: ${eventStat.roundPoints} (Round), ${eventStat.finalsPoints} (Finals)`);
      });
    }
    
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }

  /**
   * Generate print-friendly HTML
   * @param {Object} data - Data to print
   * @param {String} type - Report type
   * @returns {String} HTML string
   */
  static generatePrintHTML(data, type) {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${type} Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        h1, h2 { text-align: center; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <h1>${type} Report</h1>
    `;
    
    // Type-specific content would be added here
    html += `
    </body>
    </html>
    `;
    
    return html;
  }
}

module.exports = ExportService;
