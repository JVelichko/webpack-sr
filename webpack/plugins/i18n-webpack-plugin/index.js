const path = require('path');

const Resolver = require('./html-resolver');
const Translate = require('./translate');

const plugin_name = 'i18n-webpack-plugin';

//-- Check and init plugin options --/
const initOptions = (options, initial, required) => {
  required.forEach(req => {
    if (!Object.keys(options).includes(req)) throw new Error(`Required option '${req}' has not been provided`);
  });
  return Object.assign(initial, options);
};

class I18nWebpackPlugin {
  constructor(options) {
    this.config = initOptions(options, { template: './[name]/[locale]/index.html' }, ['locales', 'template']); // Init options
    this.resolver = new Resolver(this.config.template);
    this.htmls = [];
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(plugin_name, compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
        plugin_name,
        data => {
          const name = path.basename(data.plugin.options.filename, '.html');
          const html = data.html;
          const pathOne = data.plugin.options.filename.split('.')[0];
          const translate = new Translate(this.config.locales);
          this.htmls.push(...this.resolver.resolve(name, html, translate, pathOne));
          return data;
        }
      );
    });

    compiler.hooks.emit.tap(plugin_name, compilation => {
      Object.keys(compilation.assets)
        .filter(filename => !!filename.match(/[\d\w]*.html$/))
        .forEach(filename => delete compilation.assets[filename]);
      this.htmls.forEach(html => compilation.assets[html.path] = {
        source: () => html.content,
        size: () => html.content.length
      });
    });
  }
}

module.exports = I18nWebpackPlugin;
