"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs");
const glob = require("glob");
const path = require("path")


glob("dist/modules/**/*.js", (err, fileNames) =>
{
  if (err) {throw err};

  let count = 0;

  fileNames.forEach(fileName =>
  {
    fs.readFile(fileName, "utf-8", (err, source) =>
    {
      if (err) {throw err};

      const outData = source.replace(new RegExp(`"\./moduleInfo\.json`, `g`), `"json!./moduleInfo.json`)

      fs.writeFile(outFileName, outData, (err) =>
      {
        if (err) {throw err};

        count += 1;
      });
    });
  });

  console.log(`Prefixed JSON import in ${count} files\n`);
});
