const functions = require("firebase-functions");

const info = (message, data) => {
  functions.logger.info(message, { structuredData: true, ...data });
};

const error = (message, data) => {
  functions.logger.error(message, { structuredData: true, ...data });
};

module.exports = { info, error };
