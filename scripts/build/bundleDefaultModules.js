"use strict";

const {bundleModule} = require("./bundleModule");


console.log("bundling modules");
[
  {root: "modules/common",                   include: "**/*.js"},
  {root: "modules/core",                     include: "**/*.js"},
  {root: "modules/defaultai",                include: "**/*.js"},
  {root: "modules/defaultattitudemodifiers", include: "**/*.js"},
  {root: "modules/defaultemblems",           include: "**/*.js"},
  {root: "modules/defaultnotifications",     include: "**/*.js"},
  {root: "modules/defaultui",                include: "**/*.js"},
  {root: "modules/drones",                   include: "**/*.js"},
  {root: "modules/englishlanguage",          include: "**/*.js"},
  {root: "modules/paintingportraits",        include: "**/*.js"},
  {root: "modules/space",                    include: "{,abilities/**/,effectactions/**/,passiveskills/**/,terrains/**/,uniteffects/**/}*.js"},
  {root: "modules/space/backgrounds",        include: "**/*.js"},
  {root: "modules/space/battlesfx",          include: "**/*.js"},
  {root: "modules/space/buildings",          include: "**/*.js"},
  {root: "modules/space/items",              include: "**/*.js"},
  {root: "modules/space/mapgen",             include: "**/*.js"},
  {root: "modules/space/mapmodes",           include: "**/*.js"},
  {root: "modules/space/races",              include: "**/*.js"},
  {root: "modules/space/resources",          include: "**/*.js"},
  {root: "modules/space/technologies",       include: "**/*.js"},
  {root: "modules/space/units",              include: "**/*.js"},
  {root: "src",                              include: "**/*.js"},
  {root: "_temp_app",                        include: "**/*.js"},
].forEach(toBundle =>
{
  bundleModule(toBundle.root, toBundle.include);
});
