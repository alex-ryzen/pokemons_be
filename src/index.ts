// index.ts - entry point with .env load and app initialization
import dotenv from "dotenv"
dotenv.config();

// app init
import App from "./app";
const app = new App;
app.run();