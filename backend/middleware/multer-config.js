const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Types MIME autorisés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Stockage temporaire des fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Middleware pour redimensionner et enregistrer l'image
const resizeImage = async (req, res, next) => {
  if (!req.file) {
    console.log("⚠️ Aucun fichier reçu par le middleware.");
    return next();
  }

  console.log("📸 Fichier reçu :", req.file.originalname);

  const extension = "jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
  const outputPath = path.join(__dirname, "../images", fileName);

  try {
    console.log("🔄 Redimensionnement de l'image...");

    await sharp(req.file.buffer)
      .resize(206, 260, { fit: "cover", position: "center" }) // ✅ Redimensionnement
      .toFormat("jpeg")
      .jpeg({ quality: 80 }) // ✅ Compression
      .toFile(outputPath);

    req.file.filename = fileName; // ✅ Mise à jour du nom du fichier
    req.file.path = outputPath; // ✅ Mise à jour du chemin
    req.file.mimetype = "image/jpeg";

    console.log("✅ Image enregistrée :", outputPath);
    next();
  } catch (error) {
    console.error("❌ Erreur lors du redimensionnement :", error);
    return res.status(500).json({ error: "Problème avec l'upload de l'image." });
  }
};


module.exports = { upload, resizeImage };




