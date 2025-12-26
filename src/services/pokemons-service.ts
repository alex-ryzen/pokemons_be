import { ApiError } from "../errors/ApiError"
import { Player } from "../models/Player"
import { PlayersPokemon } from "../models/PlayersPokemon"


class PokemonService {
    async getPlayersPokemons(player_id: number) {
        const player = await Player.findByPk(player_id, {include: PlayersPokemon})
        if (player?.playersPokemon) {
            return player.playersPokemon as PlayersPokemon[]
        } else {
            return ApiError.NotFound('No one player\'s pokemon was found')
        }
    }
}

export default new PokemonService();