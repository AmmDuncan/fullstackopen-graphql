import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { LOGIN } from "../queries";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN);

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ variables: { username, password } }).then((res) => {
      const token = res.data.login.value;
      setToken(token);
      localStorage.setItem("library-token", token);

      setUsername("");
      setPassword("");
    });
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
