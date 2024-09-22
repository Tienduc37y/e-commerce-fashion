const userService = require('../services/user.service')

const getUserProfile = async (req, res) => {
    try {
      const jwt = req.headers.authorization?.split(" ")[1];
  
      if (!jwt) {
        return res.status(404).send({
            status: "404",
            error: "Không có token",
        });
      }

      const user = await userService.getUserProfileByToken(jwt);
  
      if (!user) {
        return res.status(401).send({
          status: "401",
          error: "Token không hợp lệ hoặc đã hết hạn",
        });
      }
  
      const { password: _, ...userInfo } = user._doc;
  
      return res.status(200).send({
        status: "200",
        message: "Lấy thông tin user thành công",
        data: {
          user: userInfo,
        },
      });
    } catch (error) {
      return res.status(401).send({
        status: "401",
        error: error.message || "Token hết hạn hoặc không hợp lệ",
      });
    }
  };
  

const getAllUser = async (req,res) => {
    try {
        const users = await userService.getAllUser()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({
            error: error.message
        })
    }
}
module.exports = {getUserProfile,getAllUser}