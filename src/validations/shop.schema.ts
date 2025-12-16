import { z } from "zod";

// want this format:
// ?limit=val&offset=val&filter=category1[type1]:val1,val2;category2[type1]:val3,val4,val5;category3[type2]:val1-val2&sort=value-orderBy&search=str
// type1 is list, type2 is range

export type ShopRawType = {
    limit: string | undefined,
    offset: string | undefined,
    filter: string | undefined,
    sort: string | undefined,
    search: string | undefined,
}

export interface ShopQueryData {
    limit: number;
    offset: number;
    filter: {
        filterLists: Record<string, string[]>;
        filterRanges: Record<string, { from: string | null; to: string | null} >; //string | string[]
        filterSelects: Record<string, string>;
    };
    sort: [string, string][]; //format: [[`${columnName}`, `${direction}`]]    // as was { sortOption: string; sortOrderBy: SortOrderType }
}

export const shopItemTypes = ["pokeball", "berry"];
export const filterTypes = ["checkbox", "range", "select"];
export const filterCategories = ["product", "price"];
export const sortOptions = ["updatedAt", "price", "level", "name"];
export const sortOrders = ["ASC", "DESC"];

export const items_limit = {
    min: 1,
    max: 200,
    default: 50,
}

export const ShopItemsQuerySchema = z.object({
    limit: z.coerce.number().int().min(items_limit.min).max(items_limit.max).default(items_limit.default),
    offset: z.coerce.number().int().min(0).default(0),
    filter: z.string().trim().optional(),
    sort: z.string().trim().optional(),
    search: z.string().trim().optional(),
});

//  sort: z.enum(ShopSortVatiants).default("date-desc")
