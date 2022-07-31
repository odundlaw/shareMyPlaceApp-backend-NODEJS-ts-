import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { createPlace } from "./places.controller";
import { placeShema } from "./places.schema";

const router = express.Router();

router.post("/createPlace", processRequestBody(placeShema.body), createPlace);


export default router;