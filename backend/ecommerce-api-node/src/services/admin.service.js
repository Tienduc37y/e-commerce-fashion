const User = require('../models/user.model')
const getAllUser = async () => {
    try {
        const users = await User.find();

        return users

    } catch (error) {
        throw new Error(error.message)
    }
}
const deleteUserById = async (userId) => {
    try {
      const result = await User.findByIdAndDelete(userId);
      if (!result) {
        throw new Error('User not found');
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
};

const findUserByName = async (userName) => {
    try {
        const users = await User.find({
            username: { $regex: userName, $options: 'i' }
        });

        if (users.length === 0) {
            throw new Error("Không tìm thấy người dùng");
        }
        return users;
    } catch (error) {
        throw error;
    }
}

module.exports = {getAllUser,deleteUserById,findUserByName}