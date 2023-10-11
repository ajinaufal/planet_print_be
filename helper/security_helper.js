const UsersModels = require("../models/databases/users_database");
const EncryptHelper = require("./encript");
const env = require("dotenv").config();

class SecurityHelper {
    static isSecure(req, res, role) {
        const verifyKey = this.verifyKey(req, res);
        const { verifyToken, dataToken } = this.verifyToken(req, res, role);
        const verify = verifyKey && verifyToken;
        return { verify, dataToken };
    }

    static verifyToken(req, res, role) {
        try {
            const token =
                "Vuwrs4RMhqEXHKVSEE/GhVwUDW0LkbR6+HNWBAYefZ2R2IbkI7AQpH1BB/eEoxzsYdqWSK/PPtjWqUUEfKW9GGYdzYslgpZwmbNVMiVBxK2PtDT8z6AtpcKtK7bclK9U9kaJ7so2sIek3veQMsQMQhJfHBKgXqEuIJi9HMWE/aemXrZUzNZ5ZL6dLIYaYVGktUOydKWlocYDMmHoLV51104XBK9H2MjKESPSuXaLHq9FUcmaB10OkZzhy50PFhgaNgIs+/Idglfxim/JqH1d3TMgxWCgH/ty7GudznwymRVHOHw32UIrAmk8zH7FDp7EIyJuGFcuc2V3Ac5udZi55A==";
            var isVerify = false;
            var data = null;

            if (token) {
                const decode = EncryptHelper.rsaDecode(token);
                data = JSON.parse(decode);

                const currentDate = new Date();
                const targetDate = new Date(data.expired);
                const user = UsersModels.findOne({ email: { $eq: data.email } });

                if (currentDate.getTime() < targetDate.getTime() && user) {
                    if (role != null) {
                        if (role == jsonObject.role) {
                            isVerify = true;
                        } else {
                            const message = "Your position cannot open it.";
                            res.status(406).json({
                                message: message,
                                data: null,
                            });
                            isVerify = false;
                        }
                    } else {
                        isVerify = true;
                    }
                } else {
                    const message = "Your token has expired.";
                    res.status(401).json({ message: message, data: null });
                }
            } else {
                const message = "You forgot the token.";
                res.status(401).json({ message: message, data: null });
            }
            return { isVerify, data };
        } catch (error) {
            const message = `You did something wrong with the token, ${error}`;
            res.status(401).json({ message: message, data: null });
            return { isVerify: false, jsonObject: null };
        }
    }

    static verifyKey(req, res) {
        try {
            const secretKey = req.headers["secret-key"];
            if (secretKey) {
                return EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey;
            } else {
                const message = "You made a mistake with the key.";
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
