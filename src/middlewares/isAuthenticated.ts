import {Request, Response, NextFunction} from "express";
import { StatusCodes } from "http-status-codes";

export function isAuthenticated(req:Request, res:Response, next:NextFunction){
    const user = res.locals.user;
    
    if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized users!")
    }

    return next();
}