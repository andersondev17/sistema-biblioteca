// routes/auth.routes.js
const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

// Rutas públicas - no requieren autenticación
authRouter.post("/register", authController.register); 
authRouter.post("/login", authController.login);     
authRouter.post("/logout", authController.logout);  

module.exports = authRouter;