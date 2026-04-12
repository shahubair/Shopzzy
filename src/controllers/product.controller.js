import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getCategories
} from "../services/product.service.js";

export const showAddProduct = (req, res) => {
  res.render("pages/add-product");
};

export const addProduct = async (req, res) => {
  const { title, price, category, description, image } = req.body;
  await createProduct({ title, price, category, description, image });
  res.redirect("/home");
};

export const home = async (req, res) => {
  const { category } = req.query;

  const products = category
    ? await getProductsByCategory(category)
    : await getAllProducts();

  const categories = await getCategories();

  res.render("pages/home", {
    user: req.user,
    products,
    categories,
    activeCategory: category || "all"
  });
};
