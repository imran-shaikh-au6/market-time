const Product = require("../../Model/Product");
const express = require("express");
const {
    addProducts,
    editProduct,
    deleteProduct,
} = require("../../Controllers/ApiControllers/productApiController");
const router = express.Router();
const passport = require("passport");
const upload = require("../../config/multer");
const {
    getAllProducts,
    singleProduct,
    filterProduct,
} = require("../../Controllers/NormalControllers/productNormalController");

//Post Routes
router.post(
    "/addProducts",
    passport.authenticate("jwt", { session: false }),
    upload.array("image", 3),
    addProducts
);

router.post(
    "/editproduct",
    passport.authenticate("jwt", { session: false }),
    upload.array("image", 3),
    editProduct
);

router.post(
    "/deleteProduct",
    passport.authenticate("jwt", { session: false }),
    deleteProduct
);

//Get Routes

router.get("/allProduct/:page", getAllProducts);
router.get("/singleProduct/:id", singleProduct);
router.get("/filterProduct/:page", filterProduct);

module.exports = router;
