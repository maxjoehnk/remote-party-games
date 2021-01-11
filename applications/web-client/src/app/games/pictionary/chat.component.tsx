import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPictionaryChat } from '../../../store/selectors/pictionary';
import { ChatMessage } from '../../../store/reducers/pictionary';
import { selectPlayerById } from '../../../store/selectors/lobby';
import { guess } from './pictionary-api';
import './chat.component.css';
import i18n from 'es2015-i18n-tag';

const PictionaryChat = () => {
  const messages = useSelector(selectPictionaryChat);

  return (
    <div className="card game-pictionary__chat pictionary-chat">
      <div className="pictionary-chat__messages">
        {messages.map((msg, i) => (
          <MessageEntry key={i} msg={msg} />
        ))}
      </div>

      <ChatInput />
    </div>
  );
};

const MessageEntry = ({ msg }: { msg: ChatMessage }) => {
  if (msg.system != null) {
    return <SystemMessage msg={msg} />;
  }

  const player = useSelector(selectPlayerById(msg.player));

  return (
    <p className="pictionary-chat__message">
      <span className="pictionary-chat-message__player">{player.name}:&nbsp;</span> {msg.message}
    </p>
  );
};

const SystemMessage = ({ msg }: { msg: ChatMessage }) => {
  return <p className="pictionary-chat__message pictionary-chat__message--system">{msg.message}</p>;
};

const ChatInput = () => {
  const [text, setText] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        guess(text);
        setText('');
      }}
    >
      <input
        className="input pictionary-chat__input"
        placeholder={i18n('pictionary')`Enter message...`}
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </form>
  );
};

export default PictionaryChat;
