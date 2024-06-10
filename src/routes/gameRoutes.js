const express = require('express');
const router = express.Router();
const { iniciarJuego, compararSecuencia } = require('../controllers/servicios');

router.get('/crearJuego', iniciarJuego);
router.post('/enviarSecuencia', compararSecuencia);

module.exports = router;
