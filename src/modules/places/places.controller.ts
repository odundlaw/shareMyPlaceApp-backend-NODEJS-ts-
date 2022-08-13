import { Request, Response } from "express";
import NodeGeocoder from "node-geocoder"
import { StatusCodes } from "http-status-codes";
import { placeBody, placeParams, updatePlaceBody } from "./places.schema";
import { createNewPlace, deletePlaceById, getAllPlaces, getAllUserPlaceById, getPlaceById } from "./places.service";
import { Coordinates } from "./places.model";
import mongoose, { Types } from "mongoose";
import { getUserById } from "../user/user.service";
import { userParams } from "../user/user.schema";
import { deleteFile } from "../../utils/helpers";

const options = {
    provider: 'locationiq',
    apiKey: 'pk.eecf7622b850508dec673274caa90c8c'
}

export async function createPlace(req: Request<{}, {}, placeBody>, res: Response) {
    const { title, address, description, image } = req.body;
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

        const user = await getUserById(creator.toString());

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send("User not Found here")
        }

        const sess = await mongoose.startSession();
        sess.startTransaction();

        const newPlace = await createNewPlace({ title, address, description, location, creator, image }, sess);
        user.places.push(newPlace[0]);
        await user.save({ session: sess });

        await sess.commitTransaction();

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
        const [place, user] = await Promise.all([getPlaceById(placeId), getUserById(creatorId)]);

        if (!place || !(String(place.creator) === String(creatorId))) {
            return res.status(StatusCodes.UNAUTHORIZED).send("You are not authorized Please!")
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        const deletedPlace = await deletePlaceById(placeId, session);

        await user!.places.pull(place._id);

        await user!.save({ session: session });

        const committed = await session.commitTransaction();

        if (!committed) {

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unable to Delete Place")

        }
        
        deleteFile(place.image);

        return res.status(StatusCodes.OK).send(deletedPlace);

    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.FORBIDDEN
        }
        return res.send(err);
    }
}


export async function updatePlace(req: Request<placeParams, {}, updatePlaceBody>, res: Response) {

    const { title, address, description, image } = req.body;
    const { placeId } = req.params;

    const { _id: creator } = res.locals.user;

    try {

        const place = await getPlaceById(placeId);

        if (!place || !(String(place.creator) === String(creator))) {
            return res.status(StatusCodes.UNAUTHORIZED).send("You are not authorised Please!");
        }

        const geocoder = NodeGeocoder(options);

        const placeData = await geocoder.geocode({ address: address, limit: 1 });
        if (placeData.length <= 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Current Place of Address not Found!, try again!")
        }

        const location: Coordinates = {
            lat: placeData[0].latitude!,
            lng: placeData[0].longitude!,
        }

        if (image && place.image !== image) {
            deleteFile(place.image);
            place.image = image;
        }

        place.address = address;
        place.location = location;
        place.title = title;
        place.description = description;

        const updatedPlace = await place.save();


        return res.status(StatusCodes.CREATED).send(updatedPlace);

    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.FORBIDDEN
        }
        return res.status(err.statusCode).send(err.message)
    }

}


export async function getUserPlacesById(req: Request<userParams>, res: Response) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).send("You cant view this Page Please");
    }

    try {
        const userPlaces = await getAllUserPlaceById(userId);

        if (!userPlaces || userPlaces.length <= 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Can't find Places by the specified ID, kindly Retry!")
        }

        return res.status(StatusCodes.OK).send(userPlaces);

    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCOde = StatusCodes.INTERNAL_SERVER_ERROR
        }
        res.send(err);
    }


}