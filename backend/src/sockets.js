import { v4 as uuidv4 } from 'uuid';

// Estado global: guardar sesiones activas
const activeSessions = {};

// Generar código de sala legible (ej: ABC-123-XYZ)
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 2) code += '-';
  }
  return code;
}

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`👤 New connection: ${socket.id}`);

    // Event: New user creates a chat room
    socket.on('create_room', (callback) => {
      const roomCode = generateRoomCode();
      const sessionId = uuidv4();

      activeSessions[roomCode] = {
        sessionId,
        users: [socket.id],
        messages: [],
        createdAt: Date.now()
      };

      socket.join(roomCode);
      socket.data.roomCode = roomCode;

      console.log(`🆕 Room created: ${roomCode}`);

      callback({
        success: true,
        roomCode,
        sessionId,
        message: 'Chat room created. Share this code with your friend!'
      });
    });

    // Event: User joins existing room with code
    socket.on('join_room', (roomCode, callback) => {
      roomCode = roomCode.toUpperCase();

      if (!activeSessions[roomCode]) {
        callback({
          success: false,
          error: 'Room not found. Check the code and try again.'
        });
        return;
      }

      const room = activeSessions[roomCode];

      // Allow max 2 users per room
      if (room.users.length >= 2) {
        callback({
          success: false,
          error: 'Chat room is full (max 2 users).'
        });
        return;
      }

      room.users.push(socket.id);
      socket.join(roomCode);
      socket.data.roomCode = roomCode;

      console.log(`➕ User joined room: ${roomCode} (users: ${room.users.length})`);

      // Notify both users
      io.to(roomCode).emit('user_joined', {
        roomCode,
        usersCount: room.users.length,
        message: 'Another user joined the chat!'
      });

      callback({
        success: true,
        roomCode,
        usersCount: room.users.length,
        message: 'Successfully joined the chat room!'
      });
    });

    // Event: Send message
    socket.on('send_message', (data, callback) => {
      const roomCode = socket.data.roomCode;

      if (!roomCode || !activeSessions[roomCode]) {
        callback({ success: false, error: 'Not in a room' });
        return;
      }

      const message = {
        id: uuidv4(),
        senderId: socket.id,
        text: data.text,
        timestamp: Date.now()
      };

      activeSessions[roomCode].messages.push(message);

      // Broadcast to room
      io.to(roomCode).emit('message_received', message);

      console.log(`💬 Message in ${roomCode}: "${data.text}"`);

      callback({ success: true, messageId: message.id });
    });

    // Event: Get room info
    socket.on('get_room_info', (callback) => {
      const roomCode = socket.data.roomCode;

      if (!roomCode || !activeSessions[roomCode]) {
        callback({ success: false });
        return;
      }

      const room = activeSessions[roomCode];
      callback({
        success: true,
        roomCode,
        usersCount: room.users.length,
        messageCount: room.messages.length
      });
    });

    // Event: Disconnect
    socket.on('disconnect', () => {
      const roomCode = socket.data.roomCode;

      if (roomCode && activeSessions[roomCode]) {
        const room = activeSessions[roomCode];
        room.users = room.users.filter(id => id !== socket.id);

        if (room.users.length === 0) {
          // Delete empty room
          delete activeSessions[roomCode];
          console.log(`❌ Room deleted (empty): ${roomCode}`);
        } else {
          // Notify remaining user
          io.to(roomCode).emit('user_left', {
            message: 'The other user left the chat.'
          });
          console.log(`👤 User left room: ${roomCode} (remaining: ${room.users.length})`);
        }
      }

      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
}
