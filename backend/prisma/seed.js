const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Crear usuarios
    await prisma.usuario.createMany({
        data: [
            { userName: 'admin', password: 'admin123', tipo: 'ADMINISTRADOR' },
            { userName: 'empleado', password: 'empleado123', tipo: 'EMPLEADO' },
        ],
        skipDuplicates: true,
    });

    // Crear autores
    await prisma.autor.createMany({
        data: [
            { cedula: '10023455664', nombreCompleto: 'Gabriel García Márquez', nacionalidad: 'Colombiano' },
            { cedula: '10023455665', nombreCompleto: 'Antonio García Marquez', nacionalidad: 'Colombiano' },
        ],
        skipDuplicates: true,
    });

    // Crear libros
    await prisma.libro.createMany({
        data: [
            { isbn: '1', editorial: 'The Midnight Library', genero: 'Ficción', anoPublicacion: 2020, autorCedula: '10023455664' },
            { isbn: '2', editorial: 'Atomic Habits', genero: 'Autoayuda', anoPublicacion: 2018, autorCedula: '10023455665' },
        ],
        skipDuplicates: true,
    });

    console.log('Base de datos poblada correctamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });