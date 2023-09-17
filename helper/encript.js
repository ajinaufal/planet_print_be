const crypto = require('crypto');
const fs = require('fs');

class EncryptHelper {
    static sha512(data) {
        const hash = crypto.createHash('sha512');
        hash.update(data);
        return hash.digest('hex');
    }

    static verifySha512(plainText, hash) {
        const hashedPassword = sha512(plainText);
        return hashedPassword === hash;
    }

    static rsaEncode(data) {
        const publicKeyPEM = fs.readFileSync('publicKey.pem', 'utf8');
        const publicKey = crypto.createPublicKey(publicKeyPEM);
        const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
        return encryptedData.toString("base64");
    }

    static rsaDecode(data) {
        const privateKeyPEM = fs.readFileSync('privateKey.pem', 'utf8');
        const encryptedDataBuffer = Buffer.from(data, 'base64');
        const privateKey = crypto.createPrivateKey(privateKeyPEM);
        const decryptedData = crypto.privateDecrypt(privateKey, encryptedDataBuffer);
        return decryptedData.toString();
    }
}

module.exports = EncryptHelper;
