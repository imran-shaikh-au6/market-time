const Product = require("../../Model/Product");
const User = require("../../Model/User")
module.exports = {
  getAllProducts: async (req, res) => {
    const page = req.params.page;
    const startIndex = (page - 1) * 12;
    const endIndex = page * 12;
    const allProduct = await Product.find().sort({ date: -1 });
    const mainProducts = allProduct.slice(startIndex, endIndex);
    res.status(200).json({ allProduct: mainProducts });
  },
  singleProduct: async (req, res) => {
    const productId = req.params.id;
    const singleProduct = await Product.findById(productId);
    // console.log(singleProduct.user);
    const user = await User.findById(singleProduct.user);
    console.log(user)
    res.status(200).json({
      message: "single product details",
      singleProductData: singleProduct,
      user:user
    });
  },
  filterProduct: (req, res) => {
     const capitalLetters = (s) => {
         return s
             .trim()
             .split(" ")
             .map((i) => i[0].toUpperCase() + i.substr(1))
             .reduce((ac, i) => `${ac} ${i}`);
     };
    const page = req.params.page;
    const city = req.query.city;
    const category = req.query.category;
    console.log(category);
    const title1 = req.query.title;
    const title = capitalLetters(title1);
    const startIndex = (page - 1) * 12;
    const endIndex = page * 12;
    const sort = {};
    if (city !== "undefined") sort.city = city;
    if (category !== "undefined") sort.category = category;
    if (title !== "undefined") sort.title = new RegExp(title, "g");
    Product.find(sort)
      .sort({ date: -1 })
      .then((data) => {
        const mainProduct = data.slice(startIndex, endIndex);
        res.status(200).json({
          message: "filtered products",
          data: mainProduct,
        });
      })
      .catch((error) => {
        res.status(404).send("Product Not Found");
      });
  },
};
