# 🎨 Skribbl.io Clone

A fun and interactive **multiplayer drawing & guessing game** inspired by [skribbl.io](https://skribbl.io), built using the **MERN Stack** with **Socket.IO** for real-time communication. Players can create private rooms, invite friends, draw words, guess sketches, and compete for points in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

---

## 🌟 Features

### 🔌 Real-time Multiplayer Gameplay
- Create private game rooms
- Join using room codes
- Live player synchronization with Socket.IO

### 🖌️ Interactive Drawing Canvas
- Draw using HTML5 Canvas
- Change brush colors
- Adjust brush sizes
- Undo strokes
- Clear the board

### 🎮 Game Flow Management
- Automatic turn rotation
- Round-based gameplay
- Countdown timers
- Automatic host reassignment on disconnect

### 🏆 Scoring System
- Players earn points for correct guesses
- Drawer earns points when others guess correctly
- Real-time leaderboard updates

### 💬 Live Chat System
- Instant message updates
- Real-time guessing system
- Room-based chat communication

### 📱 Responsive UI
- Modern UI built using React & Tailwind CSS
- Smooth and responsive gameplay experience

---

## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Real-time** | Socket.IO |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Databases) |

---

## 🌐 Live Demo

| Service | Link |
|---------|------|
| 🖥️ Frontend | [Skribbl.io Clone Frontend](https://skribbl-io-clone-gamma.vercel.app/) |
| ⚙️ Backend API | [Skribbl.io Clone Backend API](https://skribbl-io-clone-vgl8.onrender.com) |
---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VipinKumar-70/skribbl.io-Clone.git
cd skribbl.io-Clone
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend server:

```bash
npm run dev
```

---

## 🛠 Usage

1. **Create a private room**
2. **Share the room code** with friends
3. **Start the game** and take turns drawing
4. **Guess words** in real-time
5. **Earn points** and compete on the leaderboard

---

## 📂 Project Structure

```
skribbl-clone/
│
├── frontend/        # React + Vite Frontend
├── backend/         # Node.js + Express Backend
└── README.md
```

---

## 🧠 What I Learned

### 🔌 Socket.IO & Real-Time Communication

This project helped me deeply understand how **WebSockets** work using **Socket.IO**.

Instead of repeatedly sending HTTP requests, Socket.IO maintains a constant two-way connection between the client and server. Each player joins a unique room, allowing events like drawings, guesses, scores, and chat messages to instantly sync for everyone in that room.

Key learnings:
- Handle player disconnects gracefully
- Automatically reassign hosts
- Broadcast room-specific events
- Sync game state across multiple users in real-time

### 🎨 HTML5 Canvas

The multiplayer drawing board was built using the native `<canvas>` element. Whenever a player draws:
- Mouse coordinates are tracked continuously
- Lines are rendered using `canvas.getContext('2d')`
- Drawing data (X/Y coordinates, brush color, size) is emitted through Socket.IO
- Other connected players receive the same data and render the exact drawing instantly

Key learnings:
- Canvas rendering
- Coordinate systems
- Real-time synchronization
- Multiplayer event handling

---

## 🔒 Security & Validation

- Room-based socket isolation
- Server-side game state validation
- Input sanitization for chat messages
- Proper disconnect handling
- Environment variable protection using `.env`

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Submit a pull request

Please follow proper coding conventions and write clean, maintainable code.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📩 Contact

**Vipin Kumar**

📧 [vipin70kr@gmail.com](mailto:vipin70kr@gmail.com)

---

> ⭐ If you found this project helpful, consider giving it a star!