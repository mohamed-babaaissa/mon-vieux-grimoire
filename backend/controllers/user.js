const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import du package JWT
const User = require('../models/user');

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  console.log('Données reçues pour l\'inscription :', req.body); 
  bcrypt
    .hash(req.body.password, 10) // Hachage du mot de passe avec un salage de 10 tours
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash, // Stockage sécurisé du mot de passe haché
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
        .catch((error) => res.status(400).json({ error })); // Gestion des erreurs d'inscription (e.g., email déjà utilisé)
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur pour le hachage
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche de l'utilisateur par son email
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // Message générique
      }
      bcrypt
        .compare(req.body.password, user.password) // Comparaison du mot de passe avec le hash stocké
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // Message cohérent
          }
          // Génération d'un token JWT
          const token = jwt.sign(
            { userId: user._id }, // Payload (données encodées)
            'RANDOM_TOKEN_SECRET', // Clé secrète (à remplacer par une clé plus complexe en production)
            { expiresIn: '24h' } // Durée de validité
          );
          res.status(200).json({
            userId: user._id,
            token: token, // Envoi du token au client
          });
        })
        .catch((error) => res.status(500).json({ error })); // Erreur serveur pour la comparaison
    })
    .catch((error) => res.status(500).json({ error })); // Erreur serveur pour la recherche d'utilisateur
};



