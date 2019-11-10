"use strict";

const {bundleModule} = require("./bundleModule");


console.log("bundling modules");
[
  {root: "modules/common",                   include: "**/*.js"},
  {root: "modules/money",                    include: "**/*.js"},
  {root: "modules/defaultai",                include: "**/*.js"},
  {root: "modules/defaultattitudemodifiers", include: "**/*.js"},
  {root: "modules/defaultemblems",           include: "**/*.js"},
  {root: "modules/defaultnotifications",     include: "**/*.js"},
  {root: "modules/defaultui",                include: "**/*.js"},
  {root: "modules/drones",                   include: "**/*.js"},
  {root: "modules/englishlanguage",          include: "**/*.js"},
  {root: "modules/paintingportraits",        include: "**/*.js"},
  {root: "modules/space",                    include: "**/*.js"},
  {root: "modules/titans",                   include: "**/*.js"},
  {root: "core",                             include: "**/*.js"},
  {root: "_temp_app",                        include: "**/*.js"},
].forEach(toBundle =>
{
  bundleModule(toBundle.root, toBundle.include);
});

