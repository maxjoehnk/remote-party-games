import { Meta, Story } from '@storybook/react';
import React from 'react';
import TabooGuessing from './guessing.component';

export default {
  title: 'Taboo/States/Guessing',
  component: TabooGuessing,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Template: Story<{}> = (args) => <TabooGuessing {...args}/>;

export const Default = Template.bind({});
Default.args = {}
