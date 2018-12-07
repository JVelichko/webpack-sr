const pug = require('pug');
const path = require('path');
const wrap = require('pug-runtime/wrap');

const escapeTemplate = '__WEB_ESC__';

const winEscape = path => path.split('\\').join('\\\\');

const createEscaping = path => path.replace(/^[`'"]/g, '$&' + escapeTemplate).replace(/[`'"]$/g, escapeTemplate + '$&');

const findCloseBracket = (source, from, level = 0) => {
  const start = source.indexOf('(', from);
  const end = source.indexOf(')', from);
  if (!!~start && start < end) return findCloseBracket(source, start + 1, level + 1);
  else return level - 1 > 0 ? findCloseBracket(source, end + 1, level - 1) : end;
};

const getRequirements = (source, start = 0) => {
  const startIndex = source.indexOf('require(', start + 1);
  const endIndex = findCloseBracket(source, startIndex + 1);
  return !!~startIndex
    ? [source.slice(startIndex, endIndex + 1)].reduce((acc, src) => [...acc, src], getRequirements(source, endIndex)) : []
};

const removeRequire = text => {
  const find = text.indexOf('require', 0);
  return (text.slice(0, find) + text.slice(find + 'require'.length, text.length)).trim().slice(1, -1).trim();
};

const escapeDependencies = source => {
  let resolved = source;
  const resolving = getRequirements(source);
  if (resolving) resolving.forEach(item => resolved = resolved.replace(item, createEscaping(removeRequire(item))));
  return resolved;
};

const resolveDependencies = (html, context, callback) => {
  const requires = {};
  const promises = [];

  let resolved = html;

  const resolving = resolved.match(new RegExp(`${escapeTemplate}(.*?)${escapeTemplate}`, 'g'));
  if (!resolving) return callback(null, resolved);

  resolving.forEach(item => requires[item] = item.replace(new RegExp(escapeTemplate, 'g'), '').trim());

  Object.keys(requires).forEach(key => {
    promises.push(new Promise((resolve, reject) => {
      context.resolve(context.context, requires[key], (err, res) => {
        if (err) reject(err);
        else {
          const relative = path.relative(context.context, res);
          resolved = resolved.replace(new RegExp(key.replace(/(\(\))/, '\\$&'), 'g'), `${winEscape(relative)}`);
          context.addDependency(winEscape(res));
          resolve();
        }
      });
    }));
  });

  Promise.all(promises).then(() => callback(null, resolved), err => callback(err)).catch(err => callback(err));
};

module.exports = function(source) {
  const callback = this.async();

  const compiled = pug.compileClientWithDependenciesTracked(source, {
    filename: this.resource,
    pretty: true,
    inlineRuntimeFunctions: false
  });

  compiled.dependencies && compiled.dependencies.forEach(this.addDependency.bind(this));
  const html = wrap(escapeDependencies(compiled.body))();
  resolveDependencies(html, this, (err, res) => err ? callback(err) : callback(null, res));
};