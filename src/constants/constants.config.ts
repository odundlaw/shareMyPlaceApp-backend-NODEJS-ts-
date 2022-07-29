export default {
    dbUrl: process.env.DATA_BASE_URL ?? "",
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    jwtSecret: process.env.JWTSECRET ?? "mysupersecretsecret",
    expiresIn: process.env.JWT_EXPIRESIN ?? "1hr"
}