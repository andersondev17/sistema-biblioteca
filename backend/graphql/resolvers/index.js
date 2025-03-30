const { mergeResolvers } = require('@graphql-tools/merge');
const bookResolvers = require('./book.resolver');
const authorResolvers = require('./author.resolver');
const userResolvers = require('./user.resolver');
const prisma = require('../../database/db');
// En tus resolvers
const dashboardResolvers = {
    Query: {
        librosCount: async () => await prisma.libro.count(),
        usuariosCount: async () => await prisma.usuario.count(),
        autoresCount: async () => await prisma.autor.count(),
        libros: async () => await prisma.libro.findMany({ 
            take: 10,
            include: { autor: true }
        })
    }
};
const resolvers = mergeResolvers([bookResolvers, authorResolvers, userResolvers, dashboardResolvers]);

module.exports = resolvers;