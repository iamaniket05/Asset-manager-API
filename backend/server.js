//require('dotenv').config();
require('dotenv').config({ path: './backend/.env' });
const http = require('http');

const hostname = process.env.HOSTNAME
const port = process.env.PORT;

let app = require('./app');

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});