// schemas/book.schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Autor {
    cedula: String!
    nombreCompleto: String!
    nacionalidad: String!
  }
  
  type Libro {
    isbn: String!
    editorial: String!
    genero: String!
    anoPublicacion: Int!
    autor: Autor
    createdAt: String
    updatedAt: String
  }

  input LibroOrderByInput {
    createdAt: SortOrder
  }

  enum SortOrder {
    ASC
    DESC
  }

  type Query {  ##consulta de libros por orden de creacion 
    libros(
      orderBy: LibroOrderByInput
      take: Int
      include: LibroIncludeInput
    ): [Libro!]!
    libro(isbn: String!): Libro ##consulta de un libro por ISBN
  }

  input LibroIncludeInput {
    autor: Boolean
  }

  type Mutation {
    crearLibro(
      isbn: String!
      editorial: String!
      genero: String!
      anoPublicacion: Int!
      autorCedula: String!
    ): Libro!
  }
`;

module.exports = typeDefs;