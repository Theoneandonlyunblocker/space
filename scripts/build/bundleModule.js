// hackjob replacement for tsc --outfile since that doesn't work with project references (ts 3.5.2 at least)

"use strict";

const fs = require("fs");
const path = require("path").posix;
const Concat = require("concat-with-sourcemaps");

const
{
  prefixJsonAmdImports,
  glob,
  compileTscProject,
  nameAmdModules,
  removeSourceMappingUrl,
  writeFile,
} = require("./utils");


// const args = process.argv;
// bundleModule(args[2]);

const buildDir = "build/";
const distDir = "dist/";
const outFileName = "index.js";
const outSourceMapName = `${outFileName}.map`;

async function bundleModule(moduleRoot, includePattern)
{
  // ---COMPILE---
  // await compileTscProject(moduleRoot);


  process.chdir(__dirname);
  process.chdir("../../");


  // const fileNames = await getJsFilesInDir(path.join(buildDir, moduleRoot)).then(fileNames =>
  const fileNames = await glob(path.posix.join(buildDir, moduleRoot, includePattern)).then(fileNames =>
  {
    return fileNames.map(fileName =>
    {
      return fileName.replace(buildDir, "");
    });
  });

  await Promise.all(fileNames.map(fileName =>
  {
    return new Promise(resolve =>
    {
      fs.readFile(path.join(buildDir, fileName), "utf-8", (err, source) =>
      {
        if (err) {throw err};

        let processedSource = source;

        // ---NAME MODULES & RESOLVE IMPORTS---
        const moduleNameResult = nameAmdModules(processedSource, fileName);
        processedSource = moduleNameResult.data;

        // ---PREFIX JSON IMPORTS---
        const prefixResult = prefixJsonAmdImports(processedSource, fileName);
        processedSource = prefixResult.data;

        //  ---REMOVE ORIGINAL SOURCEMAPPING---
        const removeSourceMappingResult = removeSourceMappingUrl(processedSource);
        processedSource = removeSourceMappingResult.data;


        const didChange = prefixResult.didChange ||
          moduleNameResult.didChange ||
          removeSourceMappingResult.didChange;

        if (didChange)
        {
          writeFile(path.join(buildDir, fileName), processedSource, (err) =>
          {
            if (err) {throw err};

            resolve();
          });
        }
        else
        {
          resolve();
        }
      });
    });
  }));

  // ---CONCAT---
  const outFilePath = path.join(distDir, moduleRoot, outFileName);
  const outSourceMapPath = path.join(distDir, moduleRoot, outSourceMapName);

  const concat = new Concat(true, outFileName, "\n");

  fileNames.forEach(fileName =>
  {
    const sourceMapFileName = path.join(
      path.dirname(fileName),
      path.basename(fileName, ".js") + ".js.map",
    );

    concat.add(
      fileName,
      fs.readFileSync(path.join(buildDir, fileName), "utf-8"),
      fs.readFileSync(path.join(buildDir, sourceMapFileName), "utf-8"),
    );
  });

  concat.add(null, `//# sourceMappingURL=${outSourceMapName}`);

  await writeFile(outFilePath, concat.content, (err) =>
  {
    if (err) {throw err};
  });

  await writeFile(outSourceMapPath, concat.sourceMap, (err) =>
  {
    if (err) {throw err};
  });
}
exports.bundleModule = bundleModule;

