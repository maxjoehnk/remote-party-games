import TabooPlayerList from './taboo-player-list.component';
import { storeDecorator } from '../../../store/story-redux-decorator';
import { TabooCurrentRoundState } from '../../../contracts/taboo-game-configuration';
import { PlayerModel } from '../../../contracts/player.model';
import { TeamModel } from '../../../contracts/team.model';
import React from 'react';

export default {
  title: 'Taboo/Elements/Player List',
  component: TabooPlayerList,
}
const Template = () => <TabooPlayerList />;

export const Default = Template.bind({});
Default.args = {
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
Default.decorators = [storeDecorator({
  taboo: {
    currentRound: Default.args.currentRound
  },
  lobby: {
    players: Default.args.players,
    teams: Default.args.teams,
  },
  player: Default.args.player,
})]
