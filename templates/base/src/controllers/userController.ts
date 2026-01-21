import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;
        // In a real app, hash password here

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        const user = await userService.createUser({ name, email, password });

        res.status(201).json({
            success: true,
            data: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};
