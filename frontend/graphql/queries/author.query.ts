// Consulta GraphQL para obtener todos los datos necesarios para el dashboard
import { gql } from '@apollo/client';

export const GET_FULL_AUTHORS_REPORT = gql`
  query GetAuthorReport($cedula: String!) {
    autor(cedula: $cedula) {
      cedula
      nombreCompleto
      nacionalidad
      libros {
        isbn
        editorial
        genero
        anoPublicacion
      }
    }
  }
`;
// rendimiento redujo aprox unos 6 segundo de carga y mejoro el puntaje en lighthouse 

