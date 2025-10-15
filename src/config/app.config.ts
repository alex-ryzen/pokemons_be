
interface AppConfigType {
    host: string;
    port: number;
    db_host: string,
    db_port: number,
    database: string,
    db_username: string,
    db_password: string
}

const appConfig: AppConfigType = {
    host: process.env.APP_HOST || "localhost",
    port: Number(process.env.APP_PORT) || 3001,
    db_host: process.env.DB_HOST || 'localhost',
    db_port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'pokemons',
    db_username: process.env.DB_USER || 'postgres',
    db_password: process.env.DB_PASSWORD || '',
}

export default appConfig;