import { string, object, TypeOf } from "zod";

export const placeShema = {
    body: object({
        title: string({
            required_error: "Title is required and Cannot be Empty!"
        }).min(10, "Title has to be at least 10 Characters!"),
        description: string({
            required_error: "Description is required and Cannot be empty!"
        }).min(10, "Description has to be at least 10 Characters!"),
        address: string({
            required_error: "Addess cannot be empty!"
        }).min(10, "Address has to be at least 10 Characters long!"),
        image: string({
            required_error: "Image cannot be empty! Thank You"
        })
    }),
    params: object({
        placeId: string({
            required_error: "One or two Params required"
        })
    })
}

export const updatePlaceSchema = {
    body: object({
        title: string(),
        description: string(),
        address: string(),
        image: string(),
    })
}


export type placeBody = TypeOf<typeof placeShema.body>;
export type updatePlaceBody = TypeOf<typeof updatePlaceSchema.body>;
export type placeParams = TypeOf<typeof placeShema.params>;


