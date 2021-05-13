import TabooExplaining from './explaining.component';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { storeDecorator } from '../../../../store/story-redux-decorator';

export default {
  title: 'Taboo/States/Explaining',
  component: TabooExplaining,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<{}> = (args) => <TabooExplaining {...args} />;

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
