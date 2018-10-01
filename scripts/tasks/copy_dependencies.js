'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const ncp = require('ncp').ncp;

const sources =
[
  "node_modules/pixi.js/dist/pixi.js",
  "node_modules/react/dist/react-with-addons.js",
  "node_modules/react-dom/dist/react-dom.js",
  "node_modules/react-transition-group/dist/react-transition-group.js"
];

sources.forEach(source =>
{
  const split = source.split("/");
  const destination = "dist/" + split[split.length - 1];

  ncp(source, destination, err =>
  {
    if (err)
    {
      throw err;
    }
  });

  console.log(`${source} => ${destination}`);
});
