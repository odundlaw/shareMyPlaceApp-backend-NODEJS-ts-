import { userModel, User } from "./user.model";

export async function createUser(user: Omit<User, "comparePassword">) {
    return userModel.create(user);
}