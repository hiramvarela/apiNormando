const { eleccionNumero, _getPokemonInfo, eleccionEquipo, crearJuego, obtenerInfoJuego, actualizarSecuencia } = require('../src/services/logicaJuego');
const axios = require('axios');
const Game = require('../src/models/gameModel');

jest.mock('axios');
jest.mock('../src/models/gameModel');

describe('logicaJuego', () => {

    it('eleccionNumero debería devolver un número impar dentro del rango', () => {
        const num = eleccionNumero(1, 99); // Cambio a rango impar
        expect(num % 2).toBe(1);
    });

    it('eleccionNumero debería lanzar un error si el rango es inválido usando una nueva condición', () => {
        expect(() => eleccionNumero(100, -1)).toThrow('Rango inválido: inicio es mayor que fin');
    });

    // Pruebas para _getPokemonInfo
    it('_getPokemonInfo debería devolver la información correcta del Pokémon', async () => {
        const mockData = {
            data: {
                id: 132,
                name: 'ditto',
                sprites: { front_default: 'image_url' }
            }
        };
        axios.get.mockResolvedValue(mockData);
        const data = await _getPokemonInfo(132);
        expect(data).toEqual({ identificador: 132, nombre: 'ditto', imagenUrl: 'image_url' });
    });

    it('_getPokemonInfo debería lanzar un error si la llamada a la API falla usando una nueva condición', async () => {
        axios.get.mockRejectedValue(new Error('Fallo en la llamada a la API'));
        await expect(_getPokemonInfo(132)).rejects.toThrow('Fallo en la llamada a la API');
    });

    // Pruebas para eleccionEquipo
    it('eleccionEquipo debería devolver un array con la información de los Pokémon', async () => {
        const mockData = {
            data: {
                id: 132,
                name: 'ditto',
                sprites: { front_default: 'image_url' }
            }
        };
        axios.get.mockResolvedValue(mockData);
        const equipo = await eleccionEquipo([132, 132, 132, 132, 132, 132]); 
        expect(equipo).toHaveLength(6);
        expect(equipo[0]).toEqual({ identificador: 132, nombre: 'ditto', imagenUrl: 'image_url' });
    });

    it('eleccionEquipo debería lanzar un error si una de las llamadas a la API falla', async () => {
        axios.get.mockRejectedValueOnce(new Error('Fallo en la llamada a la API'));
        await expect(eleccionEquipo([132, 132, 132, 132, 132, 132])).rejects.toThrow('Fallo en la llamada a la API');
    });

    // Pruebas para crearJuego
    it('crearJuego debería crear y devolver un juego', async () => {
        const mockGame = { _id: '123', initialTeam: [132, 132, 132, 132, 132, 132], pokemonSequence: [] };
        Game.prototype.save = jest.fn().mockResolvedValue(mockGame);
        const juego = await crearJuego([132, 132, 132, 132, 132, 132]);
        expect(juego).toEqual(mockGame);
    });

    it('crearJuego debería lanzar un error si guardar el juego falla', async () => {
        Game.prototype.save = jest.fn().mockRejectedValue(new Error('Error al guardar'));
        await expect(crearJuego([132, 132, 132, 132, 132, 132])).rejects.toThrow('Error al guardar');
    });

    // Pruebas para obtenerInfoJuego
    it('obtenerInfoJuego debería devolver la información del juego', async () => {
        const mockGame = { _id: '123', initialTeam: [132, 132, 132, 132, 132, 132], pokemonSequence: [] };
        Game.findById = jest.fn().mockResolvedValue(mockGame);
        const juego = await obtenerInfoJuego('123');
        expect(juego).toEqual(mockGame);
    });

    it('obtenerInfoJuego debería lanzar un error si el juego no se encuentra usando una nueva condición', async () => {
        Game.findById = jest.fn().mockResolvedValue(null);
        await expect(obtenerInfoJuego('123')).rejects.toThrow('Juego no encontrado');
    });

    // Pruebas para actualizarSecuencia
    it('actualizarSecuencia debería actualizar la secuencia del juego', async () => {
        const mockUpdatedGame = {
            _id: '123',
            initialTeam: [132, 132, 132, 132, 132, 132],
            pokemonSequence: [7]
        };
        Game.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedGame);
        const result = await actualizarSecuencia('123', 7);
        expect(result).toEqual(mockUpdatedGame);
    });

    it('actualizarSecuencia debería lanzar un error si la actualización falla usando una nueva condición', async () => {
        Game.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Error en la actualización'));
        await expect(actualizarSecuencia('123', 7)).rejects.toThrow('Error en la actualización');
    });
});
