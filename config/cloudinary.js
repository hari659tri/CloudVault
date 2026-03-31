const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // ✅ Replace spaces with hyphens in filename
    const sanitized = file.originalname
      .split('.')[0]
      .replace(/\s+/g, '-');  // spaces → hyphens

    return {
      folder: 'drive-uploads',
      resource_type: 'auto',
      public_id: Date.now() + '-' + sanitized, // ✅ no spaces
    };
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // ✅ 100MB limit
});

module.exports = { cloudinary, upload };