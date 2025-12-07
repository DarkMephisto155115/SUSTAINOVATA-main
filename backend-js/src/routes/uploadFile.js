const express = require("express");
const router = express.Router();
const tambah = require("../controllers/admin/tambahControllers");
const { createUploader } = require("../utils/uploads");

// const uploadPDF = makeUploader('pdf', ['application/pdf']);

const uploadJurnal = createUploader((req, file) => {
  if (file.fieldname === "file") return "src/fileSaved/pdf";
  if (file.fieldname === "cover_image") return "src/fileSaved/images/jurnal";
  return "src/fileSaved/other";
});
router.post(
  "/tambah/jurnal",
  uploadJurnal.fields([
    { name: "file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  tambah.tambahJurnal
);

const uploadBerita = createUploader(() => "src/fileSaved/images/berita");
router.post("/tambah/berita", uploadBerita.single("cover_image"), tambah.tambahBerita);

const tambahProgram = createUploader(() => "src/fileSaved/images/program");
router.post("/tambah/program",tambahProgram.single("poster"),tambah.tambahProgram);

module.exports = router;
