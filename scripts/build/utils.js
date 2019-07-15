"use strict";

const glob = require("glob");
const mkdirp = require("mkdirp");

const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");


exports.prefixJsonAmdImports = (source) =>
{
  const toSearch = new RegExp(`"\\./moduleInfo\\.json`, `g`);
  const toReplaceWith = `"json!./moduleInfo.json`;

  if (source.match(toSearch))
  {
    console.log("match");
    return(
    {
      data: source.replace(toSearch, toReplaceWith),
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

    let data = source.replace(toSearch, toReplaceWith);

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

    data = data.replace(defineArgs, defineArgsWithResolvedPaths);

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
exports.getJsFilesInDir = (dir) =>
{
  return new Promise(resolve =>
  {
    glob(path.posix.join(dir, "/**/*.js"), (err, fileNames) =>
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
exports.writeFile = async (fileToWrite, data, cb) =>
{
  const dirName = path.dirname(fileToWrite);

  await mkdirp(dirName);

  fs.writeFile(fileToWrite, data, cb);
}
