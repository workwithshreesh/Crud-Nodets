import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "../src/routes/Product-Route";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if not in .env


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

// Ensure the 'uploads' directory exists containinng images
app.use("/api/uploads", express.static("uploads"));

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
