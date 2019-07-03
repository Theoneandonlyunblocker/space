"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const fs = require("fs");
const ncp = require("ncp").ncp;


const origDefsPath = "node_modules/pixi.js/pixi.js.d.ts";
const origDefsCopyPath = "node_modules/pixi.js/pixi.js.d.ts.orig";
const customDefsPath = "lib/pixi.js.d.ts";

const origCopyExists = fs.existsSync(origDefsCopyPath);

if (!origCopyExists)
{
  fs.renameSync(origDefsPath, origDefsCopyPath);
  console.log(`${origDefsPath} => ${origDefsCopyPath}`);
}

ncp(customDefsPath, origDefsPath, (err) =>
{
  if (err) {throw err;};
});

console.log(`${customDefsPath} => ${origDefsPath}`);
