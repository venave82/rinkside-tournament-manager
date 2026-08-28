/**
 * Draw Generator Service
 * Handles automatic division of teams into sections and draw generation
 */

class DrawGeneratorService {
  /**
   * Auto-divide teams into sections
   * @param {Array} teams - Array of teams to divide
   * @param {Number} numberOfSections - Number of sections (1-8)
   * @returns {Object} Sections with teams divided evenly
   */
  static divideSections(teams, numberOfSections) {
    const sections = {};
    const teamsPerSection = Math.ceil(teams.length / numberOfSections);
    
    for (let i = 0; i < numberOfSections; i++) {
      sections[i + 1] = [];
    }
    
    // Distribute teams evenly across sections
    teams.forEach((team, index) => {
      const sectionNumber = (index % numberOfSections) + 1;
      sections[sectionNumber].push(team);
    });
    
    return sections;
  }

  /**
   * Generate round robin draw for section
   * @param {Array} teams - Teams in section
   * @returns {Array} Fixtures for round robin
   */
  static generateRoundRobinDraw(teams) {
    const fixtures = [];
    const teamsCopy = [...teams];
    
    // Handle bye round for odd number of teams
    let byeTeam = null;
    if (teamsCopy.length % 2 !== 0) {
      byeTeam = teamsCopy.pop();
    }
    
    const numberOfRounds = teamsCopy.length - 1;
    
    for (let round = 0; round < numberOfRounds; round++) {
      const fixturesThisRound = [];
      
      // Pair teams
      for (let i = 0; i < teamsCopy.length / 2; i++) {
        fixturesThisRound.push({
          team1: teamsCopy[i],
          team2: teamsCopy[teamsCopy.length - 1 - i],
          round: round + 1,
          isBye: false
        });
      }
      
      // Add bye fixture if needed
      if (byeTeam && round === 0) {
        fixturesThisRound.push({
          team1: byeTeam,
          team2: null,
          round: round + 1,
          isBye: true
        });
      }
      
      fixtures.push(...fixturesThisRound);
      
      // Rotate teams for next round
      teamsCopy.splice(1, 0, teamsCopy.pop());
    }
    
    return fixtures;
  }

  /**
   * Generate finals bracket (single/double elimination)
   * @param {Array} teams - Top teams qualified for finals
   * @param {String} bracketType - 'Single Elimination' or 'Double Elimination'
   * @returns {Object} Finals bracket structure
   */
  static generateFinalsBracket(teams, bracketType = 'Single Elimination') {
    if (bracketType === 'Single Elimination') {
      return this.generateSingleElimination(teams);
    } else if (bracketType === 'Double Elimination') {
      return this.generateDoubleElimination(teams);
    }
  }

  /**
   * Generate single elimination bracket
   * @param {Array} teams - Teams to bracket
   * @returns {Object} Single elimination structure
   */
  static generateSingleElimination(teams) {
    const bracket = {
      quarterFinals: [],
      semiFinals: [],
      finals: [],
      winner: null
    };
    
    // Pair teams for quarter finals
    for (let i = 0; i < teams.length; i += 2) {
      if (teams[i + 1]) {
        bracket.quarterFinals.push({
          team1: teams[i],
          team2: teams[i + 1],
          winner: null
        });
      } else {
        // Bye through to semi finals
        bracket.semiFinals.push({
          team1: teams[i],
          team2: null,
          winner: teams[i]
        });
      }
    }
    
    return bracket;
  }

  /**
   * Generate double elimination bracket
   * @param {Array} teams - Teams to bracket
   * @returns {Object} Double elimination structure
   */
  static generateDoubleElimination(teams) {
    const bracket = {
      winnersRound1: [],
      losersRound1: [],
      winnersRound2: [],
      losersRound2: [],
      winnersRound3: [],
      losersRound3: [],
      finalsBracket: {
        grandfinal: {},
        ifNecessary: {}
      }
    };
    
    // Initial round pairings
    for (let i = 0; i < teams.length; i += 2) {
      bracket.winnersRound1.push({
        team1: teams[i],
        team2: teams[i + 1] || null,
        winner: null
      });
    }
    
    return bracket;
  }

  /**
   * Validate draw consistency
   * @param {Array} fixtures - All fixtures in draw
   * @returns {Object} Validation result with errors if any
   */
  static validateDraw(fixtures) {
    const errors = [];
    const teamFixtures = {};
    
    fixtures.forEach((fixture, index) => {
      if (!fixture.team1) {
        errors.push(`Fixture ${index}: Missing team1`);
      }
      
      if (fixture.team1) {
        teamFixtures[fixture.team1._id] = (teamFixtures[fixture.team1._id] || 0) + 1;
      }
      
      if (fixture.team2 && !fixture.isBye) {
        teamFixtures[fixture.team2._id] = (teamFixtures[fixture.team2._id] || 0) + 1;
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      teamFixtureCount: teamFixtures
    };
  }
}

module.exports = DrawGeneratorService;
