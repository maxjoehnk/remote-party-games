import GameHeader, { GameHeaderProps } from './game-header';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Shared/Game Widgets/Header',
  component: GameHeader,
} as Meta;

const Template: Story<GameHeaderProps> = (args) => <GameHeader {...args}/>;

export const Default = Template.bind({})
Default.args = {
  children: 'Score'
}

export const Timer = Template.bind({})
Timer.args = {
  timer: {
    timeLeft: 60,
    maxTime: 120,
  },
  children: 'Text'
}
