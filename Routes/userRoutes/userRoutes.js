const express = require("express");
const User = require("../../Model/User");
const upload = require("../../config/multer");
// const auth = require("../../Middleware/auth")
const router = express.Router();
const passport = require("passport");
const {
  registerUser,
  loginUser,
  googleLogin,
  logout,
  addTowishlist,
  editprofile,
  deleteFromWishList,
  userEmailDetails,
} = require("../../Controllers/ApiControllers/userApiControllers");

const {
  getUserProfile,
  getWishList,
  getMyProduct
} = require("../../Controllers/NormalControllers/userNormalController");

router.get(
  "/userProfile/:id",
  passport.authenticate("jwt", { session: false }),
  getUserProfile
);
router.get("/userWishList", passport.authenticate("jwt", { session: false }),
  getWishList)
router.get("/userMyPro", passport.authenticate("jwt", { session: false }),
  getMyProduct)


router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/google", googleLogin);
router.post(
  "/user/editprofile",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  editprofile
);
router.post(
  "/user/addTowishlist/:productId",
  passport.authenticate("jwt", { session: false }),
  addTowishlist
);
router.post(
  "/user/deleteFromWishList/:productId",
  passport.authenticate("jwt", { session: false }),
  deleteFromWishList
);

router.post(
  "/userEmailDetails/:product_id",
  passport.authenticate("jwt", { session: false }),
  userEmailDetails
);

//get routes
// router.get(
//   "/userProfile",
//   passport.authenticate("jwt", { session: false }),
//   getUserProfile
// );

// router.post("/user/logout",auth, logout);
module.exports = router;
