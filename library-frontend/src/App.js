import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";
import { useApolloClient, useSubscription } from "@apollo/client";

import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const storedToken = localStorage.getItem("library-token") || "";
const App = () => {
  const [page, setPage] = useState("authors");
  const [genre, setGenre] = useState("");
  const [token, setToken] = useState(storedToken);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData, client }) => {
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre } },
        (data) => {
          return {
            allBooks: (data?.allBooks || []).concat(
              subscriptionData.data.bookAdded
            ),
          };
        }
      );
      window.alert("received update");
    },
  });

  useEffect(() => {
    setToken(storedToken);
  }, []);

  const logout = () => {
    setToken(null);
    client.resetStore();
    setTimeout(() => {
      localStorage.clear();
    }, 500);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommended")}>recommended</button>
        {token ? <button onClick={logout}>Logout</button> : null}
      </div>

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Authors show={page === "authors"} />
          <Books show={page === "books"} updateGenre={setGenre} />
          <NewBook show={page === "add"} genre={genre} />
          <Recommended show={page === "recommended"} />
        </>
      )}
    </div>
  );
};

export default App;
