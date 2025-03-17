// controllers/book.controller.js
const prisma = require("../database/db");

exports.createBook = async (req, res) => {
    try {
        const { isbn, editorial, genero, anoPublicacion, autorCedula } = req.body;
        const libro = await prisma.libro.create({
            data: { isbn, editorial, genero, anoPublicacion, autorCedula }
        });
        res.status(201).json(libro);
    } catch (error) {
        res.status(400).json({ error: "Error al crear libro" });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const libros = await prisma.libro.findMany();
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener libros" });
    }
};

exports.getBookByISBN = async (req, res) => {
    try {
        const libro = await prisma.libro.findUnique({
            where: { isbn: req.params.isbn }
        });
        if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener libro" });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await prisma.libro.update({
            where: { isbn: req.params.isbn },
            data: req.body
        });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar libro" });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await prisma.libro.delete({
            where: { isbn: req.params.isbn }
        });
        res.json({ message: "Libro eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar libro" });
    }
};