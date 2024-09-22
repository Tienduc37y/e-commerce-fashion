const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const userService = require('../services/user.service')
const jwtProvider = require('../config/jwtProvider')
const cartService = require('../services/cart.service')
const {saveResetToken, verifyResetToken, updatePassword, deleteResetToken} = require('../services/user.service')
const { error } = require('console')

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const accessToken = jwtProvider.generateAccessToken(user._id);
        const refreshToken = jwtProvider.generateRefreshToken(user._id);
        user.tokens = {
            access: {
                token: accessToken.token,
                expiresAt: accessToken.expiresAt,
            },
            refresh: {
                token: refreshToken.token,
                expiresAt: refreshToken.expiresAt,
            }
        };
        
        await user.save();
        await cartService.createCart(user);
        
        const { password: _, ...userInfo } = user._doc;

        return res.status(200).send({
            status: "200",
            message: "Đăng ký thành công",
            data: {
                user: userInfo,
            },
        });
    } catch (error) {
        return res.status(400).send({
            status: "400",
            error: error.message || "Đăng ký không thành công"
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userService.findUserByUserName(username);

        if (!user) {
            return res.status(401).send({
                status: 401,
                error: "Tài khoản không hợp lệ",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).send({
                status: "401",
                error: "Tài khoản hoặc mật khẩu không đúng",
            });
        }

        const accessToken = jwtProvider.generateAccessToken(user._id);
        const refreshToken = jwtProvider.generateRefreshToken(user._id);

        user.tokens = {
            access: {
                token: accessToken.token,
                expiresAt: accessToken.expiresAt,
            },
            refresh: {
                token: refreshToken.token,
                expiresAt: refreshToken.expiresAt,
            }
        };

        await user.save();
        
        const { password: _, ...userInfo } = user._doc;

        return res.status(200).send({
            status: "200",
            message: "Đăng nhập thành công",
            data: {
                user: userInfo,
            },
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message,
        });
    }
};

const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).send({
            message: "Không có token"
        });
    }
    
    try {
        const decoded = jwtProvider.verifyToken(token);

        const expiresAt = new Date(decoded.exp * 1000)
        
        if (new Date(expiresAt) <= new Date()) {
            return res.status(403).send({
                error: "Refresh token đã hết hạn"
            });
        }

        const newAccessToken = jwtProvider.generateAccessToken(decoded.userId);

        const user = await userService.findUserById(decoded.userId)

        user.tokens.access = {
            token: newAccessToken.token,
            expiresAt: newAccessToken.expiresAt
        } 

        const { password: _, ...userInfo } = user._doc;

        return res.status(200).send({
            status:"200",
            message: "Tạo mới Access Token thành công",
            data: {
                user: userInfo,
            }
        });
    } catch (error) {
        return res.status(403).send({
            status: "403",
            error: "Token hết hạn hoặc không hợp lệ"
        });
    }
}

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

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
            return res.status(404).send({ error: 'Tài khoản không tồn tại' });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Mật khẩu hiện tại không đúng' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        const { password: _, ...userInfo } = user._doc;

        return res.status(200).send({
            status:"200",
            message: "Đổi mật khẩu thành công",
            data: {
                user: userInfo,
            }
        });
    } catch (error) {
        return res.status(401).send({ error: error.message });
    }
}

const getResetToken = async (req, res) => {
    const { email } = req.body;

    const token = crypto.randomInt(100000, 999999);

    await saveResetToken(email, token);

    const transporter = nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Xác thực mã code',
        text: `Your password reset code is ${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: 'Mã reset mật khẩu đã được gửi đến' });
    });
}

const resetPassword = async (req, res) => {
    const { email, token } = req.body;

    const isValid = await verifyResetToken(email, token);

    if (!isValid) {
        return res.status(400).json({ error: 'Mã code hết hạn hoặc không hợp lệ' });
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    
    await updatePassword(email, newPassword);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Your New Password',
        text: `Your new password is ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ 
                status: "500",
                error: 'Lỗi gửi mật khẩu đến gmail' 
            });
        }
        res.status(200).json({ 
            status: "200",
            message: 'Mật khẩu mới đã gửi đến gmail' 
        });
    });

    await deleteResetToken(email);
}

module.exports = {register, login, refreshToken, changePassword, getResetToken, resetPassword}