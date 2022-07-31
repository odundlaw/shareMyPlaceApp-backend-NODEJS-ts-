import express from "express";
import { processRequestBody, processRequestParams } from "zod-express-middleware";
import { getSingleUser, getUsers, registerUser } from "./user.controller";
import { registerUserSchema } from "./user.schema";
import {fileHelper} from "../../middlewares/fileHelper";

const router = express.Router();

router.post("/createUser", fileHelper, processRequestBody(registerUserSchema.body), registerUser);

router.get("/:userId", getSingleUser);

router.get("/", getUsers);

export default router;