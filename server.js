const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let game = {
    memeImage: null,
    phase: 'waiting'
};

io.on('connection', (socket) => {
    // Si alguien entra, recibe la imagen actual
    if (game.memeImage) socket.emit('new-meme', game.memeImage);

    socket.on('upload-meme', (data) => {
        game.memeImage = data;
        io.emit('new-meme', data);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
