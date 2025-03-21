// app.js
const express = require('express');
const cors = require('cors'); //  pruebas en frontend
const { PORT, NODE_ENV } = require('./config/env.js');
const { authenticate } = require('./middlewares/auth.middleware.js');

// Importar rutas
const authRouter = require('./routes/auth.routes.js');
const userRouter = require('./routes/user.routes.js');
const authorRouter = require('./routes/author.routes.js');
const bookRouter = require('./routes/book.routes.js');
const reportRouter = require('./routes/report.routes.js');
const errorMiddleware = require('./middlewares/error.middleware.js');
const arcjetMiddleware = require('./middlewares/arcjet.middleware.js')

// Inicializar app
const app = express();

// Middlewares globales
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
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

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Ruta no encontrada' 
    });
});

// Error handling centralizado
app.use(errorMiddleware);

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT} (${NODE_ENV})`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Error no manejado:', err);
    server.close(() => process.exit(1));
});

module.exports = app;