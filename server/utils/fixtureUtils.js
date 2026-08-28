/**
 * Fixture Utilities
 * Helper functions for fixture management and scheduling
 */

const validateFixtureSchedule = (fixtures, greens = 4) => {
  const errors = [];
  const schedule = {};
  
  fixtures.forEach((fixture, idx) => {
    if (!fixture.date || !fixture.green) {
      errors.push(`Fixture ${idx}: Missing date or green assignment`);
      return;
    }

    const key = `${fixture.date}_${fixture.green}`;
    if (schedule[key]) {
      // Check if teams conflict
      const existing = schedule[key];
      if (existing.team1._id === fixture.team1._id || 
          existing.team1._id === fixture.team2?._id ||
          existing.team2?._id === fixture.team1._id ||
          existing.team2?._id === fixture.team2?._id) {
        errors.push(`Fixture ${idx}: Team conflict on green ${fixture.green} at ${fixture.date}`);
      }
    } else {
      schedule[key] = fixture;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    schedule
  };
};

const getFixturesByTeam = (fixtures, teamId) => {
  return fixtures.filter(f => 
    f.team1._id.toString() === teamId.toString() || 
    f.team2?._id.toString() === teamId.toString()
  );
};

const getFixturesByGreen = (fixtures, green, date = null) => {
  let filtered = fixtures.filter(f => f.green === green);
  if (date) {
    filtered = filtered.filter(f => f.date === date);
  }
  return filtered;
};

const getFixturesByRound = (fixtures, round) => {
  return fixtures.filter(f => f.round === round);
};

const getUpcomingFixtures = (fixtures, daysAhead = 7) => {
  const now = new Date();
  const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return fixtures.filter(f => {
    const fixtureDate = new Date(f.date);
    return fixtureDate >= now && fixtureDate <= future && f.status !== 'Completed';
  });
};

const calculateFixtureStats = (fixtures) => {
  return {
    total: fixtures.length,
    scheduled: fixtures.filter(f => f.status === 'Scheduled').length,
    inProgress: fixtures.filter(f => f.status === 'In Progress').length,
    completed: fixtures.filter(f => f.status === 'Completed').length,
    cancelled: fixtures.filter(f => f.status === 'Cancelled').length,
    byes: fixtures.filter(f => f.isBye).length
  };
};

module.exports = {
  validateFixtureSchedule,
  getFixturesByTeam,
  getFixturesByGreen,
  getFixturesByRound,
  getUpcomingFixtures,
  calculateFixtureStats
};
