import Button, { ButtonProps } from './button.component';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Shared/UI Elements/Button',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args}/>;

export const Default = Template.bind({});
Default.args = {
  children: 'Text',
  primary: false,
}

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary',
  primary: true,
}
