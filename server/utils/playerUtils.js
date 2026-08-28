/**
 * Player Utilities
 * Helper functions for player management and stats
 */

const calculateCareerStats = (allTournaments) => {
  let totalTournaments = 0;
  let totalGames = 0;
  let totalWins = 0;
  let totalLosses = 0;
  let finalsAppearances = 0;
  let finalsWins = 0;
  
  allTournaments.forEach(tournament => {
    totalTournaments++;
    totalGames += tournament.gamesPlayed || 0;
    totalWins += tournament.gamesWon || 0;
    totalLosses += tournament.gameLost || 0;
    
    if (tournament.finalsAppearance) {
      finalsAppearances++;
      if (tournament.finalsResult === 'Win') {
        finalsWins++;
      }
    }
  });
  
  return {
    totalTournaments,
    totalGames,
    totalWins,
    totalLosses,
    winPercentage: totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0,
    finalsAppearances,
    finalsWins,
    finalsWinPercentage: finalsAppearances > 0 ? ((finalsWins / finalsAppearances) * 100).toFixed(2) : 0
  };
};

const getPlayerFormattedName = (player) => {
  return `${player.firstName} ${player.lastName}`.trim();
};

const getPlayerPositionString = (positions) => {
  return positions && positions.length > 0 ? positions.join(', ') : 'Not specified';
};

const getPlayerEligibilityStatus = (player) => {
  if (!player.selectionEligibility) {
    return 'Not eligible';
  }
  
  if (player.selectionEligibility.isNationalEligible) {
    const lastSelected = player.selectionEligibility.lastSelectedDate;
    const daysAgo = lastSelected ? Math.floor((Date.now() - new Date(lastSelected)) / (1000 * 60 * 60 * 24)) : null;
    
    return {
      eligible: true,
      lastSelected,
      daysAgo,
      consecutiveSelections: player.selectionEligibility.consecutiveSelections
    };
  }
  
  return 'Not eligible';
};

const sortPlayersByWinPercentage = (players) => {
  return [...players].sort((a, b) => {
    const percA = a.careerStats?.winPercentage || 0;
    const percB = b.careerStats?.winPercentage || 0;
    return percB - percA;
  });
};

const sortPlayersByFinalsAppearances = (players) => {
  return [...players].sort((a, b) => {
    const appearsA = a.careerStats?.finalsAppearances || 0;
    const appearsB = b.careerStats?.finalsAppearances || 0;
    return appearsB - appearsA;
  });
};

const getPlayersByPosition = (players, position) => {
  return players.filter(p => 
    p.preferredPositions && p.preferredPositions.includes(position)
  );
};

const validatePlayerData = (player) => {
  const errors = [];
  
  if (!player.firstName || !player.firstName.trim()) {
    errors.push('First name is required');
  }
  
  if (!player.lastName || !player.lastName.trim()) {
    errors.push('Last name is required');
  }
  
  if (!player.email || !player.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }
  
  if (player.handicap && (player.handicap < -4 || player.handicap > 10)) {
    errors.push('Handicap must be between -4 and 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  calculateCareerStats,
  getPlayerFormattedName,
  getPlayerPositionString,
  getPlayerEligibilityStatus,
  sortPlayersByWinPercentage,
  sortPlayersByFinalsAppearances,
  getPlayersByPosition,
  validatePlayerData
};
