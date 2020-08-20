const express = require("express");
const User = require("../../Model/User");
const Product = require("../../Model/Product");

module.exports = {
  getUserProfile: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      console.log(user);
      res.status(200).send(user);
    } catch {
      res.status(501).send("Internal server error");
    }
  },

  getWishList: async (req, res) => {
    const user = req.user.id;
    try {
      const userWishList = await User.findById(user);
      // console.log(userWishList.myWishlist);
      // const wishList = userWishList.myWishlist;
      // const sliced = wishList.slice(0, 11);

      // res.status(200).send(wishList);

      const favourite = userWishList.myWishlist;
      const arr = [];
      for (i = 0; i < favourite.length; i++) {
        var properties = await Product.find({ _id: favourite[i] });
        arr.push(properties);
      }
      res.status(200).json(arr);
    } catch (error) {
      res.status(400).send("No products found in Wishlist");
      console.log(error);
    }
  },

  getMyProduct: async (req, res) => {
    const userId = req.user.id;
    try {
      const userProducts = await User.findById(userId);
      const myProduct = userProducts.myProducts;

      const favourite = myProduct;
      const arr = [];
      for (i = 0; i < favourite.length; i++) {
        var properties = await Product.find({ _id: favourite[i] });
        arr.push(properties);
      }
      res.status(200).json(arr);
    } catch (error) {
      res.status(400).send("No products found in Wishlist");
      console.log(error);
    }
  },
};
