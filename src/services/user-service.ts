import { Player } from "../models/Player";
import Big, { type BigSource } from "big.js";
import { ApiError } from "../errors/ApiError";
import { InventoryItem } from "../models/InventoryItem";
import { PlayersPokemon } from "../models/PlayersPokemon";
import { col, fn } from "sequelize";
import { Garden } from "../models/Garden";
import { ActiveGardenService } from "../models/ActiveGardenService";
import { GrowingBerry } from "../models/GrowingBerry";
import { User } from "../models/User";

interface AdvancedPlayer extends Player {
    calc_income: string;
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

    async getData(user_id: number) {
        const user = await User.findByPk(user_id, {
            attributes: ['id', 'uuid', 'username', 'full_name', 'email', 'image', 'role', 'createdAt'],
            include: [
                {
                    model: Player,
                    as: "player",
                    attributes: ['id', 'balance', 'total_income', 'inventory_size', 'inv_ext_price']
                }
            ]
        })
        return user
    }
    
    async getActualBalance(player_id: number) {
        const player = await Player.findByPk(player_id, {attributes: {include: ['balance', 'last_seen_at', 'total_income']}});
        const now = new Date();
        if (player && player.balance && player.last_seen_at && player.total_income) {
            const balance = new Big(player?.balance).toNumber();
            const time_diff_ms = now.getTime() - player.last_seen_at.getTime();
            const seconds_passed = time_diff_ms / (1000);
            
            let earned_income = 0;
            const income_per_sec = Big(player.total_income).toNumber();
            
            if (seconds_passed > 0 && income_per_sec > 0) {
                earned_income = seconds_passed * income_per_sec;
            }
            player.last_seen_at = now;
            player.balance += earned_income;
            await player.save();
            return balance
        } else {
            throw ApiError.Internal('Something went wrong... Can\'t get player\'s balance')
        }
    }
    async updateIncome(player_id: number) {
        const player = await Player.findByPk(player_id, { // Player.update (for multiple) or player.update (for single)
            attributes: [
                'total_income',
                [fn('SUM', col('PlayersPokemon.income')), 'calc_income']
            ],
            include: PlayersPokemon,
            group: ['Player.id'],
            raw: true,
        }) as AdvancedPlayer
        if (player && player.calc_income) {
            player.total_income = player.calc_income
            await player.save();
            return player.total_income
        } else {
            throw ApiError.NotFound('Can\'t calculate player\'s income... no pokemons maybe (-_-)');
        }
    }
}

export default new UserService();