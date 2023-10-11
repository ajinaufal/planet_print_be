const { updateCategory } = require("../controllers/category_controllers");
const { fileService } = require("../middleware/file_middleware");

async function NavigateFileHelper(req, res, code) {
    switch (code) {
        case "update_category":
            const resultService = fileService(req, res, "single", "photo");
            if (resultService) {
                res.status(resultFile.code).json({
                    message: resultFile.message,
                    data: { name: update.name, photo: update.photo },
                });
            } else {
                await updateCategory(req, res);
            }
            break;
        default:
            break;
    }
}

module.exports = { NavigateFileHelper };
