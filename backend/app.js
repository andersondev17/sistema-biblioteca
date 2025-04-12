// app.js
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const depthLimit = require("graphql-depth-limit");
const { PORT, NODE_ENV } = require("./config/env.js");
const { verifyToken } = require("./auth/verify-token");
const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware.js");
const { prisma } = require('./database/db');


async function startServer() {
    // Inicializar Express
    const app = express();

    // Configurar ruta de health check primero para que Railway pueda verificar
    app.get('/health', async(_, res) => {
        const status = {
            status: 'OK',
            api: 'running',
            timestamp: new Date().toISOString(),
            environment: NODE_ENV
        };
        try {
            const db = require('./database/db');
            // Realizar una consulta simple para despertar la BD
            await db.$queryRaw`SELECT 1 as ping`;
            status.database = 'connected';
        } catch (error) {
            status.database = 'disconnected';
            status.status = 'WARNING';
            console.error('Health check - Database connection error:', error.message);
        }
        
        return res.status(status.status === 'OK' ? 200 : 207).json(status);
    });
    

    // Permitir solicitudes desde el frontend
    app.use(cors({
        origin: process.env.FRONTEND_URL || "*",
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"]
    }));
    app.use(express.json());

    // Configurar Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const token = req.headers.authorization?.split(" ")[1] || "";
            const user = await verifyToken(token);
            return { user, token };
        },
        validationRules: [depthLimit(5)],
        formatError: (err) => {
            console.error("GraphQL Error:", err);
            return err;
        }
    });

    await server.start();

    // Aplicar middleware de Apollo
    server.applyMiddleware({
        app,
        path: "/graphql"
    });

    // Configurar rutas API REST
    routes.setupRoutes(app);

    // Ruta de información básica
    app.get("/", (_, res) => res.json({
        message: "API Biblioteca v1.0",
        status: "online",
        environment: NODE_ENV
    }));

    // Middleware para rutas no encontradas y errores
    app.use("*", (_, res) => res.status(404).json({
        success: false,
        message: "Ruta no encontrada"
    }));
    app.use(errorMiddleware);

    // Iniciar servidor
    const httpServer = app.listen(PORT, () => {
        console.log(`✅ API REST: http://localhost:${PORT}/api/v1 (${NODE_ENV})`);
        console.log(`🚀 GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
    });

    // Manejar errores no capturados
    process.on("unhandledRejection", (err) => {
        console.error("❌ Error no manejado:", err);
        // No cerrar el servidor en producción
        if (NODE_ENV !== 'production') {
            httpServer.close(() => process.exit(1));
        }
    });

    return { server, httpServer };
}

module.exports = { startServer };

// Iniciar solo si es el módulo principal
if (require.main === module) {
    startServer().catch(err => {
        console.error("Error de inicialización:", err);
        // No salir en producción
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    });
}