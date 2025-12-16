import fs from "fs"
import path from "path"
import JsonFabric from "../file-fabric";
import { Pokeball } from "../../models/Pokeball";
import fs_promises from "fs/promises"
import { save_picture } from "../../utils/parserUtils";
import { absPath } from "../..";
import { getUrlFilename } from "../../utils/urlUtils";

export const lvl_normalize = (cost: number) => {
    if (cost <= 10) {
        return 1
    } else if (cost > 10 && cost <= 100) {
        return 2
    } else if (cost > 100 && cost <= 500) {
        return 3
    } else if (cost > 500 && cost <= 1000) {
        return 4
    } else if (cost > 1000) {
        const lvl = 5 + Math.round((cost - 1000) / 1000)
        if (lvl <= 45) {
            return lvl 
        } else {
            return 45
        }
    } else {
        return 0
    }
}

async function pokeballJsonFabric() {
    const data_filepath = path.join(absPath(import.meta.url), "../../../pokemon-data/item")
    const searchSubstr = 'items'
    const folderTheme = "pokeball"
    const publicFilePath = `./static/images/${folderTheme}/`

    type PokeballJsonType = {
        id: number,
        name: string,
        category: {
            name: string;
        },
        cost: number,
        sprites: {
            default: string
        }
    }

    function pokeballFunc(data: PokeballJsonType, order: number) {
        if (data.category.name.includes("ball")) {
            const lvl = lvl_normalize(data.cost);
            const chance = lvl * 2.14;
            const pokeball = Pokeball.create({
                name: data.name,
                category: data.category.name,
                image: data.sprites.default ? publicFilePath.concat(getUrlFilename(data.sprites.default, searchSubstr)) : "",
                price: data.cost.toFixed(2),
                level: lvl,
                chance: chance.toFixed(2),
            })
            // const pokeball = {
            //     name: data.name,
            //     category: data.category.name,
            //     image: data.sprites.default ? publicFilePath.concat(getUrlFilename(data.sprites.default, searchSubstr)) : "",
            //     price: Number(data.cost.toFixed(2)),
            //     level: lvl,
            //     chance: Number(chance.toFixed(2)),
            // }
            console.log("pokeball ", pokeball)
            console.log(`Pokeball #${order} has been transferred to db!`)
            return {image: data.sprites.default}
        }   
        return {image: null}
    }

    const fabric = new JsonFabric(data_filepath)

    await fabric.extractData("Pokeballs", pokeballFunc)
    // console.log("POKEBALLS LIST: ", fabric.image_list)
    // await fs_promises.writeFile(path.join(absPath(import.meta.url), "pokeball_images.json"), JSON.stringify(fabric.image_list), "utf-8") // optional move
    // for (const imgUrl of fabric.image_list) {
    //     if (imgUrl) {
    //         await save_picture(imgUrl, folderTheme, getUrlFilename(imgUrl, searchSubstr))
    //     }
    // }
}

export default pokeballJsonFabric

/**
 * lvl logic by costs:
 * lvl 1: from 0 to 10
 * lvl 2: from 10 to 100
 * lvl 3: from 100 to 500
 * lvl 4: from 500 to 1000
 * lvl 5: from 1000 to 2000
 * lvl 6: from 2000 to 3000
 * lvl 7 ... etc. +1000 const = +1 lvl
 */