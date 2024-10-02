const adminService = require('../services/admin.service')
const getAllUser = async (req,res) => {
    try {
        const users = await adminService.getAllUser()
        return res.status(200).send({
            status: "200",
            data: users
        })
    } catch (error) {
        return res.status(500).send({
            error: error.message
        })
    }
}
const deleteUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await adminService.deleteUserById(userId);
      return res.status(200).json({
        status: "200",
        message: 'xóa thành công user',
      });
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
};
const findUserByName = async (req, res) => {
    const { username } = req.body
    if (!username) {
        return res.status(400).send({
            status: "400",
            error: "Username is required"
        })
    }
    try {
        const users = await adminService.findUserByName(username)
        return res.status(200).send({
            status: "200",
            data: users
        })
    } catch (error) {
        return res.status(404).send({
            status: "404",
            error: error.message
        })
    }
}
module.exports = {getAllUser,deleteUser,findUserByName}