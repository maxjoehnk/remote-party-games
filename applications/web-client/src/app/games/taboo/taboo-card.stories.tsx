import TabooCard, { TabooCardProps } from './taboo-card.component';
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { PastCardAnswer } from '../../../contracts/taboo-game-configuration';

export default {
  title: 'Taboo/Elements/Card',
  component: TabooCard,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<TabooCardProps> = (args) => <TabooCard {...args}/>;

export const Default = Template.bind({});
Default.args = {
  card: {
    term: 'Term',
    taboo: new Array(5).fill(null).map((_, i) => `Term ${i + 1}`),
  }
}

export const Skipped = Template.bind({});
Skipped.args = {
  ...Default.args,
  answer: PastCardAnswer.Skipped,
}

export const Guessed = Template.bind({});
Guessed.args = {
  ...Default.args,
  answer: PastCardAnswer.Guessed,
}

export const TimedOut = Template.bind({});
TimedOut.args = {
  ...Default.args,
  answer: PastCardAnswer.TimedOut,
}
