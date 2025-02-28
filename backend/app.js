require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user'); 

const app = express();
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});


// Connexion à MongoDB
const DB_URI = process.env.DB_URI.replace('${DB_USER}', process.env.DB_USER)
                                 .replace('${DB_PASSWORD}', process.env.DB_PASSWORD)
                                 .replace('${DB_NAME}', process.env.DB_NAME)
                                 .replace('${DB_HOST}', process.env.DB_HOST);

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion sécurisée à MongoDB réussie !'))
.catch((error) => console.error('❌ Connexion à MongoDB échouée :', error));


// Middleware pour gérer les erreurs CORS
app.use(cors()); // Utilisation du middleware CORS pour tout gérer
app.options('*', cors()); // Autorise toutes les requêtes prévols

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// Middleware pour servir le dossier des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes); 

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

module.exports = app;











