import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

// Initialize Socket.io
connectToSocket(server);

// Set port

const PORT = process.env.PORT || 8000;
// const PORT=3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// API Routes
app.use("/api/v1/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Mongo + Server Start
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
  "mongodb+srv://mehtaprity83:SOMPRIT@cluster0.ecpxgf3.mongodb.net/"
    );

    console.log(` MongoDB connected at host: ${connectionDb.connection.host}`);

    // Start server (only once)
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

start();
