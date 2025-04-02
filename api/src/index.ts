import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "../src/routes/Product-Route";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if not in .env

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(" 'uploads' directory created!");
}

// CORS policy
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'uploads' directory
app.use("/api/uploads", express.static(uploadDir));

// Middleware to set JSON content type for product-related API routes
app.use(
  "/api/products",
  (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  },
  productRoutes
);

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server started at http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
