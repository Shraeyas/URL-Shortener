const User = require("../models/userModel");
const ShortUrls = require("../models/shortUrlModel");
const analytics = require("../models/analyticsModel");
const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
    try {
        const { google_oauth_sub, name } = req.body;
        if (google_oauth_sub) {
            let user = await User.findOne({
                google_oauth_sub: google_oauth_sub
            });
            if (user) {
                let { google_oauth_sub, name } = user;
                let jwToken = await jwt.sign({ google_oauth_sub, name }, process.env.JWT_SECRET);
                res.json({
                    token: jwToken,
                    new_user: false
                });
            }
            else {
                await User.create({
                    google_oauth_sub: google_oauth_sub,
                    name: name
                });
                let jwToken = await jwt.sign({ google_oauth_sub, name }, process.env.JWT_SECRET);
                res.json({
                    token: jwToken,
                    new_user: true
                });
            }
        }
        else {
            throw Error("Google Oauth Sub not provided");
        }
    }
    catch (e) {
        next(e);
    }
}

const getMyURLs = async (req, res, next) => {
    try {
        const { google_oauth_sub } = req.body;
        if (google_oauth_sub) {
            let user = await User.findOne({
                google_oauth_sub: google_oauth_sub
            });
            if (user) {
                let { _id } = user;
                let urls = await analytics.find({
                    user: _id
                });

                const url = new URL(urls[0].url);
                const baseUrl = url.host;

                res.json(urls.map(item => ({
                    base_url: (new URL(item.url)).host,
                    url: item.url,
                    short_url: item.short_url,
                    createdAt: item.createdAt
                })));
            }
            else {
                throw Error("Some Error Occurred")
            }
        }
        else {
            throw Error("Google Oauth Sub not provided");
        }
    }
    catch (e) {
        next(e);
    }
}

const summariseURLData = async (req, res, next) => {
    try {
        const { google_oauth_sub } = req.body;
        const { summarize_by } = req.params
        if (google_oauth_sub) {
            let user = await User.findOne({
                google_oauth_sub: google_oauth_sub
            });
            if (user) {
                let { _id } = user;
                let urls = await analytics.find({
                    user: _id
                });

                const url = new URL(urls[0].url);
                const urlsData = urls.map(item => ({
                    base_url: (new URL(item.url)).host,
                    url: item.url,
                    short_url: item.short_url,
                    encoded_id: item.encoded_id,
                    createdAt: item.createdAt
                }));

                if (!Object.keys(urlsData[0]).includes(summarize_by)) {
                    throw Error("Error with the summarization key");
                }

                const summary = Object.entries(urlsData.reduce((acc, item) => {
                    const summarizeKey = item[summarize_by];
                    if (acc[summarizeKey]) {
                        acc[summarizeKey]++;
                    }
                    else {
                        acc[summarizeKey] = 1;
                    }
                    return acc;
                }, {})).map(([summarizeKey, count]) => ({ [summarize_by]: summarizeKey, count: count }));

                res.json(summary);
            }
            else {
                throw Error("Some Error Occurred")
            }
        }
        else {
            throw Error("Google Oauth Sub not provided");
        }
    }
    catch (e) {
        next(e);
    }
}

module.exports = { login, getMyURLs, summariseURLData };