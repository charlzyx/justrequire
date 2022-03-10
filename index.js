var path = require('path');
var fs = require('fs');

function requirets (moduleName, pathPrefix) {
  var prefix = pathPrefix || process.cwd()

  if (!/\.(ts|js)$/.test(moduleName)) return require(moduleName);

  try {
    var filename = require.resolve(moduleName);

    var jsFilename = filename.replace(/\.ts$/, '__requirets__.js');

    require('esbuild').buildSync({
      entryPoints: [filename],
      bundle: true,
      platform: 'node',
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

    if (!exist) throw new Error(`requirets module ${moduleName} not exist`);

    var jsFilename = filename.replace(/\.(ts|tsx)$/, '__requirets__.js');

    require('esbuild').buildSync({
      entryPoints: [filename],
      bundle: true,
      platform: 'node',
      outfile: jsFilename,
    });

    var ret = require(jsFilename);

    fs.unlinkSync(jsFilename);

    return ret;
  }
}

module.exports = requirets;
