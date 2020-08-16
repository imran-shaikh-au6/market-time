const cloudinary = require("cloudinary").v2;
const upload = require("../../config/passport");
const path = require("path");
const User = require("../../Model/User");
const Product = require("../../Model/Product");
let multiparty = require("multiparty");
const fs = require("fs");

module.exports = {
    addProducts: async (req, res) => {
        const newProduct = {
            user: req.user.id,
            title: req.body.title,
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
                        .then((user) => res.json(user))
                        .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
        };
        if (req.files.length > 0) {
            let images = [];
            const titile = req.titile;
            console.log(titile);
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
                    res.send("Uploaded successfully");
                    saveProduct(newProduct);
                }
            });
        } else {
            saveProduct(newProduct);
            res.send("Uploaded Successfully");
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
        const newEditProduct = (product) => {
            Product.findByIdAndUpdate(
                { _id: req.body.product_id },
                { $set: product },
                { new: true }
            )
                .then((product) => res.json(product))
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
        const prId = req.body.id;
        console.log(prId);
        // Product.findByIdAndDelete({ _id: prId }).then(() => {
        //     res.send("Deleted Successfully");
        // });
        const product= await Product.findOneAndDelete({
            user: req.user.id,
            _id: req.body.id,
        });
        if (product === null) {
            res.status(403).send("You are not allowed to delete this property");
        } else {
            res.status(200).json({
                massage: "Property deleted successfully",
                Product: product,
            });
        }
    },
};
