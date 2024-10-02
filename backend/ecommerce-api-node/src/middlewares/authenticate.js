const jwtProvider = require('../config/jwtProvider')
const userService = require('../services/user.service')
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(404).send({
                status: "404",
                error: "Token không hợp lệ"
            })
        }
        const userId = jwtProvider.getUserIdFromToken(token)
        const user = await userService.findUserById(userId)
        req.user = user
    } catch (error) {
        return res.status(401).send({
            status: "401",
            error: error.message
        })
    }
    next()
}

module.exports = authenticate