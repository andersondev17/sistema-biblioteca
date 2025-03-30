// app.js
const express = require('express');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./config/env.js');
const { authenticate } = require('./middlewares/auth.middleware.js');
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const typeDefs = require('./graphql/schemas');
const jwt = require("jsonwebtoken");
const resolvers = require('./graphql/resolvers');
const prisma = require('./database/db');

// Importar rutas
const authRouter = require('./routes/auth.routes.js');
const userRouter = require('./routes/user.routes.js');
const authorRouter = require('./routes/author.routes.js');
const bookRouter = require('./routes/book.routes.js');
const reportRouter = require('./routes/report.routes.js');
const errorMiddleware = require('./middlewares/error.middleware.js');
const arcjetMiddleware = require('./middlewares/arcjet.middleware.js');

// Inicializar app
const app = express();

// Middlewares globales
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(arcjetMiddleware);

// Rutas públicas - para autenticación
app.use('/api/v1/auth', authRouter);

// Rutas protegidas - requieren autenticación
app.use('/api/v1/users', authenticate, userRouter);
app.use('/api/v1/authors', authenticate, authorRouter);
app.use('/api/v1/books', authenticate, bookRouter);
app.use('/api/v1/reports', authenticate, reportRouter);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API Biblioteca v1.0',
        status: 'online',
        environment: NODE_ENV
    });
});


const startApolloServer = async () => {
    try {
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            context: async ({ req }) => {
                let user = null;
                try {
                    // Verificar si hay token en el header
                    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                        const token = req.headers.authorization.split(' ')[1];
                        
                        // Verificar el token y obtener la información del usuario
                        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'biblioteca_secret_key');
                        
                        user = await prisma.usuario.findUnique({
                            where: { id: decoded.id }
                        });
                        
                    }
                } catch (error) {
                    console.error('Error de autenticación GraphQL:', error.message);
                }
                
                return { user };
            },
            formatError: (err) => {
                console.error('GraphQL Error:', err);
                return err;
            },
            validationRules: [depthLimit(5)],
            introspection: true,
            playground: {
                settings: {
                    'request.credentials': 'include',
                }
            }
        });
        
        await apolloServer.start();
        apolloServer.applyMiddleware({ app, path: '/graphql', cors: true });
        
        console.log(`🚀 Servidor GraphQL listo en http://localhost:${PORT}${apolloServer.graphqlPath}`);
        return apolloServer;
    } catch (error) {
        console.error('❌ Error al iniciar Apollo Server:', error);
        throw error;
    }
};

// Iniciar Apollo Server antes de registrar el middleware de rutas no encontradas
(async () => {
    try {
        await startApolloServer();
        
        app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        });
        
        // Error handling centralizado
        app.use(errorMiddleware);
        
        // Iniciar servidor Express
        const server = app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT} (${NODE_ENV})`);
        });
        
        // Manejo de errores no capturados
        process.on('unhandledRejection', (err) => {
            console.error('❌ Error no manejado:', err);
            server.close(() => process.exit(1));
        });
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        process.exit(1);
    }
})();

module.exports = app;