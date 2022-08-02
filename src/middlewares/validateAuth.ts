import { Response, Request, NextFunction } from "express";
import verifyJwt from "../modules/auth/uth.utils";

export function validateAuth(req: Request, res: Response, next: NextFunction) {
    const authorization = (req.headers.authorization || req.cookies.accessToken || "");

    const token = authorization.replace(/^Bearer\s/, "");
    if (!token) {
        return next();
    }

    const decoded = verifyJwt(token);

    if (decoded) {
        res.locals.user = decoded;
    }

    return next();
}