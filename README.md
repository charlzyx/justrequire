# justrequire

just require `.ts` and `ESM` js file as require

## Usage

```js
const justrequire = require('./index.js');

const ret = justrequire('./test.ts');
console.log(ret);

const chalkesm = justrequire('chalk');

console.log(chalkesm);
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
```
