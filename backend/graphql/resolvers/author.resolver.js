// graphql/resolvers/author.resolver.js
const jwt = require('jsonwebtoken')
const authorController = require('../../controllers/author.controller')
const { AuthenticationError } = require('apollo-server-express');


const resolvers = {//la función autores verifica si hay un usuario en el contexto. Si no lo hay, lanza un error de autenticación 

    Query: {
        autores: (_, __, context) => {
            const user = jwt.verify(context.token, process.env.JWT_SECRET);
            if (!user) throw new AuthenticationError('No autenticado');
            return authorController.getAllAuthorsGraphQL();
        },
        autoresConLibros: (_, __, context) => {
            const user = jwt.verify(context.token, process.env.JWT_SECRET);
            if (!user) throw new AuthenticationError('No autenticado');
            return authorController.getAllAuthorsGraphQL();
        },
        autor: (_, { cedula }, context) => {
            const user = jwt.verify(context.token, process.env.JWT_SECRET);
            if (!user) throw new AuthenticationError('No autenticado');
            return authorController.getAuthorByCedulaGraphQL(cedula);
        }
    }
}

module.exports = resolvers