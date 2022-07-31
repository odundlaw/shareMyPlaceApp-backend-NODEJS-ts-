import {Request, Response, NextFunction} from "express";
import { StatusCodes } from "http-status-codes";
import { omit } from "../../utils/helpers";
import { findByEmail } from "../user/user.service";
import { userLoginBody } from "./auth.schema";
import { signJwt } from "./uth.utils";

export async function loginHandler(req: Request<{}, {}, userLoginBody>, res:Response, next:NextFunction){
    const {email, password} = req.body;

    try{
        const user = await findByEmail(email);

        if(!user || !user.comparePassword(password)){
           return res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or Password ");
        }

        const payload = omit(user.toJSON(), ["password", "__v"]);
        const jwt = signJwt(payload);

        res.cookie("accessToken", jwt, {
            maxAge: 3.154e10,
            secure: false,
            path: "/",
            httpOnly: true,
            sameSite: "strict"
        });

        return res.status(StatusCodes.OK).send(jwt);

    }catch(error: any){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
}