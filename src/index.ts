import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection, getConnectionOptions } from "typeorm";
import { AuthResolver } from "./resolver/Auth";
import { UserResolver } from "./resolver/User";
import { getAccessToken } from "./utils/getToken";

(async () => {
  // read connection options from ormconfig file (or ENV variables)
  const connectionOptions = await getConnectionOptions();
  Object.assign(connectionOptions, {
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
  });
  // create a connection using modified connection options
  await createConnection(connectionOptions)
    .then(() => {
      console.log("Connected to database successful.");
    })
    .catch((error) => console.log(error));

  // create server express
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.get("/", (_, res) => res.send("Hello world"));
  app.post("/refresh_token", (req, res) => {
    const { __reToken: token } = req.cookies;
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_SECRET!);
    } catch (error) {
      res.status(400).json({ error });
      return;
    }
    res.status(200).json({ accessToken: getAccessToken(payload.userId) });
  });

  // create graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        AuthResolver,
        UserResolver
      ],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Express server started on port ${port}.`);
  });
})();
