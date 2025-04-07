// services/graphql.service.ts - verificado
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AuthService from './auth.service';

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {//configura el token de autenticacion con el header
    const token = AuthService.getToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

export const graphqlClient = new ApolloClient({//crea una instancia del cliente de apollo
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all'
        }
    }
});

export function createClient() {
    return new ApolloClient({//returna una nueva instancia del cliente de apollo
        link: authLink.concat(httpLink),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        libros: {
                            merge(existing = [], incoming: any[]) {
                                return [...existing, ...incoming];
                            }
                        }
                    }
                }
            }
        }),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'all'
            },
            query: {
                fetchPolicy: 'network-only',
                errorPolicy: 'all'
            }
        }
    });
}
export default graphqlClient;