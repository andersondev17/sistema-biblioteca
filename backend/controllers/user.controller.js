const prisma = require("../database/db");

exports.createUser = async (req, res) => {
    try {
        const { userName, password, tipo } = req.body;
        const user = await prisma.usuario.create({
            data: { userName, password, tipo }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await prisma.usuario.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await prisma.usuario.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

exports.getAllUsersGraphQL = async () => {
    return await prisma.usuario.findMany();
};

exports.getUserByIdGraphQL = async (id) => {
    return await prisma.usuario.findUnique({
        where: { id: parseInt(id) }
    });
};