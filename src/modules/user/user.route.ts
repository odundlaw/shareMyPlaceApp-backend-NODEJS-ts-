import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { registerUser } from "./user.controller";
import { registerUserSchema } from "./user.schema";
import {fileHelper} from "../../middlewares/fileHelper";

const router = express.Router();

router.post("/", fileHelper, processRequestBody(registerUserSchema.body), registerUser);


export default router;