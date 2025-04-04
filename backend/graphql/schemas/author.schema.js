const { gql } = require('apollo-server-express');//importamos gql para crear el esquema de GraphQL usando Apollo Serve

const typeDefs = gql`
  type Autor {## Definimos el tipo Autor
    cedula: String!
    nombreCompleto: String!
    nacionalidad: String!
    libros: [Libro!]!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {## Definimos la consulta para obtener autores
    autores: [Autor!]!
    autor(cedula: String!): Autor
  }
`;

module.exports = typeDefs;