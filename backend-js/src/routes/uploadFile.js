const express = require("express");
const path = require("path");
const router = express.Router();
const tambah = require("../controllers/admin/tambahControllers");
const { createUploader } = require("../utils/uploads");

// const uploadPDF = makeUploader('pdf', ['application/pdf']);

const uploadJurnal = createUploader((req, file) => {
  if (file.fieldname === "file") return path.join(__dirname, "../fileSaved/pdf");
  if (file.fieldname === "cover_image") return path.join(__dirname, "../fileSaved/images/jurnal");
  return path.join(__dirname, "../fileSaved/other");
});
router.post(
  "/tambah/jurnal",
  uploadJurnal.fields([
    { name: "file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  tambah.tambahJurnal
);

const uploadBerita = createUploader(() => path.join(__dirname, "../fileSaved/images/berita"));
router.post("/tambah/berita", uploadBerita.single("cover_image"), tambah.tambahBerita);

const tambahProgram = createUploader(() => path.join(__dirname, "../fileSaved/images/program"));
router.post("/tambah/program",tambahProgram.single("poster"),tambah.tambahProgram);

module.exports = router;
