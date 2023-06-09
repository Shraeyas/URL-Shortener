const validator = require('validator');
const isUrlValid = (inputUrl) => {
    return validator.isURL(inputUrl);
}
module.exports = isUrlValid;