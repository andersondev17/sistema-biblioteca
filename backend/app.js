// app.js
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const jwt = require("jsonwebtoken");
const { PORT, NODE_ENV } = require('./config/env.js');
const { authenticate } = require('./middlewares/auth.middleware.js');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const prisma = require('./database/db');
const errorMiddleware = require('./middlewares/error.middleware.js');
const arcjetMiddleware = require('./middlewares/arcjet.middleware.js');

// Configuración inicial
const app = express();
const CORS_CONFIG = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
};

// Helpers
const getAuthenticatedUser = async (authHeader) => {
    // Verificar si hay token en el header

    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token y obtener la información del usuario

        return await prisma.usuario.findFirst({ where: { id: decoded.id } });
    } catch (error) {
        console.error('Authentication error:', error.message);
        return null;
    }
};

// Configuración Apollo Server
const createApolloServer = () => new ApolloServer({ //Instancia de Apollo Server
    typeDefs,
    resolvers,
    // Contexto para resolver las peticiones con el usuario autenticado
    context: async ({ req }) => ({ user: await getAuthenticatedUser(req.headers.authorization) }),
    validationRules: [depthLimit(5)],
    formatError: (err) => {
        console.error('GraphQL Error:', err);
        return err;
    },
    introspection: true,
    playground: { settings: { 'request.credentials': 'include' } }
});

// Middlewares base
app.use(cors(CORS_CONFIG));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(arcjetMiddleware);

// Rutas
const API_PREFIX = '/api/v1';
const routes = [
    { path: '/auth', handler: require('./routes/auth.routes.js') },
    { path: '/users', handler: require('./routes/user.routes.js'), protected: true },
    { path: '/authors', handler: require('./routes/author.routes.js'), protected: true },
    { path: '/books', handler: require('./routes/book.routes.js'), protected: true },
    { path: '/reports', handler: require('./routes/report.routes.js'), protected: true },
];

routes.forEach(({ path, handler, protected }) => {
    const middleware = protected ? [authenticate] : [];
    app.use(`${API_PREFIX}${path}`, ...middleware, handler);
});

// Health Check
app.get('/', (req, res) => res.json({
    message: 'API Biblioteca v1.0',
    status: 'online',
    environment: NODE_ENV
}));

// Inicialización Servidores
const initializeServers = async () => {
    try {
        const apolloServer = createApolloServer();
        await apolloServer.start();
        apolloServer.applyMiddleware({ app, path: '/graphql', cors: CORS_CONFIG });

        app.use('*', (req, res) => res.status(404).json({
            success: false,
            message: 'Ruta no encontrada'
        }));

        app.use(errorMiddleware);

        const expressServer = app.listen(PORT, () => {
            console.log(`✅ Servidor REST - LISTO:   http://localhost:${PORT}${API_PREFIX} (${NODE_ENV})`);
            console.log(`🚀 Servidor GraphQL - LISTO: http://localhost:${PORT}${apolloServer.graphqlPath}`);
        });

        process.on('unhandledRejection', (err) => {
            console.error('❌ Error no manejado:', err);
            expressServer.close(() => process.exit(1));
        });

        return { apolloServer, expressServer };
    } catch (error) {
        console.error('Error de inicialización:', error);
        process.exit(1);
    }
};

// Iniciar aplicación
initializeServers();

module.exports = app;