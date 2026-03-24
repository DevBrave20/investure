import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import transactionRoute from "./routes/transaction-route.js";
import investRoute from "./routes/invest-controller.js";
import adminRoute from "./routes/admin-route.js";
import { updateInvestment } from "./controllers/invest-controller.js";
import withdrawRoute from "./routes/withdraw-route.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/api/cron", async (req, res) => {
  try {
    await updateInvestment();
    res.status(200).send("Cron job executed successfully");
  } catch (error) {
    console.error("Error executing cron job:", error);
    res.status(500).send("Error executing cron job", error);
  }
});

const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 30 * 1000,
  message: (req, res) => {
    return res.status(400).json({
      message: "Too many request, Please try again after 30mins!",
    });
  },
});

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to Cryptexion server.",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: "/swagger.json",
  },
  customCss: ".swagger-ui { background-color: #fafafa; }",
  customSiteTitle: "Cryptexion API Documentation",
}));

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// app.use("/api/user/login", limiter);
// app.use("/api/user/verify", limiter);

app.use("/api", userRouter);
app.use("/api", transactionRoute);
app.use("/api", investRoute);
app.use("/api", adminRoute);
app.use("/api", withdrawRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    message: `This Route ${req.originalUrl} does not exist on this Server`,
  });
});

export default app;
