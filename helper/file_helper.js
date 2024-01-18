const fs = require('fs');

class FileHelper {
    static init() {
        if (!fs.existsSync('./public')) {
            fs.mkdirSync('./public', { recursive: true });
        }
        if (!fs.existsSync('./public/avatar')) {
            fs.mkdirSync('./public/avatar', { recursive: true });
        }
        if (!fs.existsSync('./public/category')) {
            fs.mkdirSync('./public/category', { recursive: true });
        }
        if (!fs.existsSync('./public/product')) {
            fs.mkdirSync('./public/product', { recursive: true });
        }
        if (!fs.existsSync('./public/review_product')) {
            fs.mkdirSync('./public/review_product', { recursive: true });
        }
        if (!fs.existsSync('./public/temporary')) {
            fs.mkdirSync('./public/temporary', { recursive: true });
        }
    }

    static move(from, to) {
        fs.rename(from, to, (err) => {
            if (err) console.error('Error moving file:', err);
            console.log(`File moved from ${from} to ${to} successfully!`);
        });
    }

    static delete(path) {
        fs.unlink(path, (err) => {
            if (err) console.error('Error deleting file:', err);
            console.log('File deleted successfully!');
        });
    }
}

module.exports = FileHelper;
