import { graphqlHTTP } from "express-graphql";
import { schema } from "../graphql/schema.js";
import { resolvers } from "../graphql/resolvers.js";

export const graphqlMiddleware = graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
});
