import { includes } from "zod";
import { Player } from "../models/Player";
import Big, { type BigSource } from "big.js";
import { ApiError } from "../errors/ApiError";
import { InventoryItem } from "../models/InventoryItem";
import { Pokemon } from "../models/Pokemon";
import { PlayersPokemon } from "../models/PlayersPokemon";
import { col, fn } from "sequelize";
import { Garden } from "../models/Garden";
import { ActiveGardenService } from "../models/ActiveGardenService";
import { GrowingBerry } from "../models/GrowingBerry";
import { User } from "../models/User";

interface AdvancedPlayer extends Player {
    income: number;
}

class UserService {
    async initApp(user_id: number) {
        const user = await User.findByPk(user_id, {
            include: [
                {
                    model: Player,
                    include: [
                        {
                            model: InventoryItem,
                        },
                        {
                            model: Garden,
                            include: [
                                {
                                    model: ActiveGardenService,
                                },
                                {
                                    model: GrowingBerry
                                }
                            ]
                        },
                        {
                            model: PlayersPokemon
                        },
                    ],
                    attributes: [
                        [fn('SUM', col('PlayersPokemon.income')), 'income']
                    ]
                }
            ]
        })
        if (user) {
            return user
        } else {
            return ApiError.Internal('Something went wrong... Can\'t get user\'s data')
        }
    }
    
    async getPlayersBalance(player_id: number) {
        const player = await Player.findByPk(player_id, {attributes: {include: ['balance']}})
        if (player?.balance) {
            const balance = new Big(player?.balance)
            return balance
        } else {
            return ApiError.Internal('Something went wrong... Can\'t get player\'s balance')
        }
    }
    async getPlayersIncome(player_id: number) {
        const player = await Player.findByPk(player_id, {
            attributes: [
                [fn('SUM', col('PlayersPokemon.income')), 'income']
            ],
            include: PlayersPokemon,
            group: ['Player.id'],
        }) as AdvancedPlayer
        if (player?.income) {
            return player.income
        } else {
            return ApiError.NotFound('Can\'t calculate players income... no pokemons maybe (-_-)')
        }
    }
    async getPlayersPokemons(player_id: number) {
        const player = await Player.findByPk(player_id, {include: PlayersPokemon})
        if (player?.playersPokemon) {
            return player.playersPokemon as PlayersPokemon[]
        } else {
            return ApiError.NotFound('No one player\'s pokemon was found')
        }
    }
}

export default new UserService();