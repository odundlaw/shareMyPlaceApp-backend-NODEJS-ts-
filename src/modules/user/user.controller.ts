import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { deleteFile } from "../../utils/helpers";
import { registerUserBody } from "./user.schema";
import { createUser } from "./user.service";


export async function registerUser(req: Request<{}, {}, registerUserBody, {}>, res: Response) {
    const { username, fullName, email, password, image } = req.body;
    console.log(req.body);
    try {
        const user = await createUser({ username, fullName, email, password, image });
        return res.status(StatusCodes.CREATED).send(user);

    } catch (err: any) {

        deleteFile(image);
        if (err.code === 11000) {
            return res.status(StatusCodes.CONFLICT).send("User already exists");
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
}