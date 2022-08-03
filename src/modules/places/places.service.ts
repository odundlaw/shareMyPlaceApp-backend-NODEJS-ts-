import { User } from "../user/user.model";
import { Place, placeModel } from "./places.model";


export async function createNewPlace(placeObj: Omit<Place, "placeId">) {
    return placeModel.create(placeObj);
};


export async function getAllPlaces() {
    return placeModel.find().populate({ path: "creator", select: "fullName username email placeId" })
}

export async function getPlaceById(placeId: Place["placeId"]) {
    return placeModel.findOne({ placeId: placeId });
}


export async function deletePlaceById(placeId: Place["placeId"]) {
    return placeModel.findOneAndDelete({placeId: placeId});
}


