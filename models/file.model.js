const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName:   { type: String, required: true },
  fileUrl:    { type: String, required: true },  // Cloudinary URL
  publicId:   { type: String, required: true },  // for delete
  fileSize:   { type: Number },
  fileType:   { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);