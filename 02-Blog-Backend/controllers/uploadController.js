// controllers/uploadController.js
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // req.file contains Cloudinary info
    return res.status(200).json({
      message: "File uploaded successfully",
      file: req.file, // cloudinary response info
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { uploadFile };
