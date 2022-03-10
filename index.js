var path = require('path');
var fs = require('fs');

function justrequire (moduleName, pathPrefix) {
  var prefix = pathPrefix || process.cwd()

  if (/\.json$/.test(moduleName)) return require(moduleName);

  try {
    var filename = require.resolve(moduleName);

    var jsFilename = filename.replace(/\.(ts|tsx|cts|mts|js|cjs|mjs)$/, '__requirets__.cjs');

    // console.log('------------------------------------');
    // console.log('--require.resolve("'+moduleName+'");')
    // console.log(filename);
    // console.log('------------------------------------');
    // console.log(jsFilename);
    // console.log('------------------------------------');


    require('esbuild').buildSync({
      entryPoints: [filename],
      bundle: true,
      platform: 'node',
      format: "cjs",
      outfile: jsFilename,
    });

    var ret = require(jsFilename);

    fs.unlinkSync(jsFilename);

    return ret;

  } catch (_) {
    var filename = path.isAbsolute(moduleName)
      ? moduleName
      : path.resolve(prefix, moduleName);

    var exist = fs.existsSync(filename);

    // console.log('------------------------------------');
    // console.log('--path.resolve----');
    // console.log('------------------------------------');
    // console.log(filename);
    // console.log('------------------------------------');
    // console.log(jsFilename);
    // console.log('------------------------------------');



    if (!exist) throw new Error(`justrequire module ${moduleName} not exist`);
    
    var jsFilename = filename.replace(/\.(ts|tsx|cts|mts|js|cjs|mjs)$/, '__requirets__.cjs');

    require('esbuild').buildSync({
      entryPoints: [filename],
      bundle: true,
      platform: 'node',
      format: "cjs",
      outfile: jsFilename,
    });

    var ret = require(jsFilename);

    fs.unlinkSync(jsFilename);

    return ret;
  }
}

module.exports = justrequire;