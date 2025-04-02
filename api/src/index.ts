import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "../src/routes/Product-Route";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 3000; // if not specified in .env

// cors policy
app.use(
  cors({
    origin: "*", // Allow requests from all origin 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middleware to parse body json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// path for "uploads" directory
app.use("/api/uploads", express.static("uploads"));


// middleware to set JSON content type for product-related API routes
app.use(
  "/api/products",
  (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  },
  productRoutes
);


// initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    console.log("database connected successfully");
    app.listen(PORT, () =>
      console.log(`server started at http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("database connection failed:", error);
  });
