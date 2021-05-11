import { Header, HeaderProps } from './header.component';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Page Elements/Header',
  component: Header,
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args}/>;

export const Default = Template.bind({});
Default.args = {
  player: {
    id: 'player',
    name: 'Player'
  }
}
