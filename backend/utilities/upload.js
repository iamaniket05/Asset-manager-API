const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/organizations');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_'));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/x-icon'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images allowed!'), false);
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
