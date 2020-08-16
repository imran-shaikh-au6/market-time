const multer = require("multer");
module.exports = multer({
    storage: multer.diskStorage({
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/jpg|png|jpeg$i/)) {
            cb(new Error("File type is Not Supported"), false);
            return;
        }
        cb(null, true);
    },
});

