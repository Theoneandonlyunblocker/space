const base = require("./jest.config.base");


module.exports = {
  ...base,
  projects: [
    "<rootDir>/core/test/jest.config.js",
    "<rootDir>/modules/baselib/test/jest.config.js",
  ],
};
