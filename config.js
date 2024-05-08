import dotenv from "dotenv";

dotenv.config();

export const {
  PORT = 3000,
  DB_URI = `mongodb+srv://serhiyserhiychuk07:dtiPSo0NciJWcaQc@cluster0.3k7x662.mongodb.net/db-contacts`,
} = process.env;
