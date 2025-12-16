import berryJsonFabric from "./from_json_files/berry-fabric";
import pokeballJsonFabric from "./from_json_files/pokeball-fabric";
import pokemonJsonFabric from "./from_json_files/pokemon-fabric";

export async function runFabrics() {
    await pokemonJsonFabric()
    await pokeballJsonFabric()
    await berryJsonFabric()
}