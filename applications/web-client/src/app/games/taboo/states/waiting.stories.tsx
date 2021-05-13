import { Meta, Story } from '@storybook/react';
import React from 'react';
import TabooWaiting from './waiting.component';
import { PastCardAnswer } from '../../../../contracts/taboo-game-configuration';
import { storeDecorator } from '../../../../store/story-redux-decorator';

export default {
  title: 'Taboo/States/Waiting',
  component: TabooWaiting,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<{}> = (args) => <TabooWaiting {...args} />;

export const Default = Template.bind({});
Default.args = {
  cards: [PastCardAnswer.Guessed, PastCardAnswer.TimedOut, PastCardAnswer.Skipped].map(answer => ({
    card: {
      term: 'Term',
      taboo: new Array(5).fill(null).map((_, i) => `Term ${i}`)
    },
    answer
  }))
};
Default.decorators = [storeDecorator({
  taboo: {
    ...Default.args
  }
})];
