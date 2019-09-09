"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const cpr = require("cpr").cpr;
const mkdirp = require("mkdirp").mkdirp;


const filesToCopyWithDestination =
{
  "node_modules/pixi.js/dist/pixi.js": "dist/external/pixi.js",
  "node_modules/react/umd/react.development.js": "dist/external/react.js",
  "node_modules/react-dom/umd/react-dom.development.js": "dist/external/react-dom.js",
  "node_modules/react-dom-factories/index.js": "dist/external/react-dom-factories.js",
  "node_modules/localforage/dist/localforage.js": "dist/external/localforage.js",
  "node_modules/proton-js/build/proton.js": "dist/external/proton.js",
  "node_modules/react-motion/build/react-motion.js": "dist/external/react-motion.js",
  "node_modules/@tweenjs/tween.js/src/Tween.js": "dist/external/Tween.js",
  "node_modules/rng-js/rng.js": "dist/external/rng.js",
  "node_modules/voronoi/rhill-voronoi-core.js": "dist/external/rhill-voronoi-core.js",
  "node_modules/polygon-offset/dist/offset.js": "dist/external/offset.js",
  "node_modules/messageformat/messageformat.js": "dist/external/messageformat.js",
  "node_modules/quadtree-lib/build/js/quadtree.js": "dist/external/quadtree.js",
  "node_modules/requirejs/require.js": "dist/external/require.js",

  "node_modules/requirejs-plugins/lib/text.js": "dist/external/requirejs-text.js",
  "node_modules/requirejs-plugins/src/json.js": "dist/external/requirejs-json.js",

  "external/hsluv-0.0.3.min.js": "dist/external/hsluv.js",
};

mkdirp("dist/external", err =>
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



