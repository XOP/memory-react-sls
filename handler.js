'use strict';

require('cross-fetch/polyfill');

const unsplashClient = require('unsplash-js');
const Unsplash = unsplashClient.default;
const toJson = unsplashClient.toJson;
const unsplash = new Unsplash({
    applicationId: process.env.UNSPLASH_APP_ID,
    secret: process.env.UNSPLASH_SECRET,
    callbackUrl: process.env.UNSPLASH_CB
});

module.exports.images = async (event, context) => {
    const {
        count,
        theme
    } = event.queryStringParameters || {};

    const options = {
        count: (count || 1).toString()
    };

    if (theme) {
        options.query = theme;
    }

    const images = await unsplash.photos.getRandomPhoto(options);
    const imagesData = await toJson(images);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Content-Type'
        },
        body: JSON.stringify(imagesData),
        isBase64Encoded: false
    };
};

module.exports.debug = (event, context, callback) => {
    const data = {};

    data.event = event;
    data.context = context;

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // CORS requirement
        },
        body: JSON.stringify(data),
        isBase64Encoded: false
    };

    callback(null, response);
};
