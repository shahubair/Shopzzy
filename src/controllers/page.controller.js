export const homePage = (req, res) => {
  res.render("pages/home", {
    user: req.user
  });
};
