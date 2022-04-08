import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query GetAllAuthots {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;
export const ALL_BOOKS = gql`
  query GetAllBooksByNameOrGenre($name: String, $genre: String) {
    allBooks(name: $name, genre: $genre) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      genres: $genres
      author: $author
    ) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation UpdateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const GET_USER = gql`
  query LoggedInUser {
    me {
      username
      favoriteGenre
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription BookAdded {
    bookAdded {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;
