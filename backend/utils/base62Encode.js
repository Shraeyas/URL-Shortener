const ObjectId = require('bson-objectid');
require("dotenv").config();
function objectIdToBase62(objectId) {
	const base62Characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	const idBuffer = Buffer.from(objectId.toString(), 'hex');
	let value = BigInt('0x' + idBuffer.toString('hex'));
	const base = BigInt(base62Characters.length);
	while (value > 0n) {
		const remainder = value % base;
		result = base62Characters[Number(remainder)] + result;
		value = value / base;
	}
	return result;
}

function decimalToBase62(decimalNumber) {
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	while (decimalNumber > 0) {
		const remainder = decimalNumber % 62;
		result = characters[remainder] + result;
		decimalNumber = Math.floor(decimalNumber / 62);
	}
	return result;
}
const base62Encode = (decimal) => {
	if (process.env.UUID_GENERATOR === "SNOWFLAKE") {
		return decimalToBase62(decimal.toString());
	}
	else {
		return objectIdToBase62(decimal);
	}
}
module.exports = { base62Encode };