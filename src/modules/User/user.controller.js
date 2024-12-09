import User from "../../../DB/Models/User.model.js";
import bcrypt from 'bcryptjs';
//& ================ UPDATE USER ================
export const updateLoggedInUser = async (req, res, next) => {
    //* get the user data from the request body
    const { username, email, phoneNumbers, addresses, role, age } = req.body;
    const { _id:userId } = req.authUser;
    
    //* check if the user is found
    const user = await User.findById(userId);
    if(!user) return next({message: 'User is not found', cause: 404});

    //* update the user data
    if(username) user.username = username;
    if(email) user.email = email;
    if(phoneNumbers) user.phoneNumbers = phoneNumbers;
    if(addresses) user.addresses = addresses;
    if(role) user.role = role;
    if(age) user.age = age;
    
    const updatedUser = await user.save();
    if(!updatedUser) return next({message: 'User is not updated', cause: 500});
    return res.status(200).json({message: 'User is updated successfully', user: updatedUser});
};

//& ================ DELETE USER =====================
export const deleteLoggedInUser = async (req, res, next) => {
    const { _id:userId } = req.authUser;
    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deletedUser) return next({message: 'User is not deleted', cause: 500});
    return res.status(200).json({message: 'User is deleted successfully', user: deletedUser});
};

//& ================ GET USER BY ID =====================
export const getUserById = async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId, '-password');
    if(!user) return next({message: 'User is not found', cause: 404});
    return res.status(200).json({message: 'User is found successfully', user});
}

//& ================= UPDATE LOGGED IN USER PASSWORD ================
export const updateLoggedInUserPassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { _id:userId } = req.authUser;
    //* check if the user is found
    const user = await User.findById(userId);
    if(!user) return next({message: 'User is not found', cause: 404});
    //* check if the old password is correct
    const isValidPassword = bcrypt.compareSync(oldPassword, user.password);
    if(!isValidPassword) return next({message: 'Old password is not correct', cause: 400});
    //* hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, +process.env.HASH_SALT);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    if(!updatedUser) return next({message: 'User password is not updated', cause: 500});
    return res.status(200).json({message: 'User password is updated successfully', user: updatedUser});
};
