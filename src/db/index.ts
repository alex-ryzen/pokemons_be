// postgre init + connect + db instance

// from ../models/*
import { Model, Sequelize } from 'sequelize';
import { User } from '../models/User';
import { Player } from '../models/Player';
import { Pokemon } from '../models/Pokemon';
import { PlayersPokemon } from '../models/PlayersPokemon';
import { Pokeball } from '../models/Pokeball';
import { Berry } from '../models/Berry';
import { Inventory } from '../models/Inventory';
import { Garden } from '../models/Garden';
import { GardenService } from '../models/GardenService';
import { ActiveGardenService } from '../models/ActiveGardenService';
import { GrowingBerry } from '../models/GrowingBerry';
import { ItemCard } from '../models/ItemCard';
import { Token } from '../models/Token';

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'pokemons',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    // logging: false,
});

User.initialize(sequelize);
Token.initialize(sequelize);
Player.initialize(sequelize);
Pokemon.initialize(sequelize);
PlayersPokemon.initialize(sequelize);
Pokeball.initialize(sequelize);
Berry.initialize(sequelize);
Inventory.initialize(sequelize);
Garden.initialize(sequelize);
GardenService.initialize(sequelize);
ActiveGardenService.initialize(sequelize);
GrowingBerry.initialize(sequelize);
ItemCard.initialize(sequelize);

User.hasOne(Player, { foreignKey: 'user_id', onDelete: 'CASCADE'});
Token.belongsTo(User, { foreignKey: 'user_id' });
Pokemon.hasMany(PlayersPokemon, { foreignKey: 'pokemon_id' });
PlayersPokemon.belongsTo(Pokemon, { foreignKey: 'pokemon_id' });
PlayersPokemon.belongsTo(Player, { foreignKey: 'player_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });
Player.hasMany(PlayersPokemon, { foreignKey: 'player_id' });
Player.hasMany(Inventory, { foreignKey: 'player_id' });
Player.hasOne(Garden, { foreignKey: 'player_id' });
Inventory.belongsTo(Player, { foreignKey: 'player_id' });
GrowingBerry.belongsTo(Garden, { foreignKey: 'garden_id' });
GrowingBerry.belongsTo(Berry, { foreignKey: 'berry_id' });
GardenService.hasMany(ActiveGardenService, {foreignKey: "garden_service_id",});
Garden.belongsTo(Player, { foreignKey: 'player_id' });
Garden.hasMany(ActiveGardenService, { foreignKey: 'garden_id' });
Garden.hasMany(GrowingBerry, { foreignKey: 'garden_id' });
Berry.hasMany(GrowingBerry, { foreignKey: 'berry_id' });
ActiveGardenService.belongsTo(Garden, { foreignKey: 'garden_id' });
ActiveGardenService.belongsTo(GardenService, { foreignKey: 'garden_service_id' });

const models = {
    User,
    Token,
    Player,
    Pokemon,
    PlayersPokemon,
    Pokeball,
    Berry,
    Inventory,
    Garden,
    GardenService,
    ActiveGardenService,
    GrowingBerry,
    ItemCard,
};

export default models;