const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let gameState = {
    phase: 'waiting', // waiting, writing, voting, results
    currentMeme: null,
    captions: [], // {playerId, text}
    votes: {}
};

io.on('connection', (socket) => {
    // Sincronizar nuevo jugador con el estado actual
    socket.emit('sync-state', gameState);

    socket.on('admin-set-meme', (url) => {
        gameState.currentMeme = url;
        gameState.phase = 'writing';
        io.emit('phase-change', { phase: 'writing', meme: url });
    });

    socket.on('submit-caption', (data) => {
        gameState.captions.push({ id: socket.id, text: data.text });
        if (gameState.captions.length === currentPlayers) {
            gameState.phase = 'voting';
            io.emit('start-voting', gameState.captions);
        }
    });
});
