import { getModelForClass, prop, pre } from "@typegoose/typegoose";
import argon2 from "argon2";

@pre<User>("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const hashPassword = await argon2.hash(this.password);
        this.password = hashPassword;
    }
    return next();
})

export class User {

    @prop({ required: true, unique: true })
    public username: string;

    @prop({ required: true })
    public fullName: string;

    @prop({ required: true, unique: true })
    public email: string;

    @prop({ required: true})
    public image: string;

    @prop({ required: true })
    public password: string;

    public async comparePassword(candidatePassword: string): Promise<boolean> {
        return argon2.verify(this.password, candidatePassword);
    }
}

export const userModel = getModelForClass(User, {
    schemaOptions: { timestamps: true }
})