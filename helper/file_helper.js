const fs = require("fs");

class FileHelper {
    static move(from, to) {
        fs.rename(from, to, (err) => {
            if (err) console.error('Error moving file:', err);
            console.log('File moved successfully!');
        });
    }
}