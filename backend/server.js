const http = require('http');
const app = require('./app'); 

require('dotenv').config(); 

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Serveur backend actif sur http://localhost:${PORT}`);
});


