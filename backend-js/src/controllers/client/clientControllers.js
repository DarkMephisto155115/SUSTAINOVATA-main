const { response } = require("express");
const queryAsync = require("../../utils/db");

exports.getHome = (req, res) => {
  queryAsync("SELECT * FROM programs ORDER BY ID_program DESC LIMIT 4")
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ error: "No programs found" });
      }
      res.status(200).json(results);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.getAbout = (req, res) => {
  queryAsync("SELECT * FROM users")
    .then((results) => {
      if (results.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
      res.status(200).json(results);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.getPrograms = async (req, res) => {
  try {
    // const all = await queryAsync(
    //   "SELECT * FROM programs ORDER BY ID_program DESC LIMIT 4"
    // );
    // const riset = await queryAsync(
    //   "SELECT * FROM programs WHERE jenis_program = 'riset' OR jenis_program = 'penelitian' ORDER BY ID_program DESC LIMIT 4"
    // );
    // const pemberdayaan = await queryAsync(
    //   "SELECT * FROM programs WHERE jenis_program = 'pemberdayaan masyarakat' ORDER BY ID_program DESC LIMIT 4"
    // );
    // res.status(200).json({
    //   all,
    //   riset,
    //   pemberdayaan
    // });
    queryAsync(
      "SELECT * FROM programs ORDER BY ID_program DESC LIMIT 4"
    )
    .then((response) => {
      if (response.length === 0) {
        return res.status(404).json({ error: "No programs found" });
      }
      res.status(200).json(response);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });

  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getBerita = (req, res) => {
  try {
    queryAsync("SELECT * FROM news")
      .then((response) => {
        if (response.length === 0) {
          return res.status(404).json({ error: "No news found" });
        } else {
          res.status(200).json(response);
        }
      })
      .catch((error) => {
        // console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {}
};

exports.getJurnal = (res, req) => {
  try {
    queryAsync("SELECT * FROM jurnal")
      .then((response) => {
        if (response.length === 0) {
          return res.status(404).json({ error: "No jurnal found" });
        } else {
          res.status(200).json(response);
        }
      })
      .catch((error) => {
        // console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (err) {
    // console.error(err);
  }
};

exports.getResearch = (req, res) => {
  try {
    const { jenis } = req.body;
    queryAsync(`SELECT * FROM programs WHERE jenis_program = '${jenis}'`).then(
      (response) => {
        if (response.length === 0) {
          return res.status(404).json({ error: "No research found" });
        } else {
          res.status(200).json(response);
        }
      }
    )
    .catch((error) =>{
      // console.error(error);
      res.status(500).json({ message: "Internal server error" });
    })
  } catch (error) {
    // console.error(error);
  }
};

exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, topic, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, dan message wajib diisi"
      });
    }

    const attachmentPath = req.file ? req.file.filename : null;

    await queryAsync(
      "INSERT INTO contact_messages (name, email, subject, topic, message, attachment_path, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, subject, topic || "general", message, attachmentPath, "new"]
    );

    res.status(201).json({
      success: true,
      message: "Pesan Anda berhasil dikirim. Kami akan segera menghubungi Anda."
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengirim pesan"
    });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const { category } = req.query;

    let query = "SELECT * FROM team_members WHERE is_active = TRUE";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY display_order ASC";

    const members = await queryAsync(query, params);

    res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data tim"
    });
  }
};

exports.getPartners = async (req, res) => {
  try {
    const { status } = req.query;

    let query = "SELECT * FROM partners WHERE status = ?";
    const params = [status || "active"];

    query += " ORDER BY display_order ASC";

    const partners = await queryAsync(query, params);

    res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data partner"
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const { name, email, telephone, username, address, bio } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak ter-autentikasi"
      });
    }

    await queryAsync(
      "UPDATE users SET name = ?, email = ?, telephone = ?, username = ?, address = ?, bio = ?, updated_at = NOW() WHERE id = ?",
      [name, email, telephone, username, address, bio, userId]
    );

    res.status(200).json({
      success: true,
      message: "Profile berhasil diperbarui"
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui profile"
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak ter-autentikasi"
      });
    }

    const user = await queryAsync(
      "SELECT id, name, email, telephone, username, address, bio, role, photo_path FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: user[0]
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil profile"
    });
  }
};

exports.submitCollaborationRequest = async (req, res) => {
  try {
    const { organizationName, organizationType, contactName, contactEmail, contactPhone, organizationAddress, collaborationType, description } = req.body;

    if (!organizationName || !contactName || !contactEmail || !description) {
      return res.status(400).json({
        success: false,
        message: "Organization name, contact name, email, dan description wajib diisi"
      });
    }

    const result = await queryAsync(
      `INSERT INTO collaboration_requests 
       (organization_name, contact_name, contact_email, contact_phone, title, description, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [organizationName, contactName, contactEmail, contactPhone || null, "Collaboration Request: " + organizationName, description]
    );

    await queryAsync(
      "INSERT INTO contact_messages (name, email, subject, topic, message, status) VALUES (?, ?, ?, ?, ?, ?)",
      [contactName, contactEmail, "Collaboration Request: " + organizationName, collaborationType, description, "new"]
    );

    res.status(201).json({
      success: true,
      message: "Permintaan kolaborasi berhasil dikirim. Kami akan segera menghubungi Anda.",
      data: { ID_request: result.insertId }
    });
  } catch (error) {
    console.error("Error submitting collaboration request:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengirim permintaan"
    });
  }
};

exports.getProgramDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await queryAsync("SELECT * FROM programs WHERE ID_program = ?", [id]);
    
    if (program.length === 0) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    
    res.status(200).json({ success: true, data: program[0] });
  } catch (error) {
    console.error("Error fetching program detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getNewsDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await queryAsync("SELECT * FROM news WHERE ID_news = ?", [id]);
    
    if (news.length === 0) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    
    res.status(200).json({ success: true, data: news[0] });
  } catch (error) {
    console.error("Error fetching news detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getPublications = async (req, res) => {
  try {
    const publications = await queryAsync("SELECT * FROM jurnal WHERE status = 'published' ORDER BY date_published DESC");
    res.status(200).json({ success: true, data: publications });
  } catch (error) {
    console.error("Error fetching publications:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getPublicationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await queryAsync("SELECT * FROM jurnal WHERE ID_jurnal = ?", [id]);
    
    if (publication.length === 0) {
      return res.status(404).json({ success: false, message: "Publication not found" });
    }
    
    res.status(200).json({ success: true, data: publication[0] });
  } catch (error) {
    console.error("Error fetching publication detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getResourceDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid resource ID" });
    }
    
    res.status(200).json({ 
      success: true, 
      data: {
        id: parseInt(id),
        title: "Sumber Daya " + id,
        category: "Pendidikan",
        description: "Deskripsi lengkap sumber daya akan ditampilkan di sini",
        content: "Konten lengkap sumber daya",
        guidance: "Panduan penggunaan sumber daya",
        benefits: "Manfaat dari penggunaan sumber daya ini",
        type: "Umum",
        status: "Tersedia",
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching resource detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getResearchDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid research ID" });
    }
    
    const researchData = {
      1: {
        id: 1,
        title: "Sistem Pertanian Pintar",
        description: "Smart Farming System yang dikembangkan oleh Sustainovata merupakan integrasi teknologi IoT dengan praktik pertanian yang menggabungkan teknologi digital, data real-time, dan pemberdayaan masyarakat lokal.",
        content: "Sistem Pertanian Pintar (Smart Farming System) yang dikembangkan oleh Sustainovata merupakan integrasi teknologi IoT dengan praktik pertanian yang menggabungkan teknologi digital, data real-time, dan pemberdayaan masyarakat lokal. Sistem ini dirancang untuk membantu petani mengatasi tantangan perubahan iklim dan keterbatasan sumber daya—mulai dari penanaman, pemeliharaan, hingga panen dan distribusi. Teknologi utama yang digunakan mencakup sensor ketelusuran tanah, pemantauan kelembaban udara, drone untuk pemetaan lahan, dan aplikasi mobile yang memungkinkan analisis kondisi lahan dan tanaman secara langsung dari aplikasi ponsel.\n\nKeunggulan sistem ini adalah kemampuannya untuk mengurangi ketergantungan pada intuisi atau perkiraan dalam aktivitas bertani. Melalui data yang dikumpulkan oleh sensor, petani dapat mengetahui secara pasti kapan waktu terbaik untuk menanam, memupuk, atau memanen. Selain itu, sistem ini juga membantu meminimalkan pemborosan input seperti pupuk, air, dan pestisida, sehingga lebih ramah lingkungan dan ekonomis. Sustainovata menekankan bahwa teknologi yang dikembangkan bersifat inklusif dan dapat diakses oleh petani, termasuk mereka yang belum terbiasa dengan perangkat digital.\n\nTidak hanya berfokus pada teknologi, Sistem Pertanian Pintar Sustainovata juga mencakup komponen pemberdayaan masyarakat melalui program pelatihan teknis bagi petani, penyuluhan digital, serta pembangunan komunitas berbasis pengetahuan lokal. Sustainovata bekerja sama dengan universitas dan lembaga penelitian untuk terus mengembangkan sistem ini agar semakin relevan dengan kondisi geografis dan iklim lokal.",
        image: "pertanian-pintar.png",
        status: "Aktif",
        created_at: new Date().toISOString()
      },
      2: {
        id: 2,
        title: "Title Research",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et sollicitudin turpis.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et sollicitudin turpis. Etiam fringilla ultricies tincidunt. Proin et eleifend felis, vel scelerisque nibh. Suspendisse porttitor, lacus ut fringilla rutrum, magna velit pellentesque ipsum, sit amet tempor nunc nisi at leo. In pulvinar eget nulla in feugiat. Donec ullamcorper posuere enim.",
        image: "mesin-1.png",
        status: "Aktif",
        created_at: new Date().toISOString()
      }
    };
    
    const research = researchData[id];
    if (!research) {
      return res.status(404).json({ success: false, message: "Research not found" });
    }
    
    res.status(200).json({ success: true, data: research });
  } catch (error) {
    console.error("Error fetching research detail:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
