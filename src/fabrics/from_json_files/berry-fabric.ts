import fs from "fs"
import path from "path"
import JsonFabric from "../file-fabric";
import { Berry } from "../../models/Berry";
import { lvl_normalize } from "./pokeball-fabric";
import { absPath } from "../..";
import fs_promises from "fs/promises"
import { save_picture } from "../../utils/parserUtils";
import { getUrlFilename } from "../../utils/urlUtils";

async function berryJsonFabric() {
    const return_sprite_name = (name: string): string => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`
    const data_filepath = path.join(absPath(import.meta.url), "../../../pokemon-data/berry")
    const searchSubstr = 'items'
    const folderTheme = "berry"
    const publicFilePath = `./static/images/${folderTheme}/`

    type BerryJsonType = {
        id: number,
        name: string,
        growth_time: number,
        item: {
            name: string,
        }
        max_harvest: number,
        natural_gift_power: number,
        size: number,
        smoothness: number,
        soil_dryness: number,
    }

    function berryFunc(data: BerryJsonType, order: number) {
        const berry_cost = 1/data.growth_time * 1/data.soil_dryness * data.size * data.max_harvest * data.natural_gift_power
        const sprite_url: string | null = data.item.name ? return_sprite_name(data.item.name) : null
        const berry = Berry.create({
            id: data.id,
            name: data.name,
            category: data.item.name,
            image: sprite_url ? publicFilePath.concat(getUrlFilename(sprite_url, searchSubstr)) : "",
            price: berry_cost.toFixed(2),
            level: lvl_normalize(Math.round(berry_cost)),
            power: data.natural_gift_power,
            growth_time: data.growth_time,
            max_harvest: data.max_harvest,
            size: data.size,
            smoothness: data.smoothness,
            soil_dryness: data.soil_dryness,
        })
        // const berry = {
        //     id: data.id,
        //     name: data.name,
        //     category: data.item.name,
        //     image: sprite_url ? publicFilePath.concat(getUrlFilename(sprite_url, searchSubstr)) : "",
        //     price: Number(berry_cost.toFixed(2)),
        //     level: lvl_normalize(Math.round(berry_cost)),
        //     power: data.natural_gift_power,
        //     growth_time: data.growth_time,
        //     max_harvest: data.max_harvest,
        //     size: data.size,
        //     smoothness: data.smoothness,
        //     soil_dryness: data.soil_dryness,
        // }
        console.log("berry ", berry)
        console.log(`Berry #${order} has been transferred to db!`)
        return {image: return_sprite_name(data.item.name)}
    }

    const fabric = new JsonFabric(data_filepath)

    await fabric.extractData("Berries", berryFunc)
    // console.log("BERRIES LIST: ", fabric.image_list)
    // await fs_promises.writeFile(path.join(absPath(import.meta.url), "berry_images.json"), JSON.stringify(fabric.image_list), "utf-8") // optional move
    // for (const imgUrl of fabric.image_list) {
    //     if (imgUrl) {
    //         await save_picture(imgUrl, folderTheme, getUrlFilename(imgUrl, searchSubstr))
    //     }
    // }
}


export default berryJsonFabric