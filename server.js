const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let currentMeme = ""; // Guardamos el link aquí

io.on('connection', (socket) => {
    // Si ya hay un meme, envíaselo al nuevo usuario que acaba de entrar
    if (currentMeme) {
        socket.emit('display-meme', currentMeme);
    }

    socket.on('set-meme-image', (imageUrl) => {
        currentMeme = imageUrl; // Actualizamos el estado
        io.emit('display-meme', imageUrl); // Enviamos a todos
    });

    socket.on('submit-caption', (caption) => {
        io.emit('new-caption', caption);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
