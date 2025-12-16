// postgre init + connect + db instance

// from ../models/*
import { Model, Sequelize } from 'sequelize';
import { User } from '../models/User';
import { Player } from '../models/Player';
import { Pokemon } from '../models/Pokemon';
import { PlayersPokemon } from '../models/PlayersPokemon';
import { Pokeball } from '../models/Pokeball';
import { Berry } from '../models/Berry';
import { InventoryItem } from '../models/InventoryItem';
import { Garden } from '../models/Garden';
import { GardenService } from '../models/GardenService';
import { ActiveGardenService } from '../models/ActiveGardenService';
import { GrowingBerry } from '../models/GrowingBerry';
import { ItemCard } from '../models/ItemCard';
import { Token } from '../models/Token';
import { ShopProduct } from '../models/ShopProducts';

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'pokemons',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    logging: false,
});

export async function db_connect() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();// no sync, no alter or moreover force - use migrations - {alter: true}
        console.log('[W] Database connection has been established successfully.');
    } catch (error) {
        console.error('[L] Unable to connect to the database:', error);
    }
}

User.initialize(sequelize);
Token.initialize(sequelize);
Player.initialize(sequelize);
Pokemon.initialize(sequelize);
PlayersPokemon.initialize(sequelize);
Pokeball.initialize(sequelize);
Berry.initialize(sequelize);
InventoryItem.initialize(sequelize);
Garden.initialize(sequelize);
GardenService.initialize(sequelize);
ActiveGardenService.initialize(sequelize);
GrowingBerry.initialize(sequelize);
ItemCard.initialize(sequelize);
ShopProduct.initialize(sequelize);

User.hasOne(Player, { foreignKey: 'user_id', onDelete: 'CASCADE'});
Token.belongsTo(User, { foreignKey: 'user_id' });
Pokemon.hasMany(PlayersPokemon, { foreignKey: 'pokemon_id' });
PlayersPokemon.belongsTo(Pokemon, { foreignKey: 'pokemon_id' });
PlayersPokemon.belongsTo(Player, { foreignKey: 'player_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });
Player.hasMany(PlayersPokemon, { foreignKey: 'player_id' });
Player.hasMany(InventoryItem, { foreignKey: 'player_id' });
Player.hasOne(Garden, { foreignKey: 'player_id' });

InventoryItem.belongsTo(Player, { foreignKey: 'player_id' });
InventoryItem.belongsTo(Berry, { foreignKey: 'item_id', constraints: false})
InventoryItem.belongsTo(Pokeball, { foreignKey: 'item_id', constraints: false})

GrowingBerry.belongsTo(Garden, { foreignKey: 'garden_id' });
GrowingBerry.belongsTo(Berry, { foreignKey: 'berry_id' });
GardenService.hasMany(ActiveGardenService, {foreignKey: "garden_service_id",});
Garden.belongsTo(Player, { foreignKey: 'player_id' });
Garden.hasMany(ActiveGardenService, { foreignKey: 'garden_id' });
Garden.hasMany(GrowingBerry, { foreignKey: 'garden_id' });
Berry.hasMany(GrowingBerry, { foreignKey: 'berry_id' });
Berry.hasMany(InventoryItem, { foreignKey: 'item_id', constraints: false, scope: {item_type: 'berry'}})
Pokeball.hasMany(InventoryItem, { foreignKey: 'item_id', constraints: false, scope: {item_type: 'pokeball'}})
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
    InventoryItem,
    Garden,
    GardenService,
    ActiveGardenService,
    GrowingBerry,
    ItemCard,
    ShopProduct,
};

export default models;