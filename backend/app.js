// server.js (reemplazando app.js)
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
const { prisma } = require('./prisma/client'); // Añadir al inicio


async function startServer() {
    // Inicializar Express
    const app = express();

    // Permitir solicitudes desde el frontend
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3001",
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

    // Ruta de healthcheck
    app.get("/", (_, res) => res.json({
        message: "API Biblioteca v1.0",
        status: "online",
        environment: NODE_ENV
    }));

    app.get('/health', async (req, res) => {
        try {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: NODE_ENV
            });
        } catch (error) {
            console.error('❌ Health Check Error:', error);
            res.status(200).json({
                status: 'STARTING',
                message: 'Service is starting up'
            });
        }
    });
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
        httpServer.close(() => process.exit(1));
    });

    return { server, httpServer };
}

// Exportar para testing o uso independiente
module.exports = { startServer };

// Iniciar solo si es el módulo principal
if (require.main === module) {
    startServer().catch(err => {
        console.error("Error de inicialización:", err);
        process.exit(1);
    });
}