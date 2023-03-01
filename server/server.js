const express = require('express');
const app = express();
const http = require('http');

app.get('/', (req, res) => {
  res.json({ name: 'Shen' });
});

http.createServer(app).listen(80);
