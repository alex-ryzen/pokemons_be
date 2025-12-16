import path from "path";
import fs from "fs"
import stream from "stream/promises"
import axios from "axios";
import { absPath } from "..";

export async function save_picture ( url: string, filefolder: string, filename: string ) {
    const { data } = await axios.get(
        url, { responseType: 'stream' },
    );
    const staticPath = `../../public/images/${filefolder}/${filename}`
    const writeStream = fs.createWriteStream(
        path.join(absPath(import.meta.url), staticPath)
    );
    await stream.pipeline(data, writeStream).catch(console.error);
    console.log(`Picture "${filename}" was saved and shared with path: ${staticPath}`)
}