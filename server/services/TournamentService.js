/**
 * Tournament Service
 * Core business logic for tournament operations
 */

const DrawGeneratorService = require('./DrawGeneratorService');
const ScoringService = require('./ScoringService');

class TournamentService {
  /**
   * Initialize tournament sections and generate draws
   * @param {Object} tournament - Tournament object
   * @param {Array} teams - Registered teams
   * @returns {Object} Tournament with generated draws
   */
  static async initializeDraws(tournament, teams) {
    try {
      // 1. Divide teams into sections
      const sections = DrawGeneratorService.divideSections(teams, tournament.numberOfSections);
      
      // 2. Generate round-robin draws for each section
      const draws = {};
      Object.keys(sections).forEach(sectionNum => {
        draws[sectionNum] = DrawGeneratorService.generateRoundRobinDraw(sections[sectionNum]);
      });
      
      // 3. Validate draws
      Object.keys(draws).forEach(sectionNum => {
        const validation = DrawGeneratorService.validateDraw(draws[sectionNum]);
        if (!validation.isValid) {
          throw new Error(`Invalid draw for section ${sectionNum}: ${validation.errors.join(', ')}`);
        }
      });
      
      return {
        tournament,
        sections,
        draws,
        status: 'initialized'
      };
    } catch (error) {
      throw new Error(`Failed to initialize draws: ${error.message}`);
    }
  }

  /**
   * Generate finals bracket from qualified teams
   * @param {Array} qualifiedTeams - Teams qualified for finals
   * @param {String} bracketType - Type of bracket
   * @returns {Object} Finals bracket structure
   */
  static generateFinalsBracket(qualifiedTeams, bracketType = 'Single Elimination') {
    return DrawGeneratorService.generateFinalsBracket(qualifiedTeams, bracketType);
  }

  /**
   * Record match result and update ladder
   * @param {Object} fixture - Fixture object
   * @param {Object} result - Match result
   * @param {Object} ladder - Current ladder
   * @param {String} playType - Tournament play type
   * @returns {Object} Updated ladder
   */
  static recordResult(fixture, result, ladder, playType) {
    // Add result to fixture
    fixture.result = result;
    fixture.status = 'Completed';
    
    // Update ladder
    const updatedLadder = ScoringService.updateLadder(ladder, result, playType);
    
    return updatedLadder;
  }

  /**
   * Calculate qualified teams from ladder
   * @param {Object} ladder - Section ladder
   * @param {Number} numberOfQualified - Number of teams to qualify
   * @returns {Array} Qualified teams ordered by ranking
   */
  static getQualifiedTeams(ladder, numberOfQualified) {
    if (!ladder || !ladder.entries) {
      return [];
    }
    
    return ladder.entries
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, numberOfQualified)
      .map(entry => entry.team);
  }

  /**
   * Get all fixtures for a tournament
   * @param {Object} tournament - Tournament
   * @param {Array} fixtures - All fixtures
   * @param {String} round - Filter by round (optional)
   * @param {Number} section - Filter by section (optional)
   * @returns {Array} Filtered fixtures
   */
  static getFixtures(fixtures, round = null, section = null) {
    let filtered = [...fixtures];
    
    if (round) {
      filtered = filtered.filter(f => f.round === round);
    }
    
    if (section) {
      filtered = filtered.filter(f => f.section === section);
    }
    
    return filtered;
  }

  /**
   * Check for fixture conflicts (same team in different fixtures at same time)
   * @param {Array} fixtures - All fixtures
   * @returns {Array} Conflicts if any
   */
  static findFixtureConflicts(fixtures) {
    const conflicts = [];
    
    for (let i = 0; i < fixtures.length; i++) {
      for (let j = i + 1; j < fixtures.length; j++) {
        const f1 = fixtures[i];
        const f2 = fixtures[j];
        
        // Check if same time and green
        if (f1.date === f2.date && f1.green === f2.green) {
          // Check if same team is in both
          if (f1.team1._id === f2.team1._id || f1.team1._id === f2.team2._id ||
              f1.team2._id === f2.team1._id || f1.team2._id === f2.team2._id) {
            conflicts.push({
              fixture1: f1,
              fixture2: f2,
              reason: 'Same team in different fixtures at same time'
            });
          }
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Generate tournament summary report
   * @param {Object} tournament - Tournament
   * @param {Array} ladders - All section ladders
   * @param {Array} fixtures - All fixtures
   * @returns {Object} Tournament summary
   */
  static generateTournamentSummary(tournament, ladders, fixtures) {
    const completedFixtures = fixtures.filter(f => f.status === 'Completed');
    const totalFixtures = fixtures.length;
    const fixtureProgress = (completedFixtures.length / totalFixtures * 100).toFixed(2);
    
    return {
      tournament: {
        name: tournament.tournamentName,
        location: tournament.location,
        type: tournament.eventType,
        discipline: tournament.discipline,
        playType: tournament.playType,
        dates: tournament.dates,
        status: tournament.status
      },
      progress: {
        fixturesTotalCount: totalFixtures,
        fixturesCompleted: completedFixtures.length,
        fixtureProgressPercentage: fixtureProgress
      },
      sections: ladders.length,
      sectionLadders: ladders.map(l => ({
        section: l.section,
        topTeam: l.entries[0]?.team?.teamName,
        topTeamPoints: l.entries[0]?.totalPoints,
        teamsInSection: l.entries.length
      })),
      timestamp: new Date()
    };
  }
}

module.exports = TournamentService;
