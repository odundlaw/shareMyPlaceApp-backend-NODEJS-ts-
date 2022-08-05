import { ClientSession } from "mongoose";
import { User } from "../user/user.model";
import { Place, placeModel } from "./places.model";


export async function createNewPlace(placeObj: Omit<Place, "placeId">, session: ClientSession) {
    return placeModel.create([placeObj], { session:session });
};


export async function getAllPlaces() {
    return placeModel.find().populate({ path: "creator", select: "fullName username email placeId" })
}

export async function getPlaceById(placeId: Place["placeId"]) {
    return placeModel.findOne({ placeId: placeId });
}


export async function deletePlaceById(placeId: Place["placeId"]) {
    return placeModel.findOneAndDelete({ placeId: placeId });
}


