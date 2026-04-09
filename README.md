# 💬 Global Chat - Real-time messaging platform

A simple, real-time chat application where anyone can connect instantly using unique room codes. Built with React, Node.js, and Socket.io.

## 🚀 Features

- ✅ Instant chat between two people
- ✅ Real-time messaging with WebSockets
- ✅ Anonymous connections (no login required)
- ✅ Unique room codes for sharing
- ✅ WhatsApp-style UI
- ✅ Responsive design (mobile & desktop)

## 🏗️ Architecture

```
┌─────────────────────────┐         ┌──────────────────┐
│  Frontend (Vercel)      │◄────────┤  React App       │
│  - React 18            │         │  - Socket.io     │
│  - WhatsApp-style UI   │         │  - UUID-based    │
└─────────────────────────┘         └──────────────────┘
         │                                   │
         │ HTTPS + WSS (WebSocket)          │
         │◄──────────────────────────────────┤
         │                                   │
┌─────────────────────────┐         ┌──────────────────┐
│   Backend (Railway)     │         │  Node.js App     │
│   - Express.js         │◄────────┤  - Socket.io     │
│   - WebSocket Server   │         │  - Room Manager  │
└─────────────────────────┘         └──────────────────┘
```

## 📦 Tech Stack

- **Frontend**: React 18, Socket.io-client, CSS3
- **Backend**: Node.js, Express.js, Socket.io
- **Deployment**:
  - Frontend: Vercel
  - Backend: Railway
  - (No database in MVP - sessions stored in memory)

## 🛠️ Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on `http://localhost:3000`

### Test Locally

1. Open two browser windows/tabs
2. Go to `http://localhost:3000` in both
3. In window 1: Click "Create Chat" → Share code
4. In window 2: Click "Join Chat" → Paste code
5. Send messages in real-time! 🎉

## 🚀 Deployment

### Frontend on Vercel

```bash
# Connect to Vercel (creates .env.production)
vercel
```

### Backend on Railway

```bash
# Connect to Railway
railway login
railway link
railway deploy
```

Set environment variables on Railway:
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-vercel-app.vercel.app`

Then update frontend `.env.production`:
```
REACT_APP_BACKEND_URL=https://your-railway-backend.railway.app
```

## 📝 API Endpoints

### Socket.io Events

#### Client → Server
- `create_room()` → Creates new chat room
- `join_room(roomCode)` → Join existing room
- `send_message(data)` → Send message to room
- `get_room_info()` → Get room status

#### Server → Client
- `user_joined` → Another user joined
- `message_received` → New message in room
- `user_left` → User disconnected
- `connect_error` → Connection failed

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.js        # Express + Socket.io setup
│   │   └── sockets.js       # Socket handlers & room logic
│   ├── package.json
│   ├── .env.example
│   └── vercel.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.jsx     # Welcome screen
│   │   │   └── ChatRoom.jsx     # Chat interface
│   │   ├── hooks/
│   │   │   └── useChat.js       # Socket.io logic hook
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## ⚙️ Customization

### Change room code format
Edit `generateRoomCode()` in `backend/src/sockets.js`

### Adjust UI colors
Edit color variables in `frontend/src/styles/`

### Modify message limit
Add `messageCount` check in `backend/src/sockets.js`

## 🐛 Troubleshooting

**WebSocket connection fails?**
- Check backend is running (`http://localhost:3001/health`)
- Verify `REACT_APP_BACKEND_URL` in frontend `.env`

**Messages not appearing?**
- Open DevTools → Network → check WebSocket (WS) connection
- Ensure both users are in same room code

**Deploy issues?**
- Vercel: Check `REACT_APP_BACKEND_URL` production value
- Railway: Verify env vars are set correctly

## 📄 License

MIT - Free to use and modify

## 🤝 Contributing

Feel free to fork and submit pull requests!

---

**Live Demo Coming Soon!** 🎉
