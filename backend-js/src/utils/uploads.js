const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Middleware factory
const createUploader = (getDestinationCallback) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = getDestinationCallback(req, file);
      console.log(`📁 Multer storing file "${file.originalname}" (field: ${file.fieldname}) to: ${folder}`);

      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + file.originalname;
      console.log(`📝 Multer saving as: ${uniqueName}`);
      cb(null, uniqueName); 
    }
  });

  return multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      console.log(`📦 Multer received file: ${file.fieldname} - ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
      cb(null, true);
    }
  });
};

module.exports = {
  createUploader
};
