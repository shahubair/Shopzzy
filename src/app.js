import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
// import pageRoutes from "./routes/page.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import { graphqlMiddleware } from "./routes/graphql.routes.js";
import session from "express-session";
import cartRoutes from "./routes/cart.routes.js";
import passwordRoutes from "./routes/password.routes.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: "cartsecret",
    resave: false,
    saveUninitialized: true
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use("/", passwordRoutes);
app.use("/", authRoutes);
// app.use("/", pageRoutes);
app.use("/", adminRoutes);
app.use("/", productRoutes);
app.use("/graphql", graphqlMiddleware);
app.use("/", cartRoutes);





/* View Engine */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Routes */
app.get("/", (req, res) => {
  res.render("pages/landing");
});

/* Error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

export default app;
