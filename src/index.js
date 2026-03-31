import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/database.js";
import app from "./app.js";

const httpServer = createServer(app);

/**
 * Socket.IO server — attached to the same HTTP server as Express.
 * CORS mirrors app.js so cookies/credentials work cross-origin.
 */
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Client joins a room based on their role
  // Frontend calls: socket.emit("join", "admin") or socket.emit("join", userId)
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

    httpServer.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });
  } catch (er) {
    console.error("START FAILED:", er.message);
    process.exit(1);
  }
};

startServer();
