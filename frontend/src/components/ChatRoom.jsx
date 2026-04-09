import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import '../styles/ChatRoom.css';

function ChatRoom({ roomCode, onLeave }) {
  const {
    messages,
    isConnected,
    userJoined,
    userLeft,
    error,
    finalRoomCode,
    sendMessage
  } = useChat(roomCode);

  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !isConnected) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyCode = () => {
    if (finalRoomCode) {
      navigator.clipboard.writeText(finalRoomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="chat-error">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={onLeave}>
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <h2>💬 Chat</h2>
          <div className="room-code">
            <span>{finalRoomCode || 'Connecting...'}</span>
            {finalRoomCode && (
              <button
                className="btn-copy"
                onClick={handleCopyCode}
                title="Copy room code"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            )}
          </div>
        </div>
        <div className="header-right">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {userJoined && (
        <div className="status-message joined">
          ✓ Another user joined the chat!
        </div>
      )}
      {userLeft && (
        <div className="status-message left">
          ✕ The user left the chat
        </div>
      )}

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="no-messages">
            <p>No messages yet. Waiting for connection...</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isOwn ? 'own' : 'other'}`}
          >
            <div className="message-content">
              <p className="message-text">{msg.text}</p>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          rows="1"
        />
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={!isConnected || !inputText.trim()}
          title="Send message (Enter)"
        >
          ➤ Send
        </button>
      </div>

      {/* Leave Button */}
      <button className="btn-leave" onClick={onLeave}>
        ← Leave Chat
      </button>
    </div>
  );
}

export default ChatRoom;
