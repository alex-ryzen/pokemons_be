import ms from "ms"

interface AuthConfigType {
    access_secret: string | undefined;
    access_expires_in: number | ms.StringValue | undefined;
    refresh_secret: string | undefined; 
    refresh_expires_in: number | ms.StringValue | undefined;
}

const authConfig: AuthConfigType = {
    access_secret: process.env.ACCESS_SECRET,
    access_expires_in: process.env.ACCESS_EXPIRES_IN as ms.StringValue,
    refresh_secret: process.env.REFRESH_SECRET,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN as ms.StringValue,
}

export default authConfig;