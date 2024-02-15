const EncryptHelper = require('../helper/encript.js');
const UsersModels = require('../models/databases/users_database');
const LoginRequest = require('../models/request/login_request');
const RegisterRequest = require('../models/request/register_request.js');
const { v4: uuidv4 } = require('uuid');
const SecurityHelper = require('../helper/security_helper.js');
const TimeHelper = require('../helper/time_helper.js');
const { userRoleEnum } = require('../enum/role_enum.js');

const login = async (req, res) => {
    if (SecurityHelper.verifyKey(req, res)) {
        const request = new LoginRequest(req.body);
        var { currentDate, expirationDate } = TimeHelper.timeToken();
        if (request.email && request.password) {
            const user = await UsersModels.findOne({
                email: { $eq: request.email },
                password: { $eq: EncryptHelper.sha512(request.password) },
            });
            if (user) {
                const token = EncryptHelper.rsaEncode(
                    JSON.stringify({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        expired: expirationDate.toISOString(),
                        created_at: currentDate.toISOString(),
                        token: user.token,
                    })
                );
                await UsersModels.updateOne(
                    {
                        email: { $eq: request.email },
                        password: { $eq: EncryptHelper.sha512(request.password) },
                    },
                    { token_user: token }
                );

                res.status(200).json({
                    message: 'success login',
                    data: {
                        name: user.name,
                        photo: user.photo,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        photo: user.photo,
                        token: token,
                    },
                });
            } else {
                res.status(400).json({
                    message: 'Please try again, the password or email is incorrect.',
                    data: null,
                });
            }
        } else {
            res.status(401).json({
                message: 'Please try again, the password or email is incorrect.',
                data: null,
            });
        }
    }
};

const register = async (req, res) => {
    const request = new RegisterRequest(req);
    if (SecurityHelper.verifyKey(req, res)) {
        const existAccount = await UsersModels.findOne({
            email: { $eq: request.email },
        });
        if (!existAccount) {
            if (request.email && request.password) {
                const user = new UsersModels();
                user.token = uuidv4();
                user.role = userRoleEnum.User;
                user.email = request.email;
                user.password = EncryptHelper.sha512(request.password);
                user.phone = request.phone;
                user.createdAt = new Date();
                user.updatedAt = new Date();
                await user.save();
                res.status(200).json({
                    message: 'Congratulations, you have successfully logged in.',
                    data: null,
                });
            } else {
                res.status(400).json({
                    message: 'Password, email cannot is required',
                    data: null,
                });
            }
        } else {
            res.status(400).json({
                message: 'Email is already in use',
                data: null,
            });
        }
    }
};

module.exports = { login, register };
