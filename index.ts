import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import apiKeyAuth from "./middleware/apiKeyAuth";
import flightRouter from "./routes/flightRoutes";
import { initializeScheduler } from "./core/scheduler";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

app.use(apiKeyAuth);

app.use("/api", flightRouter);

app.get("/", async (req: Request, res: Response) => {
  try {
    res.send(`👋 Hello from flightsAIagent!`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while connecting to the agent");
  }
});

if (process.env.NODE_ENV !== "test") {
  //   initializeScheduler();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
