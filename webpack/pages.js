const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Blacklist
const blacklist = getBlacklist();

// Root folder of lands
const root = path.resolve(__dirname, '../src/landings');
const src = path.resolve(__dirname, '../src');
// Getting list of lands
const lands = fs.readdirSync(root).filter(file => !blacklist.includes(file));

// Generation entries
const paths = lands.reduce((acc, land) => ({ ...acc, [land]: path.join(root, land) }), {});

// Generation templates
const templates = lands.map(name => new HtmlWebpackPlugin({
  template: `./landings/${name}/index.pug`,         // Source
  filename: `${name}.html`,                         // Output
  emitFile: false,
  chunks: [name, 'main'],
}));


function checkInner(item, outArray){
  const source = path.join(root, item);
  const arrDirs = fs.readdirSync(source);
  const isDirectory = source => fs.lstatSync(source).isDirectory();
  const filtred = arrDirs.map(name => path.join(source, name)).filter(isDirectory);
  if (filtred.length) {
    if (filtred.length > 1) {
      filtred.forEach(i => {
        outArray.push(i.split('landings/')[1]);
      });
    } else {
      outArray.push(filtred[0].split('landings/')[1]);
    }
  }
}

const outArr = [];
lands.forEach(pageNem => {
  checkInner(pageNem, outArr);
});

const mainArr = ['main'];
const mainPath = {['main']: path.join(src, 'index.html') };
const mainTemp = [new HtmlWebpackPlugin({
  template: `./index.pug`, 
  filename: `index.html`, 
  emitFile: false,
  chunks: ['main'],
})];

// templates
const landswithopt = outArr.map(name => new HtmlWebpackPlugin({
  template: `./landings/${name}/index.pug`,         // Source
  filename: `${name}.html`,                         // Output
  emitFile: false,
  chunks: [name, 'main'],
}))
// Paths
const landswithoptPath = outArr.reduce((acc, page) => ({ ...acc, [page]: path.join(root, page) }), {});


//console.log("GERARAR HERE", outArr);



module.exports = {
  mainArr, mainPath, mainTemp,
  lands, paths, templates,
  outArr, landswithoptPath, landswithopt,
};

function getBlacklist() {
  const configPath = path.resolve(__dirname, '../black.list');
  if (fs.existsSync(configPath)) {
    const loaded = fs.readFileSync(configPath, { encoding: 'utf8' });
    if (loaded) return loaded.split(/\n/).filter(name => !name.startsWith('#'));
  }
  console.log('Landings configuration file not found!');
}
