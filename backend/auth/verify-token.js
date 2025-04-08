// auth/verify-token.js
const jwt = require("jsonwebtoken");
const prisma = require("../database/db");

exports.verifyToken = async (token) => {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await prisma.usuario.findFirst({ where: { id: decoded.id } });
    } catch (error) {
        console.error("Token verification error:", error.message);
        return null;
    }
};