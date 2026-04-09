import React, { useState } from 'react';
import '../styles/HomePage.css';

function HomePage({ onCreateRoom, onJoinRoom }) {
  const [mode, setMode] = useState(null); // null | 'create' | 'join'
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      // La lógica de crear sala se gestiona en el hook useChat al montar ChatRoom.
      onCreateRoom(null); // Pasamos null, la sala se crea en ChatRoom
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      alert('Please enter a room code');
      return;
    }
    setLoading(true);
    try {
      onJoinRoom(joinCode);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Could not join room. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>💬 Global Chat</h1>
          <p>Connect instantly with anyone, anywhere</p>
        </div>

        {!mode && (
          <div className="home-options">
            <button
              className="btn btn-primary"
              onClick={() => setMode('create')}
            >
              ➕ Create Chat
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setMode('join')}
            >
              🔗 Join Chat
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="home-form">
            <h2>Create New Chat</h2>
            <p className="info-text">
              Share your code with a friend so they can join you
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={handleCreateRoom}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Generate Room Code'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setMode(null)}
            >
              ← Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="home-form">
            <h2>Join Chat</h2>
            <p className="info-text">
              Ask your friend for their room code
            </p>
            <input
              type="text"
              className="input-code"
              placeholder="Enter room code (e.g., ABC-123-XYZ)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength="11"
            />
            <button
              className="btn btn-primary btn-large"
              onClick={handleJoinRoom}
              disabled={loading || !joinCode.trim()}
            >
              {loading ? 'Joining...' : 'Join Chat'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setMode(null);
                setJoinCode('');
              }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
