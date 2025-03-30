const prisma = require('../database/db');

exports.createAuthor = async (req, res) => {
    try {
        const author = await prisma.autor.create({ data: req.body });
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ error: "Error al crear autor" });
    }
};

exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await prisma.autor.findMany();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener autores" });
    }
};

exports.getAuthorByCedula = async (req, res) => {
    try {
        const author = await prisma.autor.findUnique({
            where: { cedula: req.params.cedula }
        });
        if (!author) return res.status(404).json({ error: "Autor no encontrado" });
        res.json(author);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener autor" });
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        const updatedAuthor = await prisma.autor.update({
            where: { cedula: req.params.cedula },
            data: req.body
        });
        res.json(updatedAuthor);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar autor" });
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        await prisma.autor.delete({
            where: { cedula: req.params.cedula }
        });
        res.json({ message: "Autor eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar autor" });
    }
};

exports.getAllAuthorsGraphQL = async () => {
    return await prisma.autor.findMany({ include: { libros: true } });
};
exports.getAuthorByCedulaGraphQL = async (cedula) => {
    return await prisma.autor.findUnique({
        where: { cedula },
        include: { libros: true }
    });
};

exports.getAllAuthorsGraphQL = async () => {
    return await prisma.autor.findMany({ include: { libros: true } });
};

exports.getAuthorByCedulaGraphQL = async (cedula) => {
    return await prisma.autor.findUnique({
        where: { cedula },
        include: { libros: true }
    });
};