const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const path = require('path');

app.use(express.json());

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas para las vistas
app.get('/home', (req, res) => {
    const products = getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Puerto
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exportar io para uso en otras rutas
module.exports = io;
