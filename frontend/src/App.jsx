import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'chat'
  const [roomCode, setRoomCode] = useState(null);

  const handleCreateRoom = (code) => {
    setRoomCode(code);
    setScreen('chat');
  };

  const handleJoinRoom = (code) => {
    setRoomCode(code);
    setScreen('chat');
  };

  const handleLeaveChat = () => {
    setRoomCode(null);
    setScreen('home');
  };

  return (
    <div className="App">
      {screen === 'home' && (
        <HomePage
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}
      {screen === 'chat' && roomCode && (
        <ChatRoom
          roomCode={roomCode}
          onLeave={handleLeaveChat}
        />
      )}
    </div>
  );
}

export default App;
