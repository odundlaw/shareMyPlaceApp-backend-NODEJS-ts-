import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { customAlphabet } from "nanoid";
import { User } from "../user/user.model";

const nanoid: () => string = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 12);

export type Coordinates = {
    lat: number,
    lng: number
}

export class Place {

    @prop({ unique: true, default: () => nanoid() })
    public placeId: string;

    @prop({ required: true })
    public title: string;

    @prop({ required: true })
    public description: string;

    @prop({ required: true })
    public address: string;

    @prop({ required: true })
    public location: Coordinates;

    @prop({ required: true, ref: () => User })
    public creator: Ref<User, Types.ObjectId>;
};


export const placeModel = getModelForClass(Place, {
    schemaOptions: { timestamps: true }
})