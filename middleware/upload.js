// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where to store files (make sure the folder exists)
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Create a unique file name (e.g., using timestamp)
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
