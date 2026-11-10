import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import { connectToMongoDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();

// Middleware

// Simple logger middleware to log the request method and path
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// cors middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests from the frontend URL
  }),
);

app.use(express.json()); // Parse incoming JSON requests

// Rate limiting middleware
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
const PORT = process.env.PORT || 5001;

await connectToMongoDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1); // Exit the process with an error code
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
