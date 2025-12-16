import type { NextFunction, Request, Response } from "express";
import { asString } from "../utils/helpers";
import { handleShop } from "../utils/handlers";
import shopService from "../services/shop-service";

class ShopController {
    static async getShopItems(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = {
                limit: asString(req.query.limit),
                offset: asString(req.query.offset),
                filter: asString(req.query.filter),
                sort: asString(req.query.sort),
                search: asString(req.query.search),
            };
            const shopData = handleShop(raw)
            const {rows, count} = await shopService.shopItems(shopData)
            return res.send({items: rows, total: count})
        } catch (e) {
            next(e)
        }
    }
}

export default ShopController;
