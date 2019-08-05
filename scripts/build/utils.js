"use strict";

const glob = require("glob");
const mkdirp = require("mkdirp");

const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");


exports.prefixJsonAmdImports = (source) =>
{
  const defineBlock = source.match(/define\((.+?)\)/)[1];
  const toSearch = /"([^"!]+?)\.json"/g;
  const toReplaceWith = `"json!dist/$1.json"`;

  if (defineBlock.match(toSearch))
  {
    const prefixedDefineBlock = defineBlock.replace(toSearch, toReplaceWith);

    return(
    {
      data: source.replace(defineBlock, prefixedDefineBlock),
      didChange: true,
    });
  }
  else
  {
    return(
    {
      data: source,
      didChange: false,
    });
  }
}
exports.nameAmdModules = (source, fileName) =>
{
  const dirName = path.dirname(fileName);
  const baseName = path.basename(fileName, ".js");
  const moduleName = path.posix.join(dirName, baseName);

  const toSearch = /define\(\["require"/;
  const toReplaceWith = `define("${moduleName}", ["require"`;

  if (source.match(toSearch))
  {
    const oldCwd = process.cwd();
    const projectRoot = path.resolve(__dirname, "../../");
    process.chdir(projectRoot);

    let data = source;

    const defineArgsMatch = data.match(/define\(.*?\[(.+?)\]/);
    const defineArgs = defineArgsMatch[1];
    const defineArgsWithResolvedPaths = defineArgs.split(", ").map(quotedArg =>
    {
      return quotedArg.slice(1, -1);
    }).map(arg =>
    {
      if (arg.startsWith('.'))
      {
        const resolvedArg = path.posix.join(dirName, arg);

        return `"${resolvedArg}"`;
      }
      else
      {
        return `"${arg}"`;
      }
    }).join(", ");

    // imports
    data = data.replace(defineArgs, defineArgsWithResolvedPaths);

    // exports
    data = data.replace(toSearch, toReplaceWith);

    process.chdir(oldCwd);

    return(
    {
      data: data,
      didChange: true,
    });
  }
  else
  {
    return(
    {
      data: source,
      didChange: false,
    });
  }
}
exports.removeSourceMappingUrl = (source) =>
{
  const sourceMappingPattern = /\/\/# sourceMappingURL=.+?\.js\.map/;

  const index = source.search(sourceMappingPattern);

  if (index !== -1)
  {
    const processedSource = source.slice(0, index - 1); // also remove newline

    return(
    {
      data: processedSource,
      didChange: true,
    });
  }
  else
  {
    return(
    {
      data: source,
      didChange: false,
    });
  }
}
exports.glob = (pattern) =>
{
  return new Promise(resolve =>
  {
    glob(pattern, (err, fileNames) =>
    {
      if (err)
      {
        throw err
      }
      else
      {
        resolve(fileNames);
      }
    })
  });
}
exports.compileTscProject = (projectDir) =>
{
  return new Promise((resolve, reject) =>
  {
    const tsc = spawn("tsc", ["-b", projectDir, "--verbose"],
    {
      cwd: ""
    });

    tsc.stdout.on("data", data =>
    {
      console.log(data);
    });
    tsc.stderr.on("data", data =>
    {
      console.log(data);
    });

    tsc.on("error", err =>
    {
      reject(err);
    });
    tsc.on("close", code =>
    {
      resolve();
    });
  });
}
exports.writeFile = (fileToWrite, data, cb) =>
{
  const dirName = path.dirname(fileToWrite);

  mkdirp(dirName, (err) =>
  {
    if (err) {cb(err)};

    fs.writeFile(fileToWrite, data, cb);
  });
}
