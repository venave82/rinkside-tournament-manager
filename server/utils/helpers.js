/**
 * Utility Functions
 * Common helper functions for tournament operations
 */

const formatDatetime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

const calculateWinPercentage = (wins, total) => {
  if (total === 0) return 0;
  return ((wins / total) * 100).toFixed(2);
};

const formatPlayerName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim();
};

const generateTeamCode = (clubName, teamNumber) => {
  const clubCode = clubName.substring(0, 3).toUpperCase();
  return `${clubCode}-${teamNumber}`;
};

const getPositionLabel = (position) => {
  const labels = {
    'Lead': 'L',
    'Second': '2',
    'Third': '3',
    'Skip': 'S',
    'Single': 'S'
  };
  return labels[position] || position;
};

const calculatePointDifferential = (pointsFor, pointsAgainst) => {
  return pointsFor - pointsAgainst;
};

const getRoundLabel = (round) => {
  const labels = {
    'Sectional': 'Sectional Round',
    'Quarter Final': 'QF',
    'Semi Final': 'SF',
    'Final': 'Final'
  };
  return labels[round] || round;
};

const getStatusBadgeColor = (status) => {
  const colors = {
    'Scheduled': 'blue',
    'In Progress': 'yellow',
    'Completed': 'green',
    'Cancelled': 'red',
    'Planning': 'gray',
    'Registering': 'blue',
    'Archived': 'gray',
    'Active': 'green',
    'Inactive': 'gray'
  };
  return colors[status] || 'default';
};

const sortLadderEntries = (entries, sortBy = 'totalPoints') => {
  const sorted = [...entries];
  switch (sortBy) {
    case 'totalPoints':
      sorted.sort((a, b) => b.totalPoints - a.totalPoints);
      break;
    case 'percentage':
      sorted.sort((a, b) => b.percentage - a.percentage);
      break;
    case 'pointDifferential':
      const diffA = (a.pointsFor || 0) - (a.pointsAgainst || 0);
      const diffB = (b.pointsFor || 0) - (b.pointsAgainst || 0);
      sorted.sort((a, b) => diffB - diffA);
      break;
    default:
      sorted.sort((a, b) => b.totalPoints - a.totalPoints);
  }
  return sorted.map((entry, idx) => ({ ...entry, position: idx + 1 }));
};

const validateTeamComposition = (players, discipline) => {
  const errors = [];
  
  const requiredCount = {
    'Singles': 1,
    'Pairs': 2,
    'Triples': 3,
    'Fours': 4
  };

  const required = requiredCount[discipline];
  if (players.length !== required) {
    errors.push(`${discipline} requires ${required} players, but ${players.length} provided`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  formatDatetime,
  calculateWinPercentage,
  formatPlayerName,
  generateTeamCode,
  getPositionLabel,
  calculatePointDifferential,
  getRoundLabel,
  getStatusBadgeColor,
  sortLadderEntries,
  validateTeamComposition
};
