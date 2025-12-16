import { z } from "zod";

const ListFilter = z.object({
    type: z.literal("list"),
    value: z.array(z.string())
});

const RangeValue = z.object({
    from: z.number().int().optional(),
    to: z.number().int().optional()
});
const RangeFilter = z.object({
    type: z.literal("range"),
    value: RangeValue
});

const FilterEntryValue = z.union([ListFilter, RangeFilter]);

const _FilterSchema = z.record(z.string().regex(/^[a-z][a-z0-9_-]*$/i), FilterEntryValue);

const _SortSchema = z.object({
    option: z.string(),
    orderBy: z.enum(["asc", "desc"])
});

const QpSchema = z.object({
    limit: z.preprocess((arg) => {
        const n = Number(arg);
        return Number.isFinite(n) ? n : undefined;
    }, z.number().int().positive().optional()),
    offset: z.preprocess((arg) => {
        const n = Number(arg);
        return Number.isFinite(n) ? n : undefined;
    }, z.number().int().nonnegative().optional()),
    filter: _FilterSchema.optional(),
    sort: _SortSchema.optional(),
    search: z.string().optional()
});

export default QpSchema;

