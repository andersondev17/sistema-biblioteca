const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Usuario { ## Definimos el tipo Usuario
    id: ID!
    userName: String!
    tipo: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {## consulta para obtener usuarios
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
  }
`;

module.exports = typeDefs;