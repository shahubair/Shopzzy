import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Product {
    id: ID!
    title: String
    price: Float
    category: String
    image: String
  }

  type Query {
    searchProducts(keyword: String!): [Product]
  }
`);
