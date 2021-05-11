import { PlayerEditor, PlayerEditorProps } from './player-editor.component';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { DispatchProp } from 'react-redux';

export default {
  title: 'Player/Player Editor',
  component: PlayerEditor,
} as Meta;

const Template: Story<DispatchProp & PlayerEditorProps> = (args) => <PlayerEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
  player: {
    id: 'player',
    name: 'name'
  }
};
