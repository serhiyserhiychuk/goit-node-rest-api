import dotenv from "dotenv";

dotenv.config();

export const {
  PORT = 3000,
  DB_URI = `mongodb+srv://serhiyserhiychuk07:dtiPSo0NciJWcaQc@cluster0.3k7x662.mongodb.net/db-contacts`,
  SECRET = "ILIKENODEJS",
  SEND_GRID_API_KEY = "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",
} = process.env;
