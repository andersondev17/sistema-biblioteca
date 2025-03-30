const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Usuario {
    id: ID!
    userName: String!
    tipo: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
  }
`;

module.exports = typeDefs;