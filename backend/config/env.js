// config/env.js
const dotenv = require("dotenv");

dotenv.config();

// Exportar variables con valores por defecto
module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || "biblioteca_secret_default",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
    
};