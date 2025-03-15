const express = require('express');
const ClienteController = require('../controller/clienteController');
const router = express.Router();
const clienteController = new ClienteController();

router.post('/', (req, res) => {
    clienteController.createCliente();
});

module.exports = router; // Exporta o roteador de usuários
