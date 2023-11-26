import express, { Request, Response, NextFunction } from "express";

import "dotenv/config";
import cors from "cors";
import env from "./env";
const path = require("path");
import userRouter from "./routes/User";
import deviceRouter from "./routes/Devices";
import mediaRouter from "./routes/Upload"

const app = express();
app.use(express.static(path.join(__dirname, "public/assets")));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/device", deviceRouter);
app.use("/api/device", deviceRouter);
app.use("/api/media", mediaRouter);

app.use((req: any, res: any, next: NextFunction) => {
  next(Error("Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An error in server has occured";
  if (error instanceof Error) errorMessage = error.message;
  console.log(error);
  res.status(500).json({ msg: errorMessage });
});

const port = env.PORT;
app.listen(port, () => {
  console.log(`APP is running on port ${env.PORT}`);
});
