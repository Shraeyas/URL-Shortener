const express = require("express");
const router = express.Router();
const urlAuthenticationMiddleware = require("../middlewares/urlAuthenticationMiddleware");
const { urlShortener, urlRedirector } = require("../controllers/urlControllers");

router.post("/shorten", urlAuthenticationMiddleware, urlShortener);
router.get("/:param", urlRedirector)

module.exports = router;