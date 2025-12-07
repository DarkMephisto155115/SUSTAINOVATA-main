const db = require("../../config/db");
const util = require("util");
const queryAsync = util.promisify(db.query).bind(db);
const fs = require("fs");
const path = require("path");

exports.dashboard = async (req, res) => {
  try {
    const [
      last3Programs,
      last3Journals,
      last3News,
      totalPrograms,
      totalJournals,
      totalNews,
    ] = await Promise.all([
      queryAsync("SELECT * FROM programs ORDER BY ID_program DESC LIMIT 3"),
      queryAsync("SELECT * FROM jurnal ORDER BY ID_jurnal DESC LIMIT 3"),
      queryAsync("SELECT * FROM news ORDER BY ID_news DESC LIMIT 3"),
      queryAsync("SELECT COUNT(*) AS total FROM programs"),
      queryAsync("SELECT COUNT(*) AS total FROM jurnal"),
      queryAsync("SELECT COUNT(*) AS total FROM news"),
    ]);

    res.status(200).json({
      recent: {
        programs: last3Programs,
        journals: last3Journals,
        news: last3News,
      },
      totals: {
        programs: totalPrograms[0].total,
        journals: totalJournals[0].total,
        news: totalNews[0].total,
      },
    });
  } catch (error) {
    // console.error("Error in dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// program
exports.getAllPrograms = async (req, res) => {
  try {
    queryAsync("SELECT * FROM programs")
      .then((results) => {
        if (results.length === 0) {
          return res.status(404).json({ message: "No programs found" });
        }
        res.status(200).json(results);
      })
      .catch((error) => {
        // console.error("Error fetching programs:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    // console.error("Error fetching programs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await queryAsync(
      "SELECT poster FROM programs WHERE ID_program = ?",
      [req.params.id]
    );
    if (result.length !== 0) {
      const filePath = path.join(__dirname, "../../fileSaved/images/program", result[0].poster);
      fs.unlink(filePath, async (err) => {
        if (err) {
          res.status(500).json({ message: "Error deleting file" });
          // console.error("Error deleting file:", err);
        }
        const deleteResult = await queryAsync(
          "DELETE FROM programs WHERE ID_program = ?",
          [id]
        );
        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: "Program not found" });
        }
        res.status(200).json({ message: "Program deleted successfully" });
      })
    } else {
      res.status(404).json({ message: "Program not found" });
    }
  } catch (error) {
    // console.error("Error deleting program:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.editProgram = async (req, res) => {
  const id = req.params.id;

  try {
    const updates = {};
    const { name, description, status, peserta, start_date, end_date } = req.body;

    if (name) updates.name = name;
    if (description) updates.description = description;
    if (status) updates.status = status;
    if (peserta) updates.peserta = peserta;
    if (start_date) updates.start_date = start_date;
    if (end_date) updates.end_date = end_date;

    const result = await queryAsync("SELECT * FROM programs WHERE ID_program = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Program tidak ditemukan" });
    }

    const program = result[0];

    if (req.file) {
      const newPoster = req.file.filename;
      const oldPosterPath = path.join(__dirname, "../../fileSaved/images/program", program.poster);
      fs.unlink(oldPosterPath, (err) => err && console.error("Gagal hapus poster lama:", err));
      updates.poster = newPoster;
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await queryAsync(`UPDATE programs SET ${fields} WHERE ID_program = ?`, values);
    res.status(200).json({ message: "Program berhasil diupdate" });
  } catch (error) {
    // console.error("Error updating program:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// jurnal
exports.getAllJurnal = async (req, res) => {
  try {
    queryAsync("SELECT * FROM jurnal")
      .then((results) => {
        if (results.length === 0) {
          return res.status(404).json({ message: "No journals found" });
        }
        res.status(200).json(results);
      })
      .catch((error) => {
        // console.error("Error fetching journals:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    // console.error("Error fetching journals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteJurnal = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await queryAsync(
      "SELECT cover_image, file FROM jurnal WHERE ID_jurnal = ?",
      [req.params.id]
    );
    // // console.log(result);
    if (result.length !== 0) {
      const coverPath = path.join(__dirname, "../../fileSaved/images/jurnal", result[0].cover_image);
      const pdfPath = path.join(__dirname, "../../fileSaved/pdf", result[0].file);
      
      fs.unlink(coverPath, (err) => {
        if (err) {
          // console.error("Error deleting cover file:", err);
        }
      });
      
      fs.unlink(pdfPath, async (err) => {
        if (err) {
          // console.error("Error deleting PDF file:", err);
        }
        const deleteResult = await queryAsync(
          "DELETE FROM jurnal WHERE ID_jurnal = ?",
          [id]
        );
        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: "Journal not found" });
        }
        res.status(200).json({ message: "Journal deleted successfully" });
      });
    } else {
      res.status(404).json({ message: "Journal not found" });
    }
  } catch (error) {
    // console.error("Error deleting journal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.editJurnal = async (req, res) => {
  const id = req.params.id;

  try {
    const updates = {};
    const { title, writer, keyword, date_published } = req.body;

    if (title) updates.title = title;
    if (writer) updates.writer = writer;
    if (keyword) updates.keyword = keyword;
    if (date_published) updates.date_published = date_published;

    const result = await queryAsync("SELECT * FROM jurnal WHERE ID_jurnal = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Jurnal tidak ditemukan" });
    }

    const jurnal = result[0];

    // Cek dan update cover_image
    if (req.files?.cover_image?.[0]) {
      const newCover = req.files.cover_image[0].filename;
      const oldCoverPath = path.join(__dirname, "../../fileSaved/images/jurnal", jurnal.cover_image);
      fs.unlink(oldCoverPath, (err) => err && console.error("Gagal hapus cover lama:", err));
      updates.cover_image = newCover;
    }

    // Cek dan update PDF file
    if (req.files?.file?.[0]) {
      const newFile = req.files.file[0].filename;
      const oldFilePath = path.join(__dirname, "../../fileSaved/pdf", jurnal.file);
      fs.unlink(oldFilePath, (err) => err && console.error("Gagal hapus PDF lama:", err));
      updates.file = newFile;
    }

    // Bangun query dinamis
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id); // Untuk WHERE ID

    await queryAsync(`UPDATE jurnal SET ${fields} WHERE ID_jurnal = ?`, values);

    res.status(200).json({ message: "Jurnal berhasil diupdate" });
  } catch (error) {
    // console.error("Error updating jurnal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// berita
exports.getAllBerita = async (req, res) => {
  try {
    queryAsync("SELECT * FROM news")
      .then((results) => {
        if (results.length === 0) {
          return res.status(404).json({ message: "No news found" });
        }
        res.status(200).json(results);
      })
      .catch((error) => {
        // console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    // console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBerita = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await queryAsync(
      "SELECT cover FROM news WHERE ID_news = ?",
      [req.params.id]
    );
    if (result.length !== 0) {
      const filePath = path.join(__dirname, "../../fileSaved/images/berita", result[0].cover);
      fs.unlink(filePath, async (err) => {
        if (err) {
          res.status(500).json({ message: "Error deleting file" });
          // console.error("Error deleting file:", err);
        }
        const deleteResult = await queryAsync(
          "DELETE FROM news WHERE ID_news = ?",
          [id]
        );
        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json({ message: "News deleted successfully" });
      })
    } else {
      
    }
  } catch (error) {
    // console.error("Error deleting news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editBerita = async (req, res) => {
  const id = req.params.id;

  try {
    const updates = {};
    const { title, kategori, ringkasan, text, date_published } = req.body;

    if (title) updates.title = title;
    if (kategori) updates.kategori = kategori;
    if (ringkasan) updates.ringkasan = ringkasan;
    if (text) updates.text = text;
    if (date_published) updates.date_published = date_published;

    const result = await queryAsync("SELECT * FROM news WHERE ID_news = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    const berita = result[0];

    // Cek dan update cover_image
    if (req.file) {
      const newCover = req.file.filename;
      const oldCoverPath = path.join(__dirname, "../../fileSaved/images/berita", berita.cover);
      fs.unlink(oldCoverPath, (err) => err && console.error("Gagal hapus cover lama:", err));
      updates.cover = newCover;
    }

    // Bangun query dinamis
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id); // Untuk WHERE ID

    await queryAsync(`UPDATE news SET ${fields} WHERE ID_news = ?`, values);

    res.status(200).json({ message: "Berita berhasil diupdate" });
  } catch (error) {
    // console.error("Error updating berita:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await queryAsync(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    
    res.status(200).json({ 
      success: true, 
      data: messages,
      total: messages.length 
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getContactMessageDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await queryAsync(
      "SELECT * FROM contact_messages WHERE id = ?",
      [id]
    );
    
    if (message.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    
    await queryAsync(
      "UPDATE contact_messages SET status = 'read' WHERE id = ?",
      [id]
    );
    
    res.status(200).json({ success: true, data: message[0] });
  } catch (error) {
    console.error("Error fetching message detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    
    await queryAsync(
      "UPDATE contact_messages SET status = ? WHERE id = ?",
      [status, id]
    );
    
    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await queryAsync(
      "DELETE FROM contact_messages WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
