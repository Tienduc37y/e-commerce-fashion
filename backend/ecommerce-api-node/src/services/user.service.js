const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwtProvider = require('../config/jwtProvider')

const createUser = async(userData) => {
    try {
        let {firstName, lastName,email, username, password, mobile} = userData

        const isUserExist = await User.findOne({username})
        const isEmailExist = await User.findOne({email})
        const isMobileExist = await User.findOne({mobile})
        if(!isUserExist){
            if(!isEmailExist){
                if(!isMobileExist){
                    password = await bcrypt.hash(password,10)
                    const user = await User.create({firstName, lastName, email, username, password, mobile})
                    console.log("created user ",user)
                    return user
                }
                else {
                    throw new Error("Số điện thoại đã tồn tại")
                }
            }
            else {
                throw new Error("Email đã tồn tại")
            }
        }
        else {
            throw new Error("Tài khoản đã tồn tại !")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const findUserById = async (userId) => {
    try {
        console.log("Tìm người dùng với ID:", userId);
        
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Không tìm thấy người dùng với id: " + userId);
        }
        console.log(user)
        return user;
    } catch (error) {
        console.error("Lỗi khi tìm người dùng:", error);
        throw new Error(error.message);
    }
}

const findUserByUserName = async (username) => {
    try {
        const user = await User.findOne({username});
        if(!user) {
            throw new Error("Tài khoản không tồn tại")
        }
        return user
    } catch (error) {
        throw new Error(error.message)
    }
}

const getUserProfileByToken = async (token) => {
    try {
        const userId = jwtProvider.getUserIdFromToken(token)

        const user = await findUserById(userId)

        if(!user) {
            throw new Error("user not found with id :",userId)
        }

        return user

    } catch (error) {
        throw new Error(error.message)
    }
}

const getAllUser = async () => {
    try {
        const users = await User.find();

        return users

    } catch (error) {
        throw new Error(error.message)
    }
}

const saveResetToken = async (email, token) => {
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await User.findOneAndUpdate(
        { email },
        { tokenResetPassword: { token:token, expiresTime:expiry } },
        { new: true, upsert: true }
    );
};

const verifyResetToken = async (email, token) => {
    const user = await User.findOne({ email });

    if (!user || user.tokenResetPassword.token !== token || user.tokenResetPassword.expiresTime < Date.now()) {
        return false;
    }
    return true;
};

const updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
        { email },
        { password: hashedPassword}
    );
};

const deleteResetToken = async (email) => {
    await User.findOneAndUpdate(
        { email },
        { tokenResetPassword: { token:"", expiresTime: null } }
    );
};



module.exports = {createUser, findUserById, findUserByUserName, getUserProfileByToken, getAllUser, saveResetToken, verifyResetToken, updatePassword, deleteResetToken}