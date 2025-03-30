// graphql/resolvers/user.resolver.js
const { AuthenticationError } = require('apollo-server-express');
const userController = require('../../controllers/user.controller');

const resolvers = {
    Query: {
        usuarios: (_, __, context) => {
            if (context.user.tipo !== 'ADMINISTRADOR') {
                throw new AuthenticationError('Acceso restringido');
            }
            return userController.getAllUsersGraphQL();
        },
        usuario: (_, { id }, context) => {
            if (!context.user) throw new AuthenticationError('No autenticado');
            return userController.getUserByIdGraphQL(id);
        }
    }
};

module.exports = resolvers;