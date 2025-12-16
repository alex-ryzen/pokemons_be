import fs from "fs"
import path from "path"
import JsonFabric from "../file-fabric";
import { absPath } from "../..";
import { getUrlFilename } from "../../utils/urlUtils";
import fs_promises from 'fs/promises'
import { save_picture } from "../../utils/parserUtils";
import { Pokemon } from "../../models/Pokemon";

// work: dirname(fileURLToPath(import.meta.url))    |   doesnt work: __dirname -> path.resolve())
async function pokemonJsonFabric () {
    const data_filepath = path.join(absPath(import.meta.url), "../../../pokemon-data/pokemon")
    const folderTheme = "pokemon"
    const publicFilePath = `./static/images/${folderTheme}/`

    type PokemonJsonType = {
        id: number,
        species: {
            name: string;
        },
        sprites: {
            front_default: string;
        },
        weight: number,
        height: number, // def_income
        base_experience: number,
    }

    function pokemonFunc(data: PokemonJsonType, order: number) {
        const pokemon = Pokemon.create({
            id: data.id,
            species: data.species.name,
            image: data.sprites.front_default ? publicFilePath.concat(getUrlFilename(data.sprites.front_default, folderTheme)) : "",
            def_weight: data.weight.toFixed(2),
            def_income: (data.base_experience / data.height).toFixed(2),
            base_experience: data.base_experience
        })
        // const pokemon = {
        //     id: data.id,
        //     species: data.species.name,
        //     image: data.sprites.front_default ? publicFilePath.concat(getUrlFilename(data.sprites.front_default, folderTheme)) : "",
        //     def_weight: data.weight,
        //     def_income: Number((data.base_experience / data.height).toFixed(2)),
        //     base_experience: data.base_experience
        // }
        console.log(`Pokemon-data: ${JSON.stringify(pokemon)}`)
        console.log(`Pokemon #${order} has been transferred to db!`)
        return {image: data.sprites.front_default}
    }

    const fabric = new JsonFabric(data_filepath)

    await fabric.extractData("Pokemons", pokemonFunc)
    // console.log("POKEMONS LIST: ", fabric.image_list)
    // await fs_promises.writeFile(path.join(absPath(import.meta.url), "pokemon_images.json"), JSON.stringify(fabric.image_list), "utf-8") // optional move
    // for (const imgUrl of fabric.image_list) {
    //     if (imgUrl) {
    //         await save_picture(imgUrl, folderTheme, getUrlFilename(imgUrl, folderTheme))
    //     }
    // }

}

export default pokemonJsonFabric