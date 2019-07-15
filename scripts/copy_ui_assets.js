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

mkdirp("dist/modules/defaultui/img", err =>
{
  if (err) {throw err};

  cpr("modules/defaultui/img", "dist/modules/defaultui/img", options, (err) =>
  {
    if (err)
    {
      throw err;
    }

    console.log(`Copied ${count} UI assets to dist/`);
  });
});
