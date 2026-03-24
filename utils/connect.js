import dotenv from "dotenv";
import logger from "./logger.js";
import mongoose from "mongoose";
dotenv.config();

const databaseConnect = async ()=> {
  try {
    const dbUrl = process.env.DATABASE_URL
    const connect = await mongoose.connect(dbUrl);
    logger.info(`Database connected to ${connect.Connection.name}`);

  } catch (error) {
    logger.error("Error: " + error.message);
    process.exit(1);
  }
}

export default databaseConnect;