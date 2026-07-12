const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Estado de la sala
let game = {
    memeImage: null, // Guardaremos el buffer aquí
    phase: 'waiting', // 'writing', 'voting', 'results'
    captions: [],
    players: {}
};

io.on('connection', (socket) => {
    // El Admin sube la imagen (recibida como buffer)
    socket.on('upload-meme', (data) => {
        game.memeImage = data; // Guardado en RAM
        game.phase = 'writing';
        io.emit('phase-start', { phase: 'writing', image: data });
    });

    // Sincronización para nuevos jugadores
    socket.on('join-game', () => {
        if (game.memeImage) {
            socket.emit('phase-start', { phase: game.phase, image: game.memeImage });
        }
    });

    // ... lógica de fases y votación ...
});

http.listen(3000);
