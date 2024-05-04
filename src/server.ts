import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router as Router } from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use("/api", Router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${app.head.name}:${port}`);
});
