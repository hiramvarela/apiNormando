const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Game = require('../src/models/gameModel');

describe('API de Juegos', () => {

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('debería iniciar un nuevo juego', async () => {
        const response = await request(app).get('/crearJuego');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('idJuego');
        expect(response.body).toHaveProperty('equipoInicial');
    });

    it('debería devolver 500 si ocurre un error durante la inicialización del juego', async () => {
        jest.spyOn(Game.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Error al guardar en la base de datos');
        });

        const response = await request(app).get('/crearJuego');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error iniciando el juego: Error al guardar en la base de datos');
    });

    it('debería comparar la secuencia', async () => {
        const newGameResponse = await request(app).get('/crearJuego');
        const idJuego = newGameResponse.body.idJuego;

        const pokemonInicial = newGameResponse.body.equipoInicial.find(
            (pokemon) => pokemon.identificador === newGameResponse.body.equipoInicial[0].identificador
        ).identificador;
        
        const response = await request(app)
            .post('/enviarSecuencia')
            .send({ idJuego, pokemons: [pokemonInicial] });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('resultado', 'SEGUIR');
        expect(response.body).toHaveProperty('pokemonSequence');
    });

    it('debería devolver 500 si ocurre un error durante la comparación de la secuencia', async () => {
        const newGameResponse = await request(app).get('/crearJuego');
        const idJuego = newGameResponse.body.idJuego;

        jest.spyOn(Game, 'findById').mockImplementationOnce(() => {
            throw new Error('Error al buscar en la base de datos');
        });

        const response = await request(app)
            .post('/enviarSecuencia')
            .send({ idJuego, pokemons: [1] });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error comparando la secuencia: Error al buscar en la base de datos');
    });
});
