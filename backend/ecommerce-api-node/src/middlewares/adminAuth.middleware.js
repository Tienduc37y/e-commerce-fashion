const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const User = require("../models/user.model")
const adminAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ 
            status: "401",
            error: 'Bạn cần có quyền truy cập' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.userId)
        if(!user || user.role !== "ADMIN"){
            return res.status(403).send({
                status: "403",
                error: "Chỉ quyền admin"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).send({
            status: "403",
            error: 'Mã không hợp lệ' });
    }
};

module.exports = adminAuthMiddleware;
