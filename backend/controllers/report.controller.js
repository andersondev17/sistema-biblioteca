const prisma = require("../database/db");

exports.getAuthorReport = async (req, res) => {
    try {
        const { cedula } = req.params;

        // Obtener autor y sus libros
        const autorConLibros = await prisma.autor.findUnique({
            where: { cedula },
            include: { libros: true } //relación con libros
        });

        if (!autorConLibros) {
            return res.status(404).json({ error: "Autor no encontrado" });
        }

        // Formateando respuesta
        const reporte = {
            nombreCompleto: autorConLibros.nombreCompleto,
            nacionalidad: autorConLibros.nacionalidad,
            libros: autorConLibros.libros.map(libro => ({
                isbn: libro.isbn,
                editorial: libro.editorial,
                genero: libro.genero,
                añoPublicacion: libro.anoPublicacion
            }))
        };

        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: "Error al generar el reporte" });
    }
};