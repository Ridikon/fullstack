const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads')
    },
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        cb(null, `${date}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case 'image/png':
        case 'image/gif':
        case 'image/jpeg':
        case 'image/jpg':
            cb(null, true);
            break;
        default:
            cb(null, false);
    }
};

const limits = {
    fileSize: 1024 * 1024 * 10
};

module.exports = multer({
    storage,
    fileFilter,
    dest: './uploads',
    limits
});
