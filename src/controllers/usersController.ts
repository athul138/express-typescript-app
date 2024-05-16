import { Response } from "express";
import UserRepository from "../repository/UserRepository";

export default class UsersController {

    constructor()  { 
        // this.userRepository = new UserRepository()
    }

    public async getUsers(req:Request, res:Response) {

        try {
            let userRepository = new UserRepository()
            let users:any = await userRepository.getUsers()
            res.json(users)
        } catch (err) {
            res.json(err)
        }
    }

}