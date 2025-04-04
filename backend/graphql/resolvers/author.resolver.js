// graphql/resolvers/author.resolver.js
const jwt = require('jsonwebtoken')

const resolvers = {//la función autores verifica si hay un usuario en el contexto. Si no lo hay, lanza un error de autenticación 

    Query: {
        autores: (_, __, context) => {
            const user = jwt.verify(context.token, process.env.JWT_SECRET)//si el token es valido obtenemos los datos del autor
            if (!user) throw new AuthenticationError('No autenticado')
            return authorController.getAllAuthorsGraphQL()
        }
    }
}

module.exports = resolvers