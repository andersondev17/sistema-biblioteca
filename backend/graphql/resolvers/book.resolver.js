// resolvers/book.resolver.js
const { AuthenticationError } = require('apollo-server-express');
const bookController = require('../../controllers/book.controller');

const resolvers = {
  Query: {
    libros: (_, args, context) => {
      if (!context.user) throw new AuthenticationError('No autenticado');
      return bookController.getAllBooksGraphQL(args);
  },
    libro: (_, { isbn }) => bookController.getBookByISBNGraphQL(isbn)
  },
  Mutation: {
    crearLibro: (_, args, context) => {
      if (context.user.tipo !== 'ADMINISTRADOR') {
        throw new AuthenticationError('No tienes permisos');
      }
      return bookController.createBookGraphQL(args);
    }
  }
};

module.exports = resolvers;