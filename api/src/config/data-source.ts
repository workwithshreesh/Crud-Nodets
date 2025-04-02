import { DataSource } from "typeorm";
import { Product } from "../models/Products";
import { ProductImage } from "../models/ProductImage";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres", // defining  RDBMS eg mysql or postgres, etc
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, //creates tables based on models always false in production
  logging: true,
  ssl: {
    rejectUnauthorized: false, // ssl certificates its not used by render
  },
  entities: [Product, ProductImage],
  migrations: [],
  subscribers: [],
});