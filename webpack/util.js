const fs = require('fs');
const path = require('path');

const development = !!process.env.DEV;

const filePath = (path, ext = '.[ext]') => development ? `${path}${ext}` : `${path}-[hash:5]${ext}`;

const getAliases = () => {
  const root = path.resolve(__dirname, '../src/p-assets/');
  const assets = fs.readdirSync(root);
  return assets.reduce((acc, asset) => ({...acc, [asset]: path.join(root, asset)}), {});
};

module.exports = {
  filePath,
  getAliases,
};
