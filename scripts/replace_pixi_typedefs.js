"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs");
const cpr = require("cpr").cpr;


const origDefsPath = "node_modules/pixi.js/pixi.js.d.ts";
const origDefsCopyPath = "node_modules/pixi.js/pixi.js.d.ts.orig";
const customDefsPath = "external/pixi.js.d.ts";

const origCopyExists = fs.existsSync(origDefsCopyPath);

if (!origCopyExists)
{
  fs.renameSync(origDefsPath, origDefsCopyPath);
  console.log(`${origDefsPath} => ${origDefsCopyPath}`);
}

cpr(customDefsPath, origDefsPath, {overwrite: true}, (err) =>
{
  if (err) {throw err;};
});

console.log(`${customDefsPath} => ${origDefsPath}`);
