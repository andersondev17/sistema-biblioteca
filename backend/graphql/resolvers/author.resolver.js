// graphql/resolvers/author.resolver.js
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
        autores: (_, __, context) => {
            const user = jwt.verify(context.token, process.env.JWT_SECRET)
            if (!user) throw new AuthenticationError('No autenticado')
            return authorController.getAllAuthorsGraphQL()
        }
    }
}

module.exports = resolvers