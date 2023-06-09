const express = require("express");
const router = express.Router();
const { login, getMyURLs, summariseURLData } = require("../controllers/userControllers");
const userAuthenticationMiddleware = require("../middlewares/userAuthenticationMiddleware");

router.post("/login", login);
router.post("/my_urls", userAuthenticationMiddleware, getMyURLs);
router.post("/summarise/:summarize_by", userAuthenticationMiddleware, summariseURLData);

module.exports = router;