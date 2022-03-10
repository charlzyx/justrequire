# requirets

## Usage

```js
const requirets = require('requirets');

// if a ts file, require a ts file just like require
const x = requirets('./some/x.ts');
// or process by origin require
const y = requirets('module');
```

## How
1. transform `x.ts` to `x.js` by [esbuild](https://github.com/evanw/esbuild)
2. then `var ret = require('x.js')`
3. before return, delete the file `x.js`
4. return `ret`


## Source Code
```js
var path = require('path');
var fs = require('fs');

function requirets ( moduleName, pathPrefix) {
  var prefix = pathPrefix || process.cwd()

  if (!/\.ts$/.test(moduleName)) return require(moduleName);

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
```
