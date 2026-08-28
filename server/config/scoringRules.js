/**
 * Scoring Rules Documentation
 * Reference for tournament scoring formats
 */

const SCORING_RULES = {
  pennants: {
    name: 'Pennants',
    description: 'Standard competitive lawn bowls format',
    rules: {
      win: {
        points: 2,
        condition: 'Team scores more shots than opponent'
      },
      draw: {
        points: 1,
        condition: 'Both teams score equal shots',
        note: 'Both teams share the bonus'
      },
      loss: {
        points: 0,
        condition: 'Team scores fewer shots than opponent'
      }
    },
    bonusPoints: 'Shared equally when teams tie',
    appliesTo: ['National', 'Sanctioned']
  },
  
  standardPlay: {
    name: 'Standard Play',
    description: 'Single discipline competitive format',
    rules: {
      win: { points: 2, condition: 'Team scores more shots' },
      draw: { points: 1, condition: 'Both teams score equal shots' },
      loss: { points: 0, condition: 'Team scores fewer shots' }
    },
    bonusPoints: 'Shared equally when teams tie',
    appliesTo: ['Sanctioned', 'Select']
  },
  
  setPlay: {
    name: 'Set Play',
    description: 'Multiple disciplines combined (e.g., Singles/Fours or Pairs/Triples)',
    rules: {
      cleanSweep: {
        points: 4,
        condition: 'Team wins all disciplines in set',
        note: 'Only awarded if team wins every game in the set'
      },
      win: {
        points: 2,
        condition: 'Team wins more disciplines than opponent (when no clean sweep)'
      },
      draw: {
        points: 1,
        condition: 'Both teams win equal number of disciplines',
        note: 'Both teams share the bonus'
      },
      loss: {
        points: 0,
        condition: 'Team wins fewer disciplines than opponent'
      }
    },
    bonusPoints: 'Clean sweep = 4pts, otherwise shared for ties',
    appliesTo: ['National']
  },
  
  select: {
    name: 'Select',
    description: 'Selection-based tournament (selected players only)',
    rules: {
      win: { points: 2, condition: 'Team scores more shots' },
      draw: { points: 1, condition: 'Both teams score equal shots' },
      loss: { points: 0, condition: 'Team scores fewer shots' }
    },
    appliesTo: ['National', 'Sanctioned']
  }
};

const PLAYER_POINTS_NATIONAL_EVENTS = {
  sectionalRound: {
    description: 'Points earned during sectional/qualifying rounds',
    win: 2,
    draw: 1,
    loss: 0,
    bonus: 'Shared for draws'
  },
  
  quarterFinal: {
    description: 'Quarter Final round points',
    win: 2,
    bonus: 1,
    appearance: 'Recorded as finals appearance'
  },
  
  semiFinal: {
    description: 'Semi Final round points',
    win: 3,
    bonus: 2,
    appearance: 'Recorded as finals appearance'
  },
  
  final: {
    description: 'Grand Final round points',
    win: 4,
    loss: 2,
    appearance: 'Recorded as finals appearance with result',
    note: 'Loser of final still receives 2 points'
  },
  
  bonusPointsSetPlay: {
    description: 'Additional points for Set Play format',
    cleanSweepMultiplier: 1.5,
    note: 'Clean sweep bonus multiplied by 1.5 in national events'
  }
};

const TIEBREAKER_RULES = {
  order: [
    'Total Points',
    'Point Differential (For - Against)',
    'Points For',
    'Head-to-Head Result',
    'Random Draw'
  ],
  description: 'Order of application for ranking tied teams in ladder'
};

const BYE_RULES = {
  definition: 'A round with no opposition - team automatically advances',
  application: 'Automatic bye in round-robin when odd number of teams',
  points: 'Team receives bye, no points awarded',
  usage: 'Common in sectional rounds with odd team counts'
};

const FINALS_QUALIFICATION = {
  standard: {
    format: 'Single Elimination',
    description: 'Qualify to Quarter Final, Semi Final, then Final',
    topTeams: 'Top team(s) from each section qualify'
  },
  
  doubleElimination: {
    format: 'Double Elimination',
    description: 'Teams compete in winners and losers brackets',
    advantage: 'Eliminated team gets second chance in losers bracket'
  },
  
  grandFinal: {
    description: 'Finals typically best-of-series or single match',
    pointsRecorded: 'All finals results tracked separately for player records'
  }
};

module.exports = {
  SCORING_RULES,
  PLAYER_POINTS_NATIONAL_EVENTS,
  TIEBREAKER_RULES,
  BYE_RULES,
  FINALS_QUALIFICATION
};
