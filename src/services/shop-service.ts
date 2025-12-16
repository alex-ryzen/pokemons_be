import { Op, type Order } from "sequelize";
import { Player } from "../models/Player";
import { ShopProduct } from "../models/ShopProducts";
import { handleSeqRange } from "../utils/serviceHelpers";
import type { ShopQueryData } from "../validations/shop.schema";

class ShopService {
    async shopItems(query: ShopQueryData) {
        const priceWhere = handleSeqRange(query.filter.filterRanges['price']);
        const itemTypes = query.filter.filterLists['product'];
        const where = {
            ...(itemTypes?.length && itemTypes[0] !== 'null' ? { item_type: { [Op.in]: itemTypes } } : {}),
            ...(priceWhere ? { price: priceWhere } : {}),
        };
        const {rows, count} = await ShopProduct.findAndCountAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            where: where,
            order: query.sort as unknown as Order,
            limit: query.limit,
            offset: query.offset, //for cursor search should to change logic of search by id -> more effective
            raw: true
        });
        return {rows, count}
    }
    
    async buyItem(player_id: number, item_id: number) {
        const player = await Player.findByPk(player_id, {attributes: ['balance']})
        //const item = await player?.balance
    }


}

export default new ShopService();