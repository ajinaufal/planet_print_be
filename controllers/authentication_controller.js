const EncryptHelper = require("../helper/encript.js");
const UsersModels = require("../models/databases/users_database");
const LoginRequest = require("../models/request/login_request");
const env = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const login = async (req, res) => {
    const secretKey = req.headers['secret-key'];
    if (EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey) {
        const request = new LoginRequest(req.body);
        var { currentDate, expirationDate } = time();
        if (email && password) {
            const passToken = EncryptHelper.sha512(request.password);
            const user = UsersModels.findOne({ email: { $eq: request.email }, password: { $eq: passToken } });
            if (user) {
                const token = {
                    name: user.name,
                    photo: user.photo,
                    email: user.email,
                    role: user.role,
                    expired: expirationDate.toISOString(),
                    created_at: currentDate.toISOString(),
                }
                res.status(200).json({
                    message: "Congratulations, you have successfully logged in.",
                    data: EncryptHelper.rsaEncode(JSON.stringify(token)),
                    // decode: EncryptHelper.rsaDecode(jwt),
                });
            }
        }
    }

    res.status(401).json({
        message: "Please try again, the password or email is incorrect.",
        data: null,
    });
}

const register = async (req, res) => {
    const secretKey = req.headers['secret-key'];
    if (EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey) {
        const request = new LoginRequest(req.body);
        const user = UsersModels.findOne({ email: { $eq: data.email } });
        var { currentDate, expirationDate } = time();
        if (!user) {
            if (request.email && request.password && request.phone) {
                const user = new UsersModels();
                user._id = uuidv4;
                user.token = uuidv4;
                user.email = request.email;
                user.password = EncryptHelper.sha512(request.password);
                user.phone = request.phone;
                user.createdAt = new Date();
                user.updatedAt = new Date();
                await user.save();

                const token = {
                    name: user.name,
                    photo: user.photo,
                    email: user.email,
                    role: user.role,
                    expired: expirationDate.toISOString(),
                    created_at: currentDate.toISOString(),
                }

                res.status(200).json({
                    message: "Congratulations, you have successfully logged in.",
                    data: EncryptHelper.rsaEncode(JSON.stringify(token)),
                });
            } else {
                res.status(401).json({
                    message: "Password, email or telephone number cannot be empty",
                    data: null,
                });
            }
        } else {
            res.status(401).json({
                message: "Email has already been used",
                data: null,
            });
        }
    }
}

function verifyToken(token, role) {
    const data = EncryptHelper.rsaDecode(token);
    const jsonObject = JSON.parse(data);

    const currentDate = new Date();
    const targetDate = new Date(jsonObject.expired);
    const user = UsersModels.findOne({ email: { $eq: jsonObject.email } });

    if (currentDate.getTime() < targetDate.getTime() && user) {
        if (role != null) {
            if (role == jsonObject.role) return true;
        } else {
            return true;
        }
    }
    return false;
}


function time() {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    return { currentDate, expirationDate };
}



module.exports = { login, register, verifyToken };


