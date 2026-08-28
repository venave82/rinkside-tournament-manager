/**
 * Scoring Service
 * Handles points calculation for different tournament types
 */

class ScoringService {
  /**
   * Calculate points for Pennants format
   * Win = 2 pts, Draw = 1 pt each, Loss = 0
   * @param {Object} result - Result object with team scores
   * @returns {Object} Points for both teams
   */
  static calculatePennants(result) {
    const points = {
      team1: 0,
      team2: 0,
      bonusPoints: 0
    };
    
    if (result.team1Score > result.team2Score) {
      points.team1 = 2;
      points.team2 = 0;
      points.bonusTeam = 'team1';
    } else if (result.team2Score > result.team1Score) {
      points.team1 = 0;
      points.team2 = 2;
      points.bonusTeam = 'team2';
    } else if (result.team1Score === result.team2Score) {
      // Shared bonus
      points.team1 = 1;
      points.team2 = 1;
      points.bonusTeam = 'shared';
    }
    
    return points;
  }

  /**
   * Calculate points for Set Play format
   * Clean sweep = 4 pts
   * Win (if no clean sweep) = 2 pts, Draw = 1 pt each, Loss = 0
   * @param {Object} result - Result with set play scores
   * @returns {Object} Points for both teams
   */
  static calculateSetPlay(result) {
    const points = {
      team1: 0,
      team2: 0,
      cleanSweep: null,
      bonusPoints: 0
    };
    
    // Check for clean sweep (win all disciplines)
    if (result.team1WinsCount > result.team2WinsCount) {
      if (result.team1WinsCount === result.setCount) {
        points.team1 = 4;
        points.cleanSweep = 'team1';
        return points;
      }
    } else if (result.team2WinsCount > result.team1WinsCount) {
      if (result.team2WinsCount === result.setCount) {
        points.team2 = 4;
        points.cleanSweep = 'team2';
        return points;
      }
    }
    
    // No clean sweep, apply pennants scoring
    return this.calculatePennants(result);
  }

  /**
   * Calculate points for Standard Play
   * Win = 2 pts, Draw = 1 pt each, Loss = 0
   * @param {Object} result - Result object
   * @returns {Object} Points for both teams
   */
  static calculateStandardPlay(result) {
    return this.calculatePennants(result);
  }

  /**
   * Update ladder with match result
   * @param {Object} ladder - Current ladder
   * @param {Object} result - Match result
   * @param {String} playType - Tournament play type
   * @returns {Object} Updated ladder
   */
  static updateLadder(ladder, result, playType) {
    let points;
    
    switch (playType) {
      case 'Pennants':
        points = this.calculatePennants(result);
        break;
      case 'Set Play':
        points = this.calculateSetPlay(result);
        break;
      case 'Standard Play':
      case 'Select':
        points = this.calculateStandardPlay(result);
        break;
      default:
        throw new Error(`Unknown play type: ${playType}`);
    }
    
    // Update team entries
    const team1Entry = ladder.entries.find(e => e.team._id.toString() === result.team1._id.toString());
    const team2Entry = ladder.entries.find(e => e.team._id.toString() === result.team2._id.toString());
    
    if (team1Entry) {
      team1Entry.gamesPlayed++;
      team1Entry.pointsFor += result.team1Score || 0;
      team1Entry.pointsAgainst += result.team2Score || 0;
      team1Entry.totalPoints += points.team1;
      
      if (result.team1Score > (result.team2Score || 0)) {
        team1Entry.gamesWon++;
      } else if (result.team1Score < (result.team2Score || 0)) {
        team1Entry.gamesLost++;
      } else {
        team1Entry.gamesDrawn++;
      }
    }
    
    if (team2Entry && !result.isBye) {
      team2Entry.gamesPlayed++;
      team2Entry.pointsFor += result.team2Score || 0;
      team2Entry.pointsAgainst += result.team1Score || 0;
      team2Entry.totalPoints += points.team2;
      
      if (result.team2Score > result.team1Score) {
        team2Entry.gamesWon++;
      } else if (result.team2Score < result.team1Score) {
        team2Entry.gamesLost++;
      } else {
        team2Entry.gamesDrawn++;
      }
    }
    
    // Sort ladder by points
    ladder.entries.sort((a, b) => b.totalPoints - a.totalPoints);
    ladder.entries.forEach((entry, index) => {
      entry.position = index + 1;
      entry.percentage = entry.gamesPlayed > 0 ? ((entry.gamesWon / entry.gamesPlayed) * 100).toFixed(2) : 0;
    });
    
    return ladder;
  }

  /**
   * Calculate player stats for National events
   * @param {Object} player - Player object
   * @param {Array} matches - Matches player participated in
   * @returns {Object} Player stats
   */
  static calculatePlayerStats(player, matches, isNationalEvent = false) {
    const stats = {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      winPercentage: 0,
      roundPoints: 0,
      finalsPoints: 0,
      finalsAppearance: false,
      finalsRound: null,
      finalsResult: 'N/A'
    };
    
    if (!matches || matches.length === 0) {
      return stats;
    }
    
    matches.forEach(match => {
      stats.gamesPlayed++;
      stats.pointsFor += match.playerScore || 0;
      stats.pointsAgainst += match.opponentScore || 0;
      
      if (match.playerScore > match.opponentScore) {
        stats.gamesWon++;
        if (isNationalEvent && match.round === 'Sectional') {
          stats.roundPoints += 2;
        }
      } else if (match.playerScore < match.opponentScore) {
        stats.gamesLost++;
      }
      
      // Track finals appearance
      if (match.round && ['Quarter Final', 'Semi Final', 'Final'].includes(match.round)) {
        stats.finalsAppearance = true;
        stats.finalsRound = match.round;
        
        if (isNationalEvent) {
          // Award more points in finals
          if (match.playerScore > match.opponentScore) {
            stats.finalsPoints += match.round === 'Final' ? 4 : (match.round === 'Semi Final' ? 3 : 2);
          }
        }
        
        if (match.round === 'Final') {
          stats.finalsResult = match.playerScore > match.opponentScore ? 'Win' : 'Loss';
        }
      }
    });
    
    stats.winPercentage = stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(2) : 0;
    
    return stats;
  }
}

module.exports = ScoringService;
