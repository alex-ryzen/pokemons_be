import { ApiError } from "../errors/ApiError";
import { filterCategories, filterTypes, ShopItemsQuerySchema, sortOptions, sortOrders, type ShopQueryData, type ShopRawType } from "../validations/shop.schema";

export function handleShop(raw: ShopRawType): ShopQueryData {
    const base = ShopItemsQuerySchema.parse(raw);
        const shopData: ShopQueryData = {
            limit: base.limit,
            offset: base.offset,
            filter: {
                filterLists: {},
                filterRanges: {},
                filterSelects: {},
            },
            sort: [['updatedAt', 'DESC']]
        };

        if (base.filter) {
            const filters = base.filter.split(";");
            const key_regex = /(.+?)\[(.+?)\]/;
            filters?.map((fltr, f_idx) => {
                const [key, value] = fltr.split(":");
                const filterMatch = key?.match(key_regex);
                if (
                    !key ||
                    value === undefined ||
                    !filterMatch ||
                    !filterMatch[1] ||
                    !filterMatch[2] ||
                    !filterCategories.includes(filterMatch[1]) ||
                    !filterTypes.includes(filterMatch[2])
                ) {
                    throw new ApiError(422, "Invalid filter format");
                }
                const filterCat = filterMatch[1];
                const filterType = filterMatch[2];
                if (filterType === "checkbox") {
                    shopData.filter.filterLists[filterCat] = value.split(",");
                } else if (filterType === "range") {
                    const from_val = value.split('_')[0]
                    const to_val = value.split('_')[1]
                    shopData.filter.filterRanges[filterCat] = {from: from_val || null, to: to_val || null}
                } else if (filterType === "select") {
                    shopData.filter.filterSelects[filterCat] = value
                }
            });
        }

        if (base.sort) {
            const [option, order] = base.sort.split('-');
            if (!option ||
                !order ||
                !sortOptions.includes(option) ||
                !sortOrders.includes(order)
            ) {
                throw new ApiError(422, "Invalid sort format");
            }
            shopData.sort = [[option, order.toUpperCase()]]
        }
        
        // if (base.search) {}

        return shopData
}