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
    if (fileName.endsWith(".pdn"))
    {
      return false;
    }

    count += 1;

    return true;
  }
};

ncp("modules/defaultui/img", "dist/modules/defaultui/img", options, (err) =>
{
  if (err)
  {
    throw err;
  }

  console.log(`Copied ${count} UI assets to dist/`);
});
