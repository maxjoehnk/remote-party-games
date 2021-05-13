import TabooGame from './taboo-game.component';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { storeDecorator } from '../../../store/story-redux-decorator';
import {
  PastCardAnswer,
  TabooCurrentRoundState,
  TabooView
} from '../../../contracts/taboo-game-configuration';
import { PlayerModel } from '../../../contracts/player.model';
import { TeamModel } from '../../../contracts/team.model';

export default {
  title: 'Taboo/Page',
  component: TabooGame
} as Meta;

const mapArgsToState = (args) => ({  taboo: {
    teamOne: {
      points: args.score[0],
    },
    teamTwo: {
      points: args.score[1],
    },
    currentCard: args.currentCard,
    currentRound: args.currentRound,
    view: args.view,
    cards: args.cards,
  },
  lobby: {
    players: args.players,
    teams: args.teams,
    game: {
      config: args.config
    }
  },
  player: args.player,
})

const Template: Story<{}> = () => <TabooGame/>;

export const Explaining = Template.bind({});
Explaining.args = {
  score: [2, 5],
  config: {
    timer: 100,
  },
  view: TabooView.Explaining,
  currentCard: {
    term: 'Term',
    taboo: new Array(5).fill(null).map((_, i) => `Term ${i}`)
  },
  cards: [],
  currentRound: {
    team: 1,
    activePlayer: 'p1',
    timeLeft: 50
  } as TabooCurrentRoundState,
  players: [{
    id: 'p1',
    name: 'Player 1'
  }, {
    id: 'p2',
    name: 'Player 2'
  }, {
    id: 'p3',
    name: 'Player 3'
  }, {
    id: 'p4',
    name: 'Player 4'
  }] as PlayerModel[],
  teams: [{
    id: 'team1',
    name: 'Team 1',
    players: ['p1', 'p2']
  }, {
    id: 'team2',
    name: 'Team 2',
    players: ['p3', 'p4']
  }] as TeamModel[],
  player: {
    id: 'p1',
  }
}
Explaining.decorators = [storeDecorator(mapArgsToState(Explaining.args))]

export const Guessing = Template.bind({});
Guessing.args = {
  ...Explaining.args,
  view: TabooView.Guessing,
}
Guessing.decorators = [storeDecorator(mapArgsToState(Guessing.args))]

export const Observing = Template.bind({});
Observing.args = {
  ...Explaining.args,
  view: TabooView.Observing,
}
Observing.decorators = [storeDecorator(mapArgsToState(Observing.args))]

export const Continue = Template.bind({});
Continue.args = {
  ...Explaining.args,
  view: TabooView.Continue,
}
Continue.decorators = [storeDecorator(mapArgsToState(Continue.args))]

export const Waiting = Template.bind({});
Waiting.args = {
  ...Explaining.args,
  view: TabooView.Waiting,
  cards: [PastCardAnswer.Guessed, PastCardAnswer.TimedOut, PastCardAnswer.Skipped].map(answer => ({
    card: {
      term: 'Term',
      taboo: new Array(5).fill(null).map((_, i) => `Term ${i}`)
    },
    answer
  })),
}
Waiting.decorators = [storeDecorator(mapArgsToState(Waiting.args))]
