const fs = require('fs'); // Import du module fs pour gérer le système de fichiers
const Book = require('../models/book');

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id; 

    if (!req.file) {
      return res.status(400).json({ message: "❌ Aucune image reçue." });
    }

    // Vérification de l'URL finale
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    console.log("📸 URL de l'image enregistrée :", imageUrl);

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl, 
    });

    book.save()
      .then(() => {
        console.log("✅ Livre ajouté avec succès !");
        res.status(201).json({ message: "Livre ajouté avec succès !" });
      })
      .catch((error) => {
        console.error("❌ Erreur lors de l'enregistrement du livre :", error);
        if (req.file) {
          fs.unlinkSync(req.file.path); // Supprime l'image en cas d'erreur
        }
        res.status(400).json({ error });
      });
  } catch (error) {
    console.error("❌ Erreur inattendue :", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};


exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};


exports.getBookById = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  delete bookObject._userId; // Sécurise le champ _userId

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé !' });
      }

      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre mis à jour avec succès !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche du livre dans la base de données
    .then((book) => {
      if (book.userId !== req.auth.userId) { // Vérifie si l'utilisateur est bien le propriétaire
        return res.status(401).json({ message: 'Non autorisé !' });
      }
      const filename = book.imageUrl.split('/images/')[1]; // Récupère le nom du fichier à partir de l'URL
      fs.unlink(`images/${filename}`, (err) => { // Supprime le fichier image
        if (err) {
          return res.status(500).json({ message: 'Échec de la suppression du fichier.' });
        }
        Book.deleteOne({ _id: req.params.id }) // Supprime le livre de la base de données
          .then(() => res.status(200).json({ message: 'Livre supprimé avec succès !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const { userId, grade } = req.body;

  if (grade < 1 || grade > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 1 et 5.' });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }

      // Vérifie si l'utilisateur a déjà noté ce livre
      const existingRatingIndex = book.ratings.findIndex((rating) => rating.userId === userId);

      if (existingRatingIndex !== -1) {
        // Si l'utilisateur a déjà noté, on remplace l'ancienne note par la nouvelle
        book.ratings[existingRatingIndex].grade = grade;
      } else {
        // Sinon, on ajoute une nouvelle note
        book.ratings.push({ userId, grade });
      }

      // **Recalcule correctement la moyenne**
    // **Recalcule correctement la moyenne**
const totalRatings = book.ratings.length;
const sumGrades = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);

// Arrondi la moyenne à 2 décimales et convertit en float
book.averageRating = totalRatings > 0 ? parseFloat((sumGrades / totalRatings).toFixed(2)) : 0;


      return book.save();
    })
    .then((updatedBook) => {
      res.status(200).json(updatedBook);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};



exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Tri par note moyenne décroissante
    .limit(5) // Limite le nombre de résultats
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};


