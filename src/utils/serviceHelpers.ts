import { Op, type WhereAttributeHashValue } from "sequelize";

export function handleSeqRange<T extends string>(option: { from: T | null; to: T | null} | undefined): WhereAttributeHashValue<T> | undefined {
    if (option && option.from && option.to) {
        if (option.from !== 'min' && option.to !== 'max') {
            return { [Op.between]: [option.from, option.to]} as WhereAttributeHashValue<T>;
        } else if (option.from === 'min') {
            return { [Op.lte]: option.to} as WhereAttributeHashValue<T>;
        } else if (option.to === 'max') {
            return { [Op.gte]: option.from} as WhereAttributeHashValue<T>;
        }
    }
    return undefined
}