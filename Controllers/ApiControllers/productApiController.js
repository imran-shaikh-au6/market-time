const cloudinary = require("cloudinary").v2;
const upload = require("../../config/passport");
const path = require("path");
const User = require("../../Model/User");
const Product = require("../../Model/Product");
let multiparty = require("multiparty");
const fs = require("fs");

module.exports = {
    addProducts: async (req, res) => {
          const capitalLetters = (s) => {
              return s
                  .trim()
                  .split(" ")
                  .map((i) => i[0].toUpperCase() + i.substr(1))
                  .reduce((ac, i) => `${ac} ${i}`);
          };
          const title1 = req.body.title;
                  const mainTitle = capitalLetters(title1);
        const newProduct = {
            user: req.user.id,
            title: mainTitle,
            category: req.body.category,
            city: req.body.city,
            price: req.body.price,
            description: req.body.description,
            brand: req.body.brand,
            year: req.body.year,
        };
        const saveProduct = (product) => {
            let newPro = new Product(product);
            newPro
                .save()
                .then((savedProduct) => {
                    User.findByIdAndUpdate(
                        { _id: savedProduct.user },
                        { $push: { myProducts: savedProduct._id } },
                        { new: true }
                    )
                        .then((user) =>
                            res.json({
                                massage: "Uploaded Succesfully",
                                data: user,
                            })
                        )
                        .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
        };
        if (req.files.length > 0) {
            let images = [];

            req.files.map(async (val, ind) => {
                let wait = await cloudinary.uploader.upload(val.path, function (
                    error,
                    response
                ) {
                    if (error) {
                        console.log("err", error);
                    }
                });
                images.push(wait.url);
                if (images.length === req.files.length) {
                    const data = (newProduct.photos = images);
                    console.log(data);

                    saveProduct(newProduct);
                }
            });
        } else {
            saveProduct(newProduct);
        }
    },
    editProduct: async (req, res) => {
        const editProduct = {
            title: req.body.title,
            product_id: req.body.id,
            category: req.body.category,
            city: req.body.city,
            price: req.body.price,
            description: req.body.description,
            brand: req.body.brand,
            year: req.body.year,
        };
        console.log(editProduct);
        const newEditProduct = (product) => {
            Product.findByIdAndUpdate(
                { _id: req.body.id },
                { $set: product },
                { new: true }
            )
                .then((product) =>
                    res.json({ message: "Edited Successfully", data: product })
                )
                .catch((err) => console.log(err));
        };
        if (req.files[0] !== "") {
            let images = [];
            req.files.map(async (val, ind) => {
                let wait = await cloudinary.uploader.upload(val.path, function (
                    error,
                    response
                ) {
                    if (error) {
                        console.log("err", error);
                    }
                });
                images.push(wait.url);
                if (images.length === req.files.length) {
                    editProduct.photos = images;
                    newEditProduct(editProduct);
                }
            });
        } else {
            newEditProduct(editProduct);
        }
    },
    deleteProduct: async (req, res) => {
        const user = req.user.id;
        const product_id = req.params.id;
        try {
            const product = await Product.findOneAndDelete({
                user: user,
                _id: product_id,
            });
            await User.updateOne(
                { _id: user },
                {
                    $pullAll: { myProducts: [product_id] },
                }
            );
            if (product === null) {
                res.status(403).send(
                    "You are not allowed to delete this product"
                );
            } else {
                res.status(200).json({
                    massage: "Product deleted successfully",
                    Product: product,
                });
            }
        } catch (err) {
            res.status(500).send("server error");
            console.log(err.massage);
        }
    },
};
