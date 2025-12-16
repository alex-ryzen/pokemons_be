import {
    Model,
    DataTypes,
    Sequelize,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
} from "sequelize";

export class ShopProduct extends Model<
    InferAttributes<ShopProduct>,
    InferCreationAttributes<ShopProduct>
> {
    declare item_type: "berry" | "pokeball";
    declare item_id: number;

    declare category: string | null;
    declare name: string | null;

    declare price: string | null;
    declare level: number | null;

    declare specs: unknown | null;
    declare image: string | null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static initialize(sequelize: Sequelize) {
        ShopProduct.init(
            {
                item_type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                item_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                category: {
                    type: DataTypes.STRING(63),
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.DECIMAL(14, 2),
                    allowNull: true,
                },
                level: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                specs: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                image: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE,
            },
            {
                sequelize,
                tableName: "shop_products",
                timestamps: true,
                createdAt: "createdAt",
                updatedAt: "updatedAt",

                freezeTableName: true,
            }
        );
    }
}
