import dotenv from "dotenv";

dotenv.config();

export const {
  PORT = 3000,
  DB_URI = `mongodb+srv://serhiyserhiychuk07:dtiPSo0NciJWcaQc@cluster0.3k7x662.mongodb.net/db-contacts`,
  SECRET = "ILIKENODEJS",
  SEND_GRID_API_KEY = "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",
} = process.env;
