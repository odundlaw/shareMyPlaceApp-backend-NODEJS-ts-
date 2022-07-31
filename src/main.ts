import express, { Request } from "express";
import 'dotenv/config';
import { createServer } from "http";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import busboy from "connect-busboy";

import { connectToDatabase, disconnectDatabase } from "./utils/database";
import constants from "./constants/constants.config";
import logger from "./utils/logger";
import bodyParser from "body-parser";

import userRoutes from "./modules/user/user.route";
import authRoutes from "./modules/auth/auth.route";
import placeRoutes from "./modules/places/places.route"
import { validateAuth } from "./middlewares/validateAuth";

const PORT = process.env.PORT || "8080";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: constants.corsOrigin,
    credentials: true
}))
app.use(busboy({ immediate: true }));
app.use(helmet());


app.use(validateAuth);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/place", placeRoutes);

const httpServer = createServer(app);
const server = httpServer.listen(PORT, async () => {
    await connectToDatabase();
    logger.info(`App listening at localhost://${PORT}`);
});

function gracefulShutdown(signals: string) {
    process.on(signals, () => {
        logger.info("my Job is done here")
        //close the server
        server.close();

        // Datebase exist, close it
        disconnectDatabase();
        process.exit(0)
    })
}

const signals = ["SIGTERM, SIGINT"];

for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i]);
}