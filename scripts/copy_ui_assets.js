// css is built by less, so don't copy them

"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const cpr = require("cpr").cpr;
const mkdirp = require("mkdirp").mkdirp;


let count = 0

const options =
{
  filter: (fileName) =>
  {
    if (fileName.endsWith(".pdn"))
    {
      return false;
    }

    count += 1;

    return true;
  },
  overwrite: true,
};

mkdirp("dist/modules/defaultui/assets/img", err =>
{
  if (err) {throw err};

  cpr("modules/defaultui/assets/img", "dist/modules/defaultui/assets/img", options, (err) =>
  {
    if (err)
    {
      throw err;
    }

    console.log(`Copied ${count} UI assets to dist/`);
  });
});
