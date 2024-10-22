const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const filePath = './data/carts.json';

// Función auxiliar para leer los carritos
const getCarts = () => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Ruta POST / (Crear un nuevo carrito)
router.post('/', (req, res) => {
    const carts = getCarts();
    const newCart = {
        id: uuidv4(),
        products: []
    };

    carts.push(newCart);
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});

// Ruta GET /:cid (Listar productos de un carrito)
router.get('/:cid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    cart ? res.json(cart) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Ruta POST /:cid/product/:pid (Agregar producto al carrito)
router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product === req.params.pid);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));
    res.json(cart);
});

module.exports = router;
