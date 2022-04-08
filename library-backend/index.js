require("dotenv").config();
const http = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      try {
        const auth = req?.headers?.authorization;
        const preamble = "bearer ";
        if (auth && auth.startsWith(preamble)) {
          const token = auth.substring(preamble.length);
          if (token) {
            const hasValidToken = jwt.verify(token, "secret256");
            return { token, hasValidToken };
          }
        }
      } catch {
        return {};
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app, path: "/" });

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server ready at PORT ${PORT}`);
  });
}

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((e) => {
    console.error(e.message);
  });

startApolloServer();
