//
export function asString(v: unknown): string | undefined {
    if (typeof v === "string") return v;
    if (Array.isArray(v) && typeof v[0] === "string") return v[0];
    return undefined;
}

export function uppercaseFirst(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function normilizeSize(
    x: number,
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
): number {
    if (x >= xMin && x <= xMax && xMin <= xMax && yMin <= yMax) {
        return yMin + (x - xMin) * ((yMax - yMin) / (xMax - xMin));
    } else {
        throw Error("Error with function arguments values");
    }
}
