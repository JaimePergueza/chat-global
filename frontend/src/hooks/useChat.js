import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export function useChat(roomCodeProp) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userJoined, setUserJoined] = useState(false);
  const [userLeft, setUserLeft] = useState(false);
  const [error, setError] = useState(null);
  const [finalRoomCode, setFinalRoomCode] = useState(null);
  const [userId] = useState(uuidv4());

  useEffect(() => {
    // Connect to backend
    const newSocket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✓ Connected to backend');
      setIsConnected(true);
      setError(null);

      // If roomCodeProp exists, join that room; otherwise create new
      if (roomCodeProp) {
        newSocket.emit('join_room', roomCodeProp, (response) => {
          if (response.success) {
            setFinalRoomCode(roomCodeProp);
            console.log('✓ Joined room:', roomCodeProp);
          } else {
            setError(response.error || 'Failed to join room');
          }
        });
      } else {
        // Create new room
        newSocket.emit('create_room', (response) => {
          if (response.success) {
            setFinalRoomCode(response.roomCode);
            console.log('✓ Room created:', response.roomCode);
          } else {
            setError('Failed to create room');
          }
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('✕ Disconnected from backend');
      setIsConnected(false);
    });

    newSocket.on('message_received', (message) => {
      console.log('💬 Message received:', message.text);
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          isOwn: message.senderId === newSocket.id
        }
      ]);
      // Clear status messages
      setUserJoined(false);
      setUserLeft(false);
    });

    newSocket.on('user_joined', () => {
      console.log('✓ User joined');
      setUserJoined(true);
      setTimeout(() => setUserJoined(false), 3000);
    });

    newSocket.on('user_left', () => {
      console.log('✕ User left');
      setUserLeft(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Connection error. Please check your internet.');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomCodeProp]);

  const sendMessage = useCallback(
    (text) => {
      if (!socket || !isConnected || !text.trim()) return;

      const messageId = uuidv4();
      socket.emit('send_message', { text }, (response) => {
        if (response.success) {
          console.log('✓ Message sent:', text);
          // Add own message to state immediately
          setMessages((prev) => [
            ...prev,
            {
              id: messageId,
              senderId: socket.id,
              text,
              timestamp: Date.now(),
              isOwn: true
            }
          ]);
        } else {
          console.error('Failed to send message:', response.error);
        }
      });
    },
    [socket, isConnected]
  );

  return {
    messages,
    isConnected,
    userJoined,
    userLeft,
    error,
    finalRoomCode,
    sendMessage
  };
}
