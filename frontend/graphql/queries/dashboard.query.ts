// graphql/queries/dashboard.query.ts
import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    totalBooks: librosCount
    totalUsers: usuariosCount
    totalAuthors: autoresCount
    recentBooks: libros(take: 5) {
      isbn
      editorial
      genero
      autor {
        nombreCompleto
      }
    }
  }
`;