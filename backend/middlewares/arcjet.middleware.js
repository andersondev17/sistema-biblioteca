// middlewares/arcjet.middleware.js
const { getArcjetInstance } = require('../config/arcjet');

// Contador global para ver cuántas solicitudes se procesan
let requestCounter = 0;

const arcjetMiddleware = async (req, res, next) => {
  requestCounter++;  
  try {
    const aj = await getArcjetInstance();
    
    let decision;
    try {
      //  1 token por solicitud
      decision = await aj.protect(req, { requested: 1 });
      console.log(`✅ Arcjet decision:`, decision);
    } catch (e) {
      console.error(`❌ Error en protect:`, e);
      try {
        decision = await aj.project(req);
      } catch (innerError) {
        console.error('❌ Error en project:', innerError);
        return next();
      }
    }

    if (decision && typeof decision.isDenied === 'function' && decision.isDenied()) {
      console.log(`⛔ Solicitud bloqueada por Arcjet`);
      
      if (decision.reason && typeof decision.reason.isRateLimit === 'function' && decision.reason.isRateLimit()) {
        console.log(`⏱️ Razón: Rate Limit Exceeded`);
        return res.status(429).json({ 
          message: 'Rate Limit Exceeded',
          retryAfter: '30 seconds'
        });
      }
      
      if (decision.reason && typeof decision.reason.isBot === 'function' && decision.reason.isBot()) {
        console.log(`🤖 Razón: Bot detected`);
        return res.status(403).json({ message: 'Bot detected' });
      }
      
      console.log(`🚫 Razón: Access denied (general)`);
      return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    next();
  }
};

module.exports = arcjetMiddleware;