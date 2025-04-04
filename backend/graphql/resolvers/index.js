//  Se utiliza el cliente de Prisma para interactuar con la base de datos y realizar las consultas.

const { mergeResolvers } = require('@graphql-tools/merge'); //para combinar los resolvers y crear un conjunto de ellos
const bookResolvers = require('./book.resolver');
const authorResolvers = require('./author.resolver');
const userResolvers = require('./user.resolver');
const prisma = require('../../database/db');


const dashboardResolvers = {
    Query: {
        //consultas para obtener la cantidad de libros, usuarios y autores.
        librosCount: async () => await prisma.libro.count(),
        usuariosCount: async () => await prisma.usuario.count(),
        autoresCount: async () => await prisma.autor.count(),
        libros: async () => await prisma.libro.findMany({ //obtiene los primeros 10 libros junto con sus autores
            take: 10,
            include: { autor: true }
        })
    }
};

//  Objeto que contiene todos los resolvers combinados,
const resolvers = mergeResolvers([bookResolvers, authorResolvers, userResolvers, dashboardResolvers]);

module.exports = resolvers;