import { Request, Response } from "express";
import NodeGeocoder from "node-geocoder"
import { StatusCodes } from "http-status-codes";
import { placeBody, placeParams } from "./places.schema";
import { createNewPlace, deletePlaceById, getAllPlaces, getPlaceById } from "./places.service";
import { Coordinates } from "./places.model";
import { Types } from "mongoose";

const options = {
    provider: 'locationiq',
    apiKey: 'pk.eecf7622b850508dec673274caa90c8c'
}

export async function createPlace(req: Request<{}, {}, placeBody>, res: Response) {
    const { title, address, description } = req.body;
    const { _id: creator }: { _id: Types.ObjectId } = res.locals.user;

    try {

        const geocoder = NodeGeocoder(options);

        const placeData = await geocoder.geocode({ address: address, limit: 1 });
        if (placeData.length <= 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Current Place of Address not Found!, try again!")
        }

        const location: Coordinates = {
            lat: placeData[0].latitude!,
            lng: placeData[0].longitude!,
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


export async function fetchPlaces(req: Request, res: Response) {
    try {
        const allPlace = await getAllPlaces();

        if (allPlace.length <= 0) {
            return res.status(StatusCodes.NOT_FOUND).send("No Places Found Start Adding Place.!");
        }

        return res.status(StatusCodes.OK).send(allPlace);

    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.FORBIDDEN
        }

        return res.send(err)
    }
}

export async function getSinglePlace(req: Request<placeParams>, res: Response) {
    const { placeId } = req.params;

    if (!placeId) {
        return res.status(StatusCodes.FORBIDDEN);
    }

    try {
        const place = await getPlaceById(placeId);
        if (!place) {
            return res.status(StatusCodes.NOT_FOUND).send("Place with the specified Id can't be found!");
        }

        return res.status(StatusCodes.OK).send(place);

    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.FORBIDDEN
        }
        return res.send(err);
    }
}


export async function deletePlace(req: Request<placeParams>, res: Response) {
    const { placeId } = req.params;
    const { _id: creatorId } = res.locals.user;

    try {
        const place = await getPlaceById(placeId);

        if (!place || !String(place.creator._id) === creatorId) {
            return res.status(StatusCodes.UNAUTHORIZED).send("You are not authorized Please!")
        }

        const deletedPlace = await deletePlaceById(placeId);

        if (deletedPlace) {
            return res.status(StatusCodes.OK).send(deletedPlace);
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unable to Delete Place")


    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.FORBIDDEN
        }
        return res.send(err);
    }
}