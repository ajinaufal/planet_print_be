const UsersModels = require('../models/databases/users_database');
const EncryptHelper = require('./encript');
const env = require('dotenv').config();

class SecurityHelper {
    static dataToken(req) {
        const token = req.headers['authorization'];
        const data = JSON.parse(EncryptHelper.rsaDecode(token));
        return data;
    }

    static async getUser(req) {
        const token = this.dataToken(req).token;
        const user = await UsersModels.findOne({ token: { $eq: token } });
        return user;
    }

    static async isSecure(req, res, role) {
        try {
            const secretKey = req.headers['secret-key'];
            const token = req.headers['authorization'];
            const compareKey = EncryptHelper.sha512(process.env.SECRET_KEY);
            const isKey = compareKey === secretKey;
            if (secretKey && isKey) {
                if (token) {
                    const data = JSON.parse(EncryptHelper.rsaDecode(token));
                    const currentDate = new Date();
                    const targetDate = new Date(data.expired);
                    const isExp = currentDate.getTime() < targetDate.getTime();
                    if (isExp) {
                        const user = await UsersModels.findOne({
                            token: { $eq: data.token },
                        });
                        if (user) {
                            if (role) {
                                if (role == user.role) return true;
                                res.status(406).json({
                                    message: 'Your position cannot access it',
                                });
                            } else {
                                if (user.token_user == token) return true;
                                return false;
                            }
                            return false;
                        } else {
                            res.status(401).json({
                                message: 'User not found',
                            });
                        }
                    } else {
                        res.status(401).json({
                            message: 'Your token has expired',
                        });
                    }
                } else {
                    res.status(401).json({
                        message: 'You forgot the token',
                    });
                    return false;
                }
            } else {
                res.status(401).json({
                    message: 'You made a mistake with the key',
                });
                return false;
            }
        } catch (error) {
            res.status(401).json({ message: `${error}` });
            console.error(error);
            return false;
        }
    }

    static verifyKey(req, res) {
        try {
            const secretKey = req.headers['secret-key'];
            if (secretKey) {
                return EncryptHelper.sha512(process.env.SECRET_KEY) == secretKey;
            } else {
                const message = 'You made a mistake with the key.';
                res.status(401).json({ message: message, data: null });
                return false;
            }
        } catch (error) {
            const message = `You did something wrong with the key, ${error}`;
            res.status(401).json({ message: message, data: null });
            return false;
        }
    }
}

module.exports = SecurityHelper;
