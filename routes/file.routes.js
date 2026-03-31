const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary');
const fileModel = require('../models/file.model');

// ── UPLOAD FILE ──────────────────────────────────────
router.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
      const newFile = await fileModel.create({
        fileName:  req.file.originalname,
        fileUrl:   req.file.path,
        publicId:  req.file.filename,
        fileSize:  req.file.size,
        fileType:  req.file.mimetype,
      });
      res.status(201).json({
        message: 'File uploaded successfully ✅',
        file: newFile,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

// ── GET ALL FILES ─────────────────────────────────────
router.get('/files', async (req, res) => {
  try {
    const files = await fileModel.find();
    res.status(200).json({
      message: 'Files fetched successfully',
      count: files.length,
      files,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET SINGLE FILE ───────────────────────────────────
router.get('/files/:id', async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE FILE BY _id ────────────────────────────────
// ✅ Using MongoDB _id instead of publicId (no space issues)
router.delete('/delete/:id', async (req, res) => {
  try {
    // ✅ Find file in DB first
    const file = await fileModel.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    console.log('Deleting publicId:', file.publicId);

    // ✅ Delete from Cloudinary using publicId from DB
    const cloudinaryResult = await cloudinary.uploader.destroy(file.publicId, {
      resource_type: 'image'
    });
    console.log('Cloudinary result:', cloudinaryResult);

    // ✅ Delete from MongoDB
    await fileModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'File deleted successfully ✅',
      cloudinary: cloudinaryResult,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
