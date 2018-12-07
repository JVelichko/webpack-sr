const I18n = require('i18n-js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class Resolver {
  constructor(filename) {
    this.filename = filename;
  }

  resolve(name, html, translate, one) {
    I18n.translations = translate.getTranslations(name);

    return translate.getLocales(name).map(locale => {
      I18n.locale = locale;
      const dom = new JSDOM(html);

      const elements = [...dom.window.document.querySelectorAll('[t]')];
      elements.forEach(element => {
        element.innerHTML = I18n.t(element.getAttribute('t'));
        element.removeAttribute('t');
      });
      one = one == 'index' ? '' : one;
      const path = this.filename
        .replace('[locale]', locale)
        .replace('[name]', one);

      return {content: dom.serialize(), path};
    });
  }
}

module.exports = Resolver;
