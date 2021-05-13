import { Meta, Story } from '@storybook/react';
import React from 'react';
import TabooContinue from './continue.component';
import { storeDecorator } from '../../../../store/story-redux-decorator';

export default {
  title: 'Taboo/States/Continue',
  component: TabooContinue,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<{}> = (args) => <TabooContinue {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentCard: {
    term: 'Term',
    taboo: new Array(5).fill(null).map((_, i) => `Term ${i + 1}`)
  }
};
Default.decorators = [storeDecorator({
  taboo: {
    ...Default.args
  }
})];
