const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const io = require('../server'); // Importa el servidor de sockets

const filePath = './data/products.json';

// Función auxiliar para leer los productos
const getProducts = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Ruta POST / (Agregar nuevo producto)
router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const products = getProducts();
    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    io.emit('updateProducts', products); // Emitir actualización de productos

    res.status(201).json(newProduct);
});

// Ruta DELETE /:pid (Eliminar producto)
router.delete('/:pid', (req, res) => {
    const products = getProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);

    if (products.length === newProducts.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    fs.writeFileSync(filePath, JSON.stringify(newProducts, null, 2));

    io.emit('updateProducts', newProducts); // Emitir actualización de productos

    res.json({ message: 'Producto eliminado' });
});

module.exports = router;
