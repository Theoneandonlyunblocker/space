"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const cpr = require("cpr").cpr;
const mkdirp = require("mkdirp").mkdirp;
const glob = require("glob").glob;
const path = require("path").posix;


glob("modules/**/moduleInfo.json", (err, filePaths) =>
{
  if (err) {throw err};

  filePaths.forEach(filePath =>
  {
    const dirName = path.dirname(filePath);
    const destination = path.join("dist/", filePath);

    mkdirp(dirName, err =>
    {
      if (err) {throw err};

      cpr(filePath, destination, {overwrite: true}, err =>
      {
        if (err) {throw err};

        console.log(`${filePath} => ${destination}`);
      });
    });
  });
});
