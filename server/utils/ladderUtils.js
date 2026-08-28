/**
 * Ladder Utilities
 * Helper functions for ladder management and calculations
 */

const updateTeamLadderEntry = (entry, result, playType) => {
  const updated = { ...entry };
  
  // Determine points based on result
  let team1Points = 0;
  let team2Points = 0;
  
  if (result.team1Score > result.team2Score) {
    team1Points = 2;
  } else if (result.team2Score > result.team1Score) {
    team2Points = 2;
  } else {
    team1Points = 1;
    team2Points = 1;
  }
  
  updated.gamesPlayed++;
  updated.pointsFor += result.team1Score || 0;
  updated.pointsAgainst += result.team2Score || 0;
  
  if (result.team1Score > result.team2Score) {
    updated.gamesWon++;
  } else if (result.team2Score > result.team1Score) {
    updated.gamesLost++;
  } else {
    updated.gamesDrawn++;
  }
  
  updated.totalPoints += team1Points;
  updated.percentage = ((updated.gamesWon / updated.gamesPlayed) * 100).toFixed(2);
  
  return updated;
};

const rankLadderEntries = (entries) => {
  const sorted = [...entries].sort((a, b) => {
    // Sort by total points first
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    
    // Then by point differential
    const diffA = (a.pointsFor || 0) - (a.pointsAgainst || 0);
    const diffB = (b.pointsFor || 0) - (b.pointsAgainst || 0);
    if (diffB !== diffA) {
      return diffB - diffA;
    }
    
    // Then by points for
    return (b.pointsFor || 0) - (a.pointsFor || 0);
  });
  
  return sorted.map((entry, idx) => ({ ...entry, position: idx + 1 }));
};

const getLadderStats = (ladder) => {
  if (!ladder.entries || ladder.entries.length === 0) {
    return {
      totalTeams: 0,
      averagePoints: 0,
      totalGamesPlayed: 0,
      topTeam: null,
      bottomTeam: null
    };
  }
  
  const sorted = rankLadderEntries(ladder.entries);
  const totalPoints = sorted.reduce((sum, entry) => sum + (entry.totalPoints || 0), 0);
  const totalGames = sorted.reduce((sum, entry) => sum + (entry.gamesPlayed || 0), 0);
  
  return {
    totalTeams: sorted.length,
    averagePoints: (totalPoints / sorted.length).toFixed(2),
    totalGamesPlayed: totalGames,
    topTeam: sorted[0],
    bottomTeam: sorted[sorted.length - 1],
    gapToTop: sorted[1] ? (sorted[0].totalPoints - sorted[1].totalPoints) : 0
  };
};

const getQualificationPositions = (ladder, numQualify) => {
  const sorted = rankLadderEntries(ladder.entries);
  return sorted.slice(0, numQualify);
};

const calculateAverageOpponentRanking = (ladder, teamId) => {
  // This would require fixture data to calculate
  // Placeholder for future implementation
  return 0;
};

const detectTiedTeams = (ladder, positions = 1) => {
  const sorted = rankLadderEntries(ladder.entries);
  const tied = [];
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].totalPoints === sorted[i + 1].totalPoints) {
      if (!tied[i]) tied[i] = [];
      tied[i].push(sorted[i]);
      tied[i].push(sorted[i + 1]);
    }
  }
  
  return tied.filter(t => t && t.length > 0);
};

module.exports = {
  updateTeamLadderEntry,
  rankLadderEntries,
  getLadderStats,
  getQualificationPositions,
  calculateAverageOpponentRanking,
  detectTiedTeams
};
