const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  // El Admin emite una nueva imagen a todos
  socket.on('set-meme-image', (imageUrl) => {
    io.emit('display-meme', imageUrl);
  });

  // Manejo de textos de memes
  socket.on('submit-caption', (data) => {
    io.emit('new-caption', data);
  });
});

http.listen(process.env.PORT || 3000);
