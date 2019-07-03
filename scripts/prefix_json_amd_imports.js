"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs");
const glob = require("glob");
const path = require("path")


const toSearch = `"\./moduleInfo\.json`;
const toReplaceWith = `"json!./moduleInfo.json`;

glob("dist/modules/**/*.js", (err, fileNames) =>
{
  if (err) {throw err};

  let count = 0;

  Promise.all(fileNames.map(fileName =>
  {
    return new Promise(resolve =>
    {
      fs.readFile(fileName, "utf-8", (err, source) =>
      {
        if (err) {throw err};

        if (source.includes(toSearch))
        {
          const outData = source.replace(new RegExp(toSearch, `g`), toReplaceWith)

          fs.writeFile(fileName, outData, (err) =>
          {
            if (err) {throw err};

            count += 1;
            resolve();
          });
        }
        else
        {
          resolve();
        }
      });
    });
  })).then(() =>
  {
    console.log(`Prefixed JSON import in ${count} file${count === 1 ? "" : "s"}\n`);
  });
});
