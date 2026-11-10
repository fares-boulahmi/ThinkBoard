import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import { connectToMongoDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";

import path from "path";

const app = express();

// Middleware

// Simple logger middleware to log the request method and path
// i don't know it's cost on free plan, so i commented it out for now. if you want to use it, uncomment it and see if it works. if not, just delete it.
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// cors middleware
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL, // Allow requests from the frontend URL
    }),
  );
}

app.use(express.json()); // Parse incoming JSON requests

// Rate limiting middleware
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

await connectToMongoDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1); // Exit the process with an error code
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
