const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Autor {
    cedula: String!
    nombreCompleto: String!
    nacionalidad: String!
    libros: [Libro!]!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    autores: [Autor!]!
    autor(cedula: String!): Autor
  }
`;

module.exports = typeDefs;