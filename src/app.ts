import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import appConfig from "./config/app.config";
//import userRoutes from "./routes/user.routes";
import { db_connect } from "./db";
import "./db"
import path from "path";
import { absPath } from ".";
import { runFabrics } from "./fabrics";
import shopRoutes from "./routes/shop.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import inventoryRoutes from "./routes/inventory.routes";
import gardenRoutes from "./routes/garden.routes";
import pokemonRoutes from "./routes/pokemon.routes";

class App {
    
    private app: Express;
    
    constructor() {
        this.app = express()
        this.initMiddlewares();
        this.initRoutes();
        this.initStaticFiles();
        this.app.use(errorMiddleware)
    }

    private initMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: [
                'http://localhost:5173', // frontend url
                '' // production url (optional)
            ],
            credentials: true
        }))
    }

    private initRoutes() {
        this.app.use("/api/auth", authRoutes);
        this.app.use("/api/user", userRoutes);
        this.app.use("/api/shop", shopRoutes);
        this.app.use("/api/inventory", inventoryRoutes);
        this.app.use("/api/garden", gardenRoutes);
        this.app.use("/api/pokemon", pokemonRoutes)
    }

    private initStaticFiles() {
        this.app.use('/static', express.static(path.join(absPath(import.meta.url), '../public')))
    }

    public async run() {
        const { port, host } = appConfig;
        await db_connect();
        // await runFabrics();  // ====== NOTICE: ALL DATA HAS ALREADY BEEN STORED IN DB
        this.app.listen(port, host, () => {
            console.log(`[mega W] Server is running on http://${host}:${port}`);
        })
    }
}

export default App;