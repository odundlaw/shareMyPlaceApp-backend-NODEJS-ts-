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
import userRoutes from "./modules/user/user.route";
import bodyParser from "body-parser";

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

app.use("/api/users", userRoutes)


const httpServer = createServer(app);

const server = httpServer.listen(PORT, () => {
    logger.info(`App listening at localhost://${PORT}`);
    connectToDatabase();
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