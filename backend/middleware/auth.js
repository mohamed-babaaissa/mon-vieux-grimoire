const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // ✅ Récupération du token
    if (!token) {
      throw new Error("Token manquant !");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // ✅ Utilisation du secret du fichier .env
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error("❌ Erreur d'authentification :", error.message);
    res.status(401).json({ message: "Requête non authentifiée !" });
  }
};

