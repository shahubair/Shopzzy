import Product from "../models/product.js";

export const resolvers = {
  searchProducts: async ({ keyword }) => {
    return Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } }
      ]
    }).limit(20);
  }
};
