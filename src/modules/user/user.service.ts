import { userModel, User } from "./user.model";

export async function createUser(user: Omit<User, "comparePassword">) {
    return userModel.create(user);
}

export async function findByEmail(email: User["email"]){
    return userModel.findOne({email: email});
}
