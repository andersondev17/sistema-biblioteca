const { mergeTypeDefs } = require('@graphql-tools/merge');
const baseTypeDefs = require('./base.schema');
const bookSchema = require('./book.schema');
const authorSchema = require('./author.schema');
const userSchema = require('./user.schema');

const typeDefs = mergeTypeDefs([baseTypeDefs, bookSchema, authorSchema, userSchema]);

module.exports = typeDefs;