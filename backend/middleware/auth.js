const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupère le token depuis l'en-tête Authorization
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérifie et décode le token
    const userId = decodedToken.userId; // Extrait l'ID utilisateur du token
    req.auth = { userId }; // Ajoute l'ID utilisateur au corps de la requête
    next(); // Passe au middleware suivant
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée !' }); // Renvoie une erreur 401 si la vérification échoue
  }
};
