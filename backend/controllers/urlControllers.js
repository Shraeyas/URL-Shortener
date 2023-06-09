const { base62Encode } = require("../utils/base62Encode");
const { generateUUID } = require("../utils/generateUUID");
const ShortUrlModel = require("../models/shortUrlModel");
const analytics = require("../models/analyticsModel");
const isUrlValid = require("../utils/urlValidator");
const userModel = require("../models/userModel");

// @desc    Shortens a URL
// @route   POST /url/shorten
// @access  Public
const urlShortener = async (req, res, next) => {
    let { url, google_oauth_sub } = req.body;
    let uuid = await generateUUID();
    let base62Encoded = base62Encode(uuid);
    let baseUrl = req.get('host');

    try {
        if(!isUrlValid(url)) {
            throw Error("Invalid URL");
        }

        let user;
        if(google_oauth_sub) {
            user = await userModel.findOne({ google_oauth_sub });
        }

        if(user) {
            const shortUrl = await ShortUrlModel.create({
                url: url,
                encoded_id: base62Encoded,
                short_url: `http://${baseUrl}/${base62Encoded}`,
                user: user._id
            });
            res.status(200).json({
                success: true,
                short_url: `http://${baseUrl}/${base62Encoded}`
            });
        }
        else {
            const shortUrl = await ShortUrlModel.create({
                url: url,
                encoded_id: base62Encoded
            });
            res.status(200).json({
                success: true,
                short_url: `http://${baseUrl}/${base62Encoded}`
            });
        }
    }
    catch(e) {
        next(e);
    }
}

// @desc    Performs a redirection
// @route   POST /:param
// @access  Public
const urlRedirector = async (req, res, next) => {
    try {
        let baseUrl = req.get('host');
        const { param } = req.params;
        const shortUrl = await ShortUrlModel.findOne({
            encoded_id: param
        });
        const { url, user, encoded_id } = shortUrl;
        await analytics.create({
            user,
            url,
            encoded_id,
            short_url: `http://${baseUrl}/${encoded_id}`
        });
        res.status(301).redirect(url);
    }
    catch(e) {
        next(e);
    }
}
module.exports = { urlShortener, urlRedirector };