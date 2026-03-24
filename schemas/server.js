import app from "./app.js";
import ServerlessHttp from "serverless-http";
import databaseConnect from "./utils/connect.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
dotenv.config()

const port = process.env.PORT;

export const handler = ServerlessHttp(app);

const startServer = async () => {
  await databaseConnect();
    // schedular.start();
  app.listen(port, () => {
    
    logger.info(`Server started listening on ${port}`);
  })
};

startServer();
