const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../tmp'));
  },
  filename: function (req, file, cb) {
    console.log();
    cb(null, req.user._id + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = {
  upload,
};
