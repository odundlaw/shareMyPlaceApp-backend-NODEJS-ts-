import { Place, placeModel } from "./places.model";


export async function createNewPlace(placeObj: Place){
    return placeModel.create(placeObj);
};