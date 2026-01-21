import { User } from '../models/userModel';

export const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};

export const createUser = async (userData: any) => {
    return await User.create(userData);
};

export const getAllUsers = async () => {
    return await User.find().select('-password');
};
