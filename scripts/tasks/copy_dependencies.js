'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const ncp = require('ncp').ncp;

const filesToCopyWithDestination =
{
  "node_modules/pixi.js/dist/pixi.js": "dist/pixi.js",
  "node_modules/react/dist/react-with-addons.js": "dist/react-with-addons.js",
  "node_modules/react-dom/dist/react-dom.js": "dist/react-dom.js",
  "node_modules/react-dom-factories/index.js": "dist/react-dom-factories.js",
};

Object.keys(filesToCopyWithDestination).forEach(source =>
{
  const destination = filesToCopyWithDestination[source];

  ncp(source, destination, err =>
  {
    if (err)
    {
      throw err;
    }
  });

  console.log(`${source} => ${destination}`);
});
