import {object, string, TypeOf} from "zod";

export const loginSchema = {
    body: object({
        email: string({
            required_error: "email Address is required"
        }).email("Email is not valid"),
        password: string({
            required_error: "Password is required"
        })
    })
}

export type userLoginBody = TypeOf<typeof loginSchema.body>;