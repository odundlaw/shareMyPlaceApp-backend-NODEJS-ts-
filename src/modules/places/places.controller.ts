import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { placeBody } from "./places.schema";
import { createNewPlace } from "./places.service";

export async function createPlace(req: Request<{}, {}, placeBody>, res: Response) {
    const { title, address, description } = req.body;
    const {_id: creator } = res.locals.user;

    try {
        const location = {
            lat: 6.455800827731088,
            lng: 3.2007616759386277,
        }

        const newPlace = await createNewPlace({ title, address, description, location, creator });

        return res.status(StatusCodes.CREATED).send(newPlace);

    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.FORBIDDEN
        }
        return res.status(err.statusCode).send(err.message)
    }
}