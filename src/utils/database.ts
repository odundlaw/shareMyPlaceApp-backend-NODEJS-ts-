import mongoose from "mongoose";
import logger from "./logger";

import constants from "../constants/constants.config";

export async function connectToDatabase() {
    console.log(constants.dbUrl);
    try {
        await mongoose.connect(constants.dbUrl);
        logger.info("connected to Databse Successful!")
    } catch (err) {
        logger.error("Unable to connect to Datasbe");
        process.exit(1);
    }
}


export async function disconnectDatabase() {

    await mongoose.connection.close();
    logger.info("database connection closed!")

}

