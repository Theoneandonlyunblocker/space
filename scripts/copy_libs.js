"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const cpr = require("cpr").cpr;
const mkdirp = require("mkdirp").mkdirp;


const filesToCopyWithDestination =
{
  "node_modules/pixi.js/dist/pixi.js": "dist/lib/pixi.js",
  "node_modules/react/umd/react.development.js": "dist/lib/react.js",
  "node_modules/react-dom/umd/react-dom.development.js": "dist/lib/react-dom.js",
  "node_modules/react-dom-factories/index.js": "dist/lib/react-dom-factories.js",
  "node_modules/localforage/dist/localforage.js": "dist/lib/localforage.js",
  "node_modules/proton-js/build/proton.js": "dist/lib/proton.js",
  "node_modules/react-motion/build/react-motion.js": "dist/lib/react-motion.js",
  "node_modules/@tweenjs/tween.js/src/Tween.js": "dist/lib/Tween.js",
  "node_modules/rng-js/rng.js": "dist/lib/rng.js",
};

mkdirp("dist/lib", err =>
{
  if (err) {throw err};

  Object.keys(filesToCopyWithDestination).forEach(source =>
  {
    const destination = filesToCopyWithDestination[source];

    cpr(source, destination, {overwrite: true}, err =>
    {
      if (err) {throw err};
    });

    console.log(`${source} => ${destination}`);
  });
});



