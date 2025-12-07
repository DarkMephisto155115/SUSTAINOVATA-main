const { console } = require("inspector");
const db = require("../../config/db");
const util = require("util");
const queryAsync = util.promisify(db.query).bind(db);

exports.tambahJurnal = async (req, res) => {
  // console.log("Request Body:", req.body);
  // console.log("Request Files:", req.files);
  try {
    const { title, writer, abstract, doi, date_published, keyword } = req.body;

    const pdfFile = req.files?.file?.[0];
    const coverFile = req.files?.cover_image?.[0];

    if (!pdfFile) {
      // console.error("File PDF tidak ditemukan");
      return res.status(400).json({ message: "File PDF tidak ditemukan" });
    }
    if (!coverFile) {
      // console.error("Cover image tidak ditemukan, akan disimpan tanpa cover");
    }
    // console.log("PDF File:", pdfFile);
    // console.log("Cover File:", coverFile);
    // console.log("Request Body:", req.files);

    if (
      !title ||
      !writer ||
      !abstract ||
      !doi ||
      !date_published ||
      !pdfFile ||
      !keyword
    ) {
      // console.log("Semua field wajib harus diisi (termasuk file PDF)");
      return res
        .status(400)
        .json({ message: "Semua field wajib harus diisi (termasuk file PDF)" });
    }

    // Path PDF dan cover (jika ada)
    const filePath = `/savedFile/pdf/${pdfFile.filename}`;
    const coverPath = coverFile
      ? `/savedFile/images/jurnal/${coverFile.filename}`
      : null;
    const fileName = pdfFile.filename;
    const coverName = coverFile ? coverFile.filename : null;

    const result = await queryAsync(
      "INSERT INTO jurnal (title, writer, abstract, doi, date_published, file, cover_image, keyword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, writer, abstract, doi, date_published, fileName, coverName, keyword]
    );

    res.status(200).json({
      message: "Jurnal berhasil ditambahkan",
      data: {
        id: result.insertId,
        title,
        writer,
        abstract,
        doi,
        date_published,
        file: filePath,
        cover: coverPath,
        keyword,
      },
    });
  } catch (error) {
    // console.error("Error adding journal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.tambahBerita = async (req, res) => {
  try {
    const { title, kategori, ringkasan, text, date_published } = req.body;
    const cover_image = req.file;

    // if (!judul || !text || !date_published || !cover) {
    //   return res.status(400).json({ message: "Semua field wajib harus diisi (termasuk file)" });
    // }
    if (!title) {
      // console.error("Judul tidak boleh kosong");
      return res.status(400).json({ message: "Judul tidak boleh kosong" });
    } else if (!text) {
      // console.error("Text tidak boleh kosong");
      return res.status(400).json({ message: "Text tidak boleh kosong" });
    } else if (!date_published) {
      // console.error("Tanggal publikasi tidak boleh kosong");
      return res
        .status(400)
        .json({ message: "Tanggal publikasi tidak boleh kosong" });
    } else if (!cover_image) {
      // console.error("Cover tidak boleh kosong");
      return res.status(400).json({ message: "Cover tidak boleh kosong" });
    }
    const filePath = `/savedFile/images/berita/${cover_image.filename}`;
    const fileName = cover_image.filename;

    const result = await queryAsync(
      "INSERT INTO news (title, kategori, ringkasan, text, date_published, cover) VALUES (?, ?, ?, ?, ?, ?)",
      [title, kategori, ringkasan, text, date_published, fileName]
    );

    res.status(200).json({
      message: "Berita berhasil ditambahkan",
      data: {
        id: result.insertId,
        title,
        kategori,
        ringkasan,
        text,
        date_published,
        cover: filePath,
      },
    });
  } catch (error) {
    // console.error("Error adding news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.tambahProgram = async (req, res) => {
  try {
    const { name, description, status, peserta, start_date, end_date } = req.body;
    const poster = req.file;
    if (
      !name ||
      !description ||
      !status ||
      !peserta ||
      !start_date ||
      !end_date ||
      !poster
    ) {
      return res
        .status(400)
        .json({ message: "Semua field wajib harus diisi (termasuk file)" });
    }

    const filePath = `/savedFile/images/program/${poster.filename}`;
    const fileName = poster.filename;

    const result = await queryAsync(
      "INSERT INTO programs (name, description, status, peserta, start_date, end_date, poster) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, status, peserta, start_date, end_date, fileName]
    );
    res.status(200).json({
      message: "Program berhasil ditambahkan",
      data: {
        id: result.insertId,
        name,
        status,
        description,
        peserta,
        start_date,
        end_date,
        poster: filePath,
      },
    });
  } catch (error) {
    // console.error("Error adding program:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
