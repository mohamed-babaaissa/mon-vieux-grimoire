require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require('../models/user');

// Inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  console.log('📩 Données reçues pour l\'inscription :', req.body);

  bcrypt
    .hash(req.body.password, 10) // Hachage du mot de passe avec un salage de 10 tours
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash, // Stockage sécurisé du mot de passe haché
      });

      user
        .save()
        .then(() => res.status(201).json({ message: '✅ Utilisateur créé avec succès !' }))
        .catch((error) => {
          console.error("⚠️ Erreur d'inscription :", error);
          res.status(400).json({ error: error.message || '⚠️ Email déjà utilisé ou erreur dans les données' });
        }); 
    })
    .catch((error) => {
      console.error("❌ Erreur serveur lors du hachage du mot de passe :", error);
      res.status(500).json({ error: error.message || '❌ Erreur serveur lors du hachage du mot de passe' });
    });
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  console.log('🔑 Tentative de connexion avec email:', req.body.email);

  User.findOne({ email: req.body.email }) // Recherche de l'utilisateur par son email
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: '❌ Identifiants incorrects' }); // Message générique pour la sécurité
      }

      bcrypt
        .compare(req.body.password, user.password) // Comparaison du mot de passe avec le hash stocké
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: '❌ Identifiants incorrects' }); 
          }

          // Génération d'un token JWT sécurisé
          const token = jwt.sign(
            { userId: user._id }, // Payload sécurisé
            process.env.JWT_SECRET, // 🔒 Utilisation de la clé secrète du fichier .env
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } // Expiration configurable
          );

          res.status(200).json({
            userId: user._id,
            token: token, // Envoi du token au client
          });

          console.log(`✅ Connexion réussie pour l'utilisateur ${user.email}`);
        })
        .catch((error) => {
          console.error("❌ Erreur serveur lors de la vérification du mot de passe :", error);
          res.status(500).json({ error: error.message || '❌ Erreur serveur lors de la vérification du mot de passe' });
        });
    })
    .catch((error) => {
      console.error("❌ Erreur serveur lors de la recherche de l'utilisateur :", error);
      res.status(500).json({ error: error.message || '❌ Erreur serveur lors de la recherche de l\'utilisateur' });
    });
};





