import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { deleteFile, omit } from "../../utils/helpers";
import { registerUserBody, userParams } from "./user.schema";
import { createUser, getAllUsers, getUserById } from "./user.service";


export async function registerUser(req: Request<{}, {}, registerUserBody, {}>, res: Response) {
    const { username, fullName, email, password, image } = req.body;
    try {
        const user = await createUser({ username, fullName, email, password, image });
        return res.status(StatusCodes.CREATED).send(omit(user.toJSON(), 'password'));

    } catch (err: any) {

        deleteFile(image);
        if (err.code === 11000) {
            return res.status(StatusCodes.CONFLICT).send("User already exists");
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
}

export async function getUsers(req: Request, res: Response) {

    try {
        const users = await getAllUsers();

        if (!users) {
            return res.status(StatusCodes.NOT_FOUND).send("No User in Database!");
        }
        const restructedUsers = users.map(user => omit(user.toJSON(), "password"));

        return res.status(StatusCodes.OK).send(restructedUsers);

    } catch (err: any) {

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }
}

export async function getSingleUser(req: Request<userParams>, res: Response) {

    const { userId } = req.params;

    try {
        const singleUser = await getUserById(userId);
        if (!singleUser) {
            return res.status(StatusCodes.NOT_FOUND).send("User Not Found in database!");
        }

        return res.status(StatusCodes.OK).send(omit(singleUser.toJSON(), "password"));

    } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
    }

}