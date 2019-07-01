"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const ncp = require("ncp").ncp;


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

ncp("modules/paintingportraits/img", "dist/modules/paintingportraits/img", options, (err) =>
{
  if (err)
  {
    throw err;
  }

  console.log(`Copied ${count} painting portraits to dist/`);
});
