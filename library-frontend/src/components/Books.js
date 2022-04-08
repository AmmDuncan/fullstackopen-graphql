import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const [genreList, setGenres] = useState([]);
  const [fetchBooks, result] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    fetchBooks({ variables: { genre } });
    props.updateGenre(genre);
  }, [genre]); // eslint-disable-line

  useEffect(() => {
    if (result.data?.allBooks && !genre) {
      let genres = [];
      result.data.allBooks.forEach((book) => {
        genres = [...genres, ...book.genres];
      });
      genres = Array.from(new Set(genres));
      setGenres(genres);
    }
  }, [result.data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  const books = result.data?.allBooks || [];

  return (
    <div>
      <h2>books</h2>

      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">All Genres</option>
        {genreList.map((genre) => (
          <option key={genre}>{genre}</option>
        ))}
      </select>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
