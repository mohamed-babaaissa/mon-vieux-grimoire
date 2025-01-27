const http = require('http');
const app = require('./app'); // Importation de l'application

require('dotenv').config(); // Charge les variables d'environnement

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Serveur backend actif sur http://localhost:${PORT}`);
});


