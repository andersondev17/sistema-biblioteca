// En un archivo base.schema.js
const { gql } = require('apollo-server-express');

const baseTypeDefs = gql`
  type Query {
    librosCount: Int!
    usuariosCount: Int!
    autoresCount: Int!
  }
`;

module.exports = baseTypeDefs;