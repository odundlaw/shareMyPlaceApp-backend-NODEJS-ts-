import { object, string, TypeOf } from "zod";

export const registerUserSchema = {
    body: object({
        username: string({
            required_error: "Username is Required!"
        }),
        fullName: string({
            required_error: "Full Name is Required!"
        }),
        email: string({
            required_error: "email is Required!"
        }).email("Not a Valid Email"),
        image: string({
            required_error: "Please Select a Valid Image!"
        }),
        password: string({
            required_error: "Password is Required!"
        })
            .min(6, "Password should be at least 6 Characters long")
            .max(64, "Password can't be longer than 64 Characters"),
        confirmPassword: string({
            required_error: "Confirm Password is Required!"
        }),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })
};

export type registerUserBody = TypeOf<typeof registerUserSchema.body>;
