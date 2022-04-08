import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const { loading, data } = useQuery(ALL_AUTHORS);
  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ALL_AUTHORS],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    updateAuthor({
      variables: { name, setBornTo: Number(born) },
    }).then(() => {
      setName("");
      setBorn("");
    });
  };

  if (loading) return <p>Loading...</p>;

  if (!props.show) {
    return null;
  }
  const authors = data?.allAuthors || [];

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select name...</option>
            {authors.map((a) => (
              <option value={a.name} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            type="number"
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
