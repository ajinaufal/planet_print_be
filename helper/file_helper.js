const fs = require("fs");

class FileHelper {
    static move(from, to) {
        fs.rename(from, to, (err) => {
            if (err) console.error('Error moving file:', err);
            console.log('File moved successfully!');
        });
    }

    static delete(path) {
        fs.unlink(filePathToDelete, (err) => {
            if (err) console.error('Error deleting file:', err);
            console.log('File deleted successfully!');
        });
    }
}

module.exports = FileHelper;
