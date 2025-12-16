// index.ts - entry point with .env load and app initialization
import { dirname } from "path";
import { fileURLToPath } from "url";
//import dotenv from "dotenv"
import 'dotenv/config'
//dotenv.config();

/**
 * metaUrl: gets import.meta.url
 */
export function absPath(metaUrl: string): string {
    return dirname(fileURLToPath(metaUrl))
}

// app init

import App from "./app";
const app = new App;
app.run();

