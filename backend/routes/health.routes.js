// routes/health.routes.js
const { Router } = require('express');
const db = require('../database/db');

const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
    const status = {
        status: 'OK',
        api: 'running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    };
    
    try {
        // Despertar la base de datos con una consulta simple
        await db.$queryRaw`SELECT 1 as ping`;
        status.database = 'connected';
    } catch (error) {
        status.database = 'disconnected';
        status.error = error.message;
        status.status = 'WARNING';
        console.error('Health check - Error de conexión:', error);
    }
    
    return res.status(status.status === 'OK' ? 200 : 207).json(status);
});

module.exports = healthRouter;