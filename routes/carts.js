const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const cartFilePath = './data/carts.json';
const productFilePath = './data/products.json';

// Función auxiliar para leer los carritos
const getCarts = () => {
    try {
        const data = fs.readFileSync(cartFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Función auxiliar para leer los productos
const getProducts = () => {
    try {
        const data = fs.readFileSync(productFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Ruta POST /:cid/product/:pid (Agregar producto al carrito)
router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const products = getProducts();
    const cart = carts.find(c => c.id === req.params.cid);
    const product = products.find(p => p.id === req.params.pid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado en la base de datos' });
    }

    const existingProduct = cart.products.find(p => p.product === req.params.pid);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
    res.json(cart);
});

module.exports = router;
