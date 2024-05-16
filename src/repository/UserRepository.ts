import User from "../model/user";

export default class UserRepository {

    constructor() {}

    public async getUsers() {
        const users = await User.find();
        console.log()
        return users
    }

}