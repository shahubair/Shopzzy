import Product from "../models/product.js";

export const createProduct = async (data) => {
  return Product.create(data);
};

export const getAllProducts = async () => {
  return Product.find().sort({ createdAt: -1 });
};

export const getProductsByCategory = async (category) => {
  return Product.find({ category });
};

export const getCategories = async () => {
  return Product.distinct("category");
};
