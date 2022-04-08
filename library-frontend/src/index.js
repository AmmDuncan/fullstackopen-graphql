import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  HttpLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "@apollo/client/utilities";
// import { SubscriptionClient } from "subscriptions-transport-ws";

const authLink = setContext((_, { headers }) => {
  const storedToken = localStorage.getItem("library-token");
  return {
    headers: {
      ...headers,
      Authorization: `bearer ${storedToken || ""}`,
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
