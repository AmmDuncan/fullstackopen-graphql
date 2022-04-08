import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_BOOKS, GET_USER } from "../queries";

const Books = (props) => {
  const [user, setUser] = useState(null);
  const [getUser] = useLazyQuery(GET_USER);

  const [fetchBooks, result] = useLazyQuery(ALL_BOOKS, {
    variables: { genre: user?.favoriteGenre },
  });

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (localStorage.getItem("library-token") || "") {
      getUser().then((res) => {
        setUser(res.data.me);
      });
    }
  }, []); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  const books = result.data?.allBooks || [];

  return (
    <div>
      <h2>recommended books</h2>

      <p>
        books in your favorite genre <strong>{props.me?.favoriteGenre}</strong>
      </p>

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
