const EncryptHelper = require("../helper/encript.js");
const UsersModels = require("../models/databases/users_database");
const LoginRequest = require("../models/request/login_request");
const RegisterRequest = require("../models/request/register_request.js");
const FileHelper = require("../helper/file_helper.js");
const { v4: uuidv4 } = require("uuid");
const SecurityHelper = require("../helper/security_helper.js");
const TimeHelper = require("../helper/time_helper.js");

const login = async (req, res) => {
    const verify = SecurityHelper.verifyKey(req, res);
    if (verify) {
        const request = new LoginRequest(req.body);
        var { currentDate, expirationDate } = TimeHelper.timeToken();
        if (request.email && request.password) {
            const passToken = EncryptHelper.sha512(request.password);
            const user = await UsersModels.findOne({
                email: { $eq: request.email },
                password: { $eq: passToken },
            });

            if (user) {
                const token = {
                    name: user.name,
                    photo: user.photo,
                    email: user.email,
                    role: user.role,
                    expired: expirationDate.toISOString(),
                    created_at: currentDate.toISOString(),
                };
                res.status(200).json({
                    message:
                        "Congratulations, you have successfully logged in.",
                    data: EncryptHelper.rsaEncode(JSON.stringify(token)),
                });
            } else {
                res.status(401).json({
                    message:
                        "Please try again, the password or email is incorrect.",
                    data: null,
                });
            }
        } else {
            res.status(401).json({
                message:
                    "Please try again, the password or email is incorrect.",
                data: null,
            });
        }
    }
};

const register = async (req, res) => {
    const verify = SecurityHelper.verifyKey(req, res);
    var { currentDate, expirationDate } = TimeHelper.timeToken();
    if (verify) {
        const request = new RegisterRequest(req.body);
        const existAccount = await UsersModels.findOne({
            email: { $eq: request.email },
        });
        if (!existAccount) {
            if (request.email && request.password && request.phone) {
                const user = new UsersModels();
                if (req.file) {
                    FileHelper.move(
                        `./public/temporary/${req.file.filename}`,
                        `./public/avatar/${req.file.filename}`
                    );
                    user.photo = `/public/avatar/${req.file.filename}`;
                }

                user.token = uuidv4();
                user.role = "user";
                user.email = request.email;
                user.password = EncryptHelper.sha512(request.password);
                user.phone = request.phone;
                user.createdAt = new Date();
                user.updatedAt = new Date();
                await user.save();
                res.status(200).json({
                    message:
                        "Congratulations, you have successfully logged in.",
                    data: EncryptHelper.rsaEncode(
                        JSON.stringify({
                            name: user.name,
                            photo: user.photo,
                            email: user.email,
                            role: user.role,
                            expired: expirationDate.toISOString(),
                            created_at: currentDate.toISOString(),
                        })
                    ),
                });
            } else {
                FileHelper.delete(`./public/temporary/${req.file.filename}`);
                res.status(401).json({
                    message:
                        "Password, email or telephone number cannot be empty",
                    data: null,
                });
            }
        } else {
            res.status(401).json({
                message: "Email is already in use",
                data: null,
            });
        }
    }
};

module.exports = { login, register };
