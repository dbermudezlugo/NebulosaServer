const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const filePath = './data/products.json';

// Función auxiliar para leer los productos
const getProducts = () => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Ruta GET / (Listar todos los productos)
router.get('/', (req, res) => {
    const products = getProducts();
    const { limit } = req.query;
    res.json(limit ? products.slice(0, limit) : products);
});

// Ruta GET /:pid (Traer producto por ID)
router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

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
    res.status(201).json(newProduct);
});

// Ruta PUT /:pid (Actualizar producto)
router.put('/:pid', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
    products[index] = updatedProduct;
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    res.json(updatedProduct);
});

// Ruta DELETE /:pid (Eliminar producto)
router.delete('/:pid', (req, res) => {
    const products = getProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);

    if (products.length === newProducts.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    fs.writeFileSync(filePath, JSON.stringify(newProducts, null, 2));
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;
