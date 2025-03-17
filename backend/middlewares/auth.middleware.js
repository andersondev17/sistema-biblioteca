const jwt = require("jsonwebtoken");
const prisma = require("../database/db");

const authenticate = async (req, res, next) => {
    try {
        let token;

        // Obtener token del header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) return res.status(401).json({ message: "Acceso denegado" });

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario en BD
        const user = await prisma.usuario.findUnique({
            where: { id: decoded.id }
        });

        if (!user) return res.status(401).json({ message: "Usuario no existe" });

        req.user = user; // Adjuntar usuario a la solicitud
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido", error: error.message });
    }
};

const checkAdmin = (req, res, next) => {
    if (req.user.tipo !== "ADMINISTRADOR") {
        return res.status(403).send("Acceso restringido a empleados");
    }
    next();
};

const checkEmployee = (req, res, next) => {
    if (req.user.tipo !== "EMPLEADO") { 
        return res.status(403).send("Acceso restringido a administradores");
    }
    next();
};

module.exports = { authenticate, checkAdmin, checkEmployee };