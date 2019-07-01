"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const ncp = require("ncp").ncp;
const mkdirp = require("mkdirp").mkdirp;

let count = 0

const options =
{
  filter: (fileName) =>
  {
    if (fileName.endsWith(".license"))
    {
      return false;
    }

    count += 1;

    return true;
  }
};

mkdirp("dist/modules/paintingportraits/img", err =>
{
  ncp("modules/paintingportraits/img", "dist/modules/paintingportraits/img", options, (err) =>
  {
    if (err)
    {
      throw err;
    }

    console.log(`Copied ${count} painting portraits to dist/`);
  });
});
