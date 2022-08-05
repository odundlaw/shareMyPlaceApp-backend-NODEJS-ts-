import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { getSingleUser, getUsers, registerUser } from "./user.controller";
import { registerUserSchema } from "./user.schema";
import { fileHelper } from "../../middlewares/fileHelper";

const router = express.Router();

router.route("/createUser")
    .post(fileHelper, processRequestBody(registerUserSchema.body), registerUser);

router.route("/:userId")
    .get(getSingleUser);

router.route("/")
    .get(getUsers);

export default router;