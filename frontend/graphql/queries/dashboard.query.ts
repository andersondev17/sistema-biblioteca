// Consulta GraphQL para obtener todos los datos necesarios para el dashboard
import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  # Obtenemos solo los campos necesarios combinados en una sola consulta reduciendo solicitudes
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
// rendimiento redujo aprox unos 6 segundo de carga y mejoro el puntaje en lighthouse 
