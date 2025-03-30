// graphql/queries/author.query.ts - Query Actualizada
import { gql } from '@apollo/client';

// graphql/queries/author.query.ts
export const GET_FULL_AUTHORS_REPORT = gql`
  query GetFullAuthorsReport {
    autores {
      cedula
      nombreCompleto
      nacionalidad
      libros {
        isbn
        editorial
        anoPublicacion
      }
    }
  }
`;