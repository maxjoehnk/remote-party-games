import Welcome from './welcome.component';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Routes/Welcome',
  component: Welcome,
} as Meta;

const Template: Story<{}> = (args) => <Welcome {...args}/>;

export const Default = Template.bind({});
Default.args = {}
