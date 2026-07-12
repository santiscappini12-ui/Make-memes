const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Usuario conectado: ' + socket.id);

    // El admin envía la URL de la imagen
    socket.on('set-meme-image', (imageUrl) => {
        io.emit('display-meme', imageUrl);
    });

    // Los jugadores envían sus frases
    socket.on('submit-caption', (caption) => {
        io.emit('new-caption', caption);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
