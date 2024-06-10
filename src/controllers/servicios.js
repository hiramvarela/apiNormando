const {
    eleccionNumero,
    eleccionEquipo,
    crearJuego,
    obtenerInfoJuego,
    actualizarSecuencia
} = require('../services/logicaJuego');

const iniciarJuego = async (req, res) => {
    try {
        const equipoInicial = Array.from({ length: 6 }, () => eleccionNumero(1, 386));
        const equipo = await eleccionEquipo(equipoInicial);

        const indiceAleatorio = eleccionNumero(0, equipoInicial.length - 1);
        const pokemonInicial = equipoInicial[indiceAleatorio];
        const game = await crearJuego(equipoInicial, [pokemonInicial]);

        res.json({
            idJuego: game._id,
            equipoInicial: equipo,
            pokemonInicial
        });
    } catch (error) {
        console.error('Error en iniciarJuego:', error);
        res.status(500).json({ error: 'Error iniciando el juego: ' + error.message });
    }
};

const compararSecuencia = async (req, res) => {
    const { idJuego, pokemons } = req.body;
    try {
        const game = await obtenerInfoJuego(idJuego);

        const isCorrect = pokemons.every((pokemon, index) => pokemon === game.pokemonSequence[index]);

        if (isCorrect) {
            const equipoInicial = game.initialTeam;
            const nuevoPokemonId = equipoInicial[eleccionNumero(0, equipoInicial.length - 1)];
            const juegoActualizado = await actualizarSecuencia(idJuego, nuevoPokemonId);

            const secuenciaCompleta = await eleccionEquipo(juegoActualizado.pokemonSequence);

            res.json({ 
                resultado: "SEGUIR", 
                pokemonSequence: secuenciaCompleta
            });
        } else {
            res.json({ 
                resultado: "TERMINADO", 
                score: game.pokemonSequence.length - 1 
            });
        }
    } catch (error) {
        console.error('Error en compararSecuencia:', error);
        res.status(500).json({ error: 'Error comparando la secuencia: ' + error.message });
    }
};

module.exports = { iniciarJuego, compararSecuencia };
