import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import appConfig from "./config/app.config";
import userRoutes from "./routes/user.routes";

class App {
    
    private app: Express;
    
    constructor() {
        this.app = express()
        this.initMiddlewares();
        this.initRoutes();
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
    }   

    public run() {
        const { port, host } = appConfig;
        this.app.listen(port, host, () => {
            console.log(`server is running on http://${host}:${port}`);

        })
    }
}

export default App;