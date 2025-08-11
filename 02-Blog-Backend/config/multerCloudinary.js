// config/multerCloudinary.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Blog_App",
    format: async (req, file) => "jpeg", // fixed format
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
