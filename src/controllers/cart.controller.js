import Product from "../models/product.js";

export const addToCart = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) return res.redirect("/home");

  if (!req.session.cart) {
    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
  }

  const cart = req.session.cart;

  const existing = cart.items.find(
    i => i.productId.toString() === productId
  );

  if (existing) {
    existing.qty += 1;
    req.session.message = "Item already in cart. Quantity increased.";
  } else {
    cart.items.push({
      productId,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    });
    req.session.message = "Item added to cart.";
  }

  cart.totalQty += 1;
  cart.totalPrice += product.price;

  res.redirect("/home");
};
export const showCart = (req, res) => {
  res.render("pages/cart", {
    cart: req.session.cart || { items: [], totalQty: 0, totalPrice: 0 },
    user: req.user
  });
};

export const removeFromCart = (req, res) => {
  const productId = req.params.id;
  const cart = req.session.cart;

  if (!cart) return res.redirect("/cart");

  const index = cart.items.findIndex(
    i => i.productId.toString() === productId
  );

  if (index !== -1) {
    const item = cart.items[index];
    cart.totalQty -= item.qty;
    cart.totalPrice -= item.price * item.qty;
    cart.items.splice(index, 1);
  }

  res.redirect("/cart");
};
