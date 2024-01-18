import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

// @Desc Login 
// @Route /api/auth/
// @Method POST
export const login = asyncHandler (async (req: Request, res: Response) => {

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if(!user) {
        res.status(401);
        throw new Error("User not found");
    }

    if(await user.comparePassword(password)) {

        res.status(201).json({ status: "success", data: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            country : user.country,
            token: generateToken(user._id)
        }})

    } else {
        res.status(401);
        throw new Error("Username or password incorrect");
    }

})

// @Desc Register
// @Route /api/auth/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {

    const { username, firstName, lastName, password, country } = req.body;

    const user = new User({
        username, password, firstName, lastName, country
    });

    await user.save();

    res.status(201).json({ status: "success" , data: {
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        token: generateToken(user._id)
    } });

})