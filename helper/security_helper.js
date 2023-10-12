const UsersModels = require("../models/databases/users_database");
const EncryptHelper = require("./encript");
const env = require("dotenv").config();

class SecurityHelper {
    static async isSecure(req, res, role) {
        try {
            const secretKey = req.headers["secret-key"];
            const token = req.headers["Authorization"];
            const compareKey = EncryptHelper.sha512(process.env.SECRET_KEY);
            const isKey = compareKey === secretKey;
            const isExp = currentDate.getTime() < targetDate.getTime();
            if (secretKey && isKey) {
                if (token) {
                    const data = JSON.parse(EncryptHelper.rsaDecode(token));
                    const currentDate = new Date();
                    const targetDate = new Date(data.expired);
                    const user = await UsersModels.findOne({
                        token: { $eq: data.token },
                    });
                    const isExp = currentDate.getTime() < targetDate.getTime();
                    const isVerify = isNotExp && user;
                    console.log(user);
                } else {
                    res.status(401).json({
                        message: "You forgot the token",
                        data: null,
                    });
                }
            } else {
                res.status(401).json({
                    message: "You made a mistake with the key",
                    data: null,
                });
                return false;
            }
        } catch (error) {}
    }
    // static isSecure(req, res, role) {
    //     try {
    //         const secretKey = req.headers["secret-key"];
    //         const token = req.headers["Authorization"];
    //         const compareKey = EncryptHelper.sha512(process.env.SECRET_KEY);
    //         const isKey = compareKey === secretKey;
    //         if (secretKey) {
    //             if (isKey) {
    //                 if (token) {
    //                     const data = JSON.parse(EncryptHelper.rsaDecode(token));
    //                     const currentDate = new Date();
    //                     const targetDate = new Date(data.expired);
    //                     const user = UsersModels.findOne({
    //                         email: { $eq: data.email },
    //                     });
    //                     const isExp =
    //                         currentDate.getTime() < targetDate.getTime();
    //                     const isVerify = isNotExp && user;
    //                     if (isVerify) {
    //                         if (role != null) {
    //                             if (role == user.role) {
    //                                 isVerify = true;
    //                             } else {
    //                                 res.status(406).json({
    //                                     message: "Your position cannot open it",
    //                                     data: null,
    //                                 });
    //                                 isVerify = false;
    //                             }
    //                         } else {
    //                             isVerify = true;
    //                         }
    //                     } else {
    //                         const message = "Your token has expired.";
    //                         res.status(401).json({
    //                             message: message,
    //                             data: null,
    //                         });
    //                     }
    //                 } else {
    //                 }
    //             } else {
    //             }
    //         } else {
    //             const message = "You made a mistake with the key";
    //             res.status(401).json({ message: message, data: null });
    //             return false;
    //         }
    //     } catch (error) {}
    //     // const verifyKey = this.verifyKey(req, res);
    //     // const { verifyToken, dataToken } = this.verifyToken(req, res, role);
    //     // const verify = verifyKey && verifyToken;
    //     // return { verify, dataToken };
    // }

    // static verifyToken(req, res, role) {
    //     try {
    //         const token = req.headers["Authorization"];
    //         var isVerify = false;
    //         if (token) {
    //             const data = JSON.parse(EncryptHelper.rsaDecode(token));
    //             const currentDate = new Date();
    //             const targetDate = new Date(data.expired);
    //             const user = UsersModels.findOne({
    //                 email: { $eq: data.email },
    //             });

    //             if (currentDate.getTime() < targetDate.getTime() && user) {
    //                 if (role != null) {
    //                     if (role == user.role) {
    //                         isVerify = true;
    //                     } else {
    //                         const message = "Your position cannot open it.";
    //                         res.status(406).json({
    //                             message: message,
    //                             data: null,
    //                         });
    //                         isVerify = false;
    //                     }
    //                 } else {
    //                     isVerify = true;
    //                 }
    //             } else {
    //                 const message = "Your token has expired.";
    //                 res.status(401).json({ message: message, data: null });
    //             }
    //         } else {
    //             const message = "You forgot the token.";
    //             res.status(401).json({ message: message, data: null });
    //         }
    //         return { isVerify, data };
    //     } catch (error) {
    //         const message = `You did something wrong with the token, ${error}`;
    //         res.status(401).json({ message: message, data: null });
    //         return { isVerify: false, jsonObject: null };
    //     }
    // }

    // static verifyKey(req, res) {
    //     try {
    //         const secretKey = req.headers["secret-key"];
    //         if (secretKey) {
    //             return (
    //                 EncryptHelper.sha512(process.env.SECRET_KEY) === secretKey
    //             );
    //         } else {
    //             const message = "You made a mistake with the key.";
    //             res.status(401).json({ message: message, data: null });
    //             return false;
    //         }
    //     } catch (error) {
    //         const message = `You did something wrong with the key, ${error}`;
    //         res.status(401).json({ message: message, data: null });
    //         return false;
    //     }
    // }
}

module.exports = SecurityHelper;
