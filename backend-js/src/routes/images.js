const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Pastikan path absolut, bukan relatif
const posterProgram = path.join(__dirname, "../fileSaved/images/program");
const coverJurnal = path.join(__dirname, "../fileSaved/images/jurnal");
const coverBerita = path.join(__dirname, "../fileSaved/images/berita");
const pdfJurnal = path.join(__dirname, "../fileSaved/pdf");
const otherFiles = path.join(__dirname, "../fileSaved/other");
// const tesFiles = path.join(__dirname, '../../public/uploads')

// Fungsi validasi filename (opsional tapi disarankan)
const isValidFilename = (filename) => /^[\w,\s.\-]+\.[A-Za-z]{3,10}$/.test(filename);

// Helper untuk mengirim file
const sendFileHandler = (folderPath) => (req, res) => {
  const filename = req.params.filename;
  
  if (!isValidFilename(filename)) {
    console.log(`❌ Invalid filename format: ${filename}`);
    return res.status(400).send("Invalid filename");
  }

  const filePath = path.join(folderPath, filename);
  console.log(`📂 Attempting to serve file: ${filePath}`);

  const fs = require("fs");
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return res.status(404).send(`File not found: ${filename}`);
  }

  // Set proper headers for different file types
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  
  if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.webp') contentType = 'image/webp';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (ext === '.pdf') {
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  }

  console.log(`✅ Serving file: ${filePath} (Type: ${contentType})`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log(`❌ Error sending file: ${err.message}`);
      if (!res.headersSent) {
        res.status(404).send("File not found");
      }
    }
  });
};

// Routes
router.get("/programs/:filename", sendFileHandler(posterProgram));
router.get("/jurnal/cover/:filename", sendFileHandler(coverJurnal));
router.get("/jurnal/pdf/:filename", sendFileHandler(pdfJurnal));
router.get("/berita/:filename", sendFileHandler(coverBerita));
router.get("/other/:filename", sendFileHandler(otherFiles));

// Debug endpoint - list all PDFs
router.get("/debug/pdfs", (req, res) => {
  console.log(`\n📊 DEBUG: Listing PDF files from ${pdfJurnal}`);
  try {
    if (!fs.existsSync(pdfJurnal)) {
      console.log(`❌ PDF folder doesn't exist: ${pdfJurnal}`);
      return res.status(404).json({ error: "PDF folder not found", path: pdfJurnal });
    }

    const files = fs.readdirSync(pdfJurnal);
    console.log(`✅ Found ${files.length} files in PDF folder`);
    files.forEach(f => console.log(`   - ${f}`));

    res.json({
      pdfFolderPath: pdfJurnal,
      pdfCount: files.length,
      files: files
    });
  } catch (err) {
    console.log(`❌ Error listing PDFs: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Generic image endpoint that tries multiple folders
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  
  if (!isValidFilename(filename)) {
    console.log(`❌ Invalid filename format in generic endpoint: ${filename}`);
    return res.status(400).send("Invalid filename");
  }

  const fs = require("fs");
  const folders = [coverJurnal, posterProgram, coverBerita, pdfJurnal, otherFiles];
  
  console.log(`🔍 Searching for file: ${filename}`);
  for (const folder of folders) {
    const filePath = path.join(folder, filename);
    console.log(`  Checking: ${filePath}`);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found file: ${filePath}`);
      
      // Set proper headers for different file types
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (ext === '.pdf') {
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      }

      return res.sendFile(filePath, (err) => {
        if (err && !res.headersSent) {
          console.log(`❌ Error sending file: ${err.message}`);
          res.status(404).send("File not found");
        }
      });
    }
  }
  
  console.log(`❌ File not found in any folder: ${filename}`);
  res.status(404).send(`File not found: ${filename}`);
});

module.exports = router;
