// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const prisma = require("../database/db");

// Configuración por defecto de JWT si no existen variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || "biblioteca_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Login mejorado con manejo de errores específicos
exports.login = async (req, res) => {
    try {
        // Acepta tanto email como userName para mayor flexibilidad
        const { email, userName, password } = req.body;
        const loginField = email || userName;

        if (!loginField || !password) {
            return res.status(400).json({
                success: false,
                message: "Usuario/email y contraseña son requeridos"
            });
        }

        const user = await prisma.usuario.findFirst({
            where: {
                userName: loginField
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Contraseña incorrecta"
            });
        }

        // Generar token con expiración
        const token = jwt.sign(
            { id: user.id, tipo: user.tipo },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Excluir contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error de login:', error);
        res.status(500).json({
            success: false,
            error: "Error en el servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Registrar un nuevo usuario (solo para primer usuario/admin)
exports.register = async (req, res) => {
    try {
        const { userName, password, tipo = "EMPLEADO" } = req.body;

        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: "Usuario y contraseña son requeridos"
            });
        }

        // Verificar si ya existe el usuario
        const existingUser = await prisma.usuario.findUnique({
            where: { userName }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "El nombre de usuario ya está en uso"
            });
        }

        // Primer usuario del sistema será ADMINISTRADOR por defecto
        const usersCount = await prisma.usuario.count();
        const userRole = usersCount === 0 ? "ADMINISTRADOR" : tipo;

        const newUser = await prisma.usuario.create({
            data: {
                userName,
                password,
                tipo: userRole
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error de registro:', error);
        res.status(500).json({
            success: false,
            error: "Error en el servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Logout es simple ya que JWT se maneja del lado del cliente
exports.logout = (req, res) => {
    res.json({ success: true, message: "Sesión cerrada exitosamente" });
};