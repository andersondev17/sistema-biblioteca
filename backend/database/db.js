const { PrismaClient } = require("@prisma/client");
const { NODE_ENV } = require("../config/env");

class Database {
    constructor() {
        if (!Database.instance) {
            try {
                Database.instance = new PrismaClient();
                console.log(`✅ Conectado a la base de datos en modo ${NODE_ENV}.`);
            } catch (error) {
                console.error("❌ Error al conectar con la base de datos:", error);
                process.exit(1);
            }
        }
    }

    getInstance() {
        return Database.instance;
    }
}

module.exports = new Database().getInstance();
