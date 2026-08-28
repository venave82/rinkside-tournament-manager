/**
 * Test Fixtures & Examples
 * Sample data for testing various scenarios
 */

const SAMPLE_TOURNAMENT = {
  tournamentName: 'Test Fours Championship',
  location: {
    club: 'Test Bowling Club',
    address: '123 Test Lane',
    city: 'TestCity',
    state: 'TS',
    postcode: '1234'
  },
  eventType: 'National',
  dates: [
    { date: new Date('2024-09-15'), greens: [1, 2, 3, 4] },
    { date: new Date('2024-09-16'), greens: [1, 2, 3, 4] }
  ],
  discipline: 'Fours',
  playType: 'Pennants',
  numberOfSections: 2,
  numberOfGreens: 4
};

const SAMPLE_TEAMS = [
  {
    teamName: 'Team A',
    club: 'Club A',
    players: [
      { name: 'Player 1', position: 'Skip' },
      { name: 'Player 2', position: 'Third' },
      { name: 'Player 3', position: 'Second' },
      { name: 'Player 4', position: 'Lead' }
    ]
  },
  {
    teamName: 'Team B',
    club: 'Club B',
    players: [
      { name: 'Player 5', position: 'Skip' },
      { name: 'Player 6', position: 'Third' },
      { name: 'Player 7', position: 'Second' },
      { name: 'Player 8', position: 'Lead' }
    ]
  },
  {
    teamName: 'Team C',
    club: 'Club C',
    players: [
      { name: 'Player 9', position: 'Skip' },
      { name: 'Player 10', position: 'Third' },
      { name: 'Player 11', position: 'Second' },
      { name: 'Player 12', position: 'Lead' }
    ]
  }
];

const SAMPLE_FIXTURE_RESULT = {
  team1Score: 18,
  team2Score: 15
};

const SAMPLE_LADDER_ENTRY = {
  position: 1,
  gamesPlayed: 2,
  gamesWon: 2,
  gamesLost: 0,
  gamesDrawn: 0,
  pointsFor: 35,
  pointsAgainst: 28,
  bonusPoints: 0,
  totalPoints: 4,
  percentage: 100
};

module.exports = {
  SAMPLE_TOURNAMENT,
  SAMPLE_TEAMS,
  SAMPLE_FIXTURE_RESULT,
  SAMPLE_LADDER_ENTRY
};
