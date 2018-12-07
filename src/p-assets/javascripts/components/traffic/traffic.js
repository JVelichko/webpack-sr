import { setCookie, getCookie } from 'javascripts/tools/cookies.js';
import { getLocale } from 'javascripts/tools/get-locale.js';

const setCookies = (function(setCookie) {
    return function(name, value, options) {
        options = options || {};
        options.domain = `.${document.domain}`;
        return setCookie.call(null, name, value, options);
    }
})(setCookie);

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

TrafficRegister().initialize();

function TrafficRegister() {
    var platformLang = getLocale();
    var model = {};
    var fields = {
        a        : {name: 'a',      def: ''},
        ac       : {name: 'ac',     def: ''},
        sa       : {name: 'sa',     def: ''},
        site_id  : {name: 's',      def: ''},
        click_id : {name: 'c',      def: ''},
        r        : {name: 'r',      def: document.referrer},
        e        : {name: 'e',      def: 'visit'},
        u        : {name: 'u',      def: '', value: getUserID},
        l        : {name: 'l',      def: '', value: getLandingID},
        p        : {name: 'p',      def: 1},
        t        : {name: 't',      def: '0'},
        locale   : {name: 'locale', def: document.querySelector('html').getAttribute('lang')},
    };
    var safe = ['a', 'ac', 'sa', 's', 'c', 'l', 't'];
    var rules = [
        {field: 'a', validator: 'compare', value: getCookie('a'), result: false},
    ];

    var validators = {
        compare: compareValidator,
    };
    var service = {
        initialize: initialize,
    };

    return service;

    function initialize() {
        if (!getQueryParam('a')) {
            fillPredefined();
        } else {
            fillModel();
            if (validate()) {
                save();
            }
        }

        fillDefault();
        generate();
        setLandingCookie(model);
        setAdcomboCookie();
    }

    function fillModel() {
        for (var key in fields) {
            if (fields.hasOwnProperty(key)) {
                var field = fields[key];
                model[field.name] = getQueryParam(key);
            }
        }
    }

    function fillDefault() {
        for (var key in fields) {
            if (fields.hasOwnProperty(key)) {
                var field = fields[key];
                if (field.value) {
                    model[field.name] = field.value(model[field.name]);
                }
                if (model[field.name]) continue;

                model[field.name] = field.def;
            }
        }
    }

    function fillPredefined() {
        var field;
        for (var key in safe) {
            if (safe.hasOwnProperty(key)) {
                if (safe[key] == 's')
                    field = fields.site_id;
                else if (safe[key] == 'c')
                    field = fields.click_id;
                else
                    field = fields[safe[key]];
                model[field.name] = getCookie(safe[key]);
            }
        }
    }

    function validate() {
        var valid = false;
        rules.forEach(function (rule) {
            if (validators[rule.validator](rule)) valid = true;
        });
        return valid;
    }

    function save() {
        var now = new Date();
        var exp = new Date(now.getFullYear() + 20, now.getMonth(), now.getDate());
        for (var key in model) {
            if (model.hasOwnProperty(key) && safe.indexOf(key) + 1 > 0) {
                var val = model[key];
                if (val === null || val === undefined) {
                    continue;
                }
                if (key == 'a' && fields[key].def == val && getCookie(key)) continue;
                setCookies(key, val, {expires: exp, path: '/'});
            }
        }
    }

    function generate() {
        if (document.referrer.includes(document.domain)) return;
        var script = document.createElement('script');
        var url = 'https://binstats.com';
        var str = '';
        for (var key in model) {
            if (str !== '') {
                str += '&';
            }
            str += key + '=' + encodeURIComponent(model[key]);
        }
        script.setAttribute('src', [url, str].join('?'));
        document.head.appendChild(script);
    }

    function compareValidator(rule) {
        var field = rule.field;
        var value = rule.value;
        var result = rule.result;
        if (!model[field]) return false;
        return (model[field] == value) == result;
    }

    function getUserID() {
        const data = JSON.parse(
            document.body.getAttribute('data-config')
        );
        return data ? (data.id ? data.id : null) : null;
    }

    function getLandingID() {
        var matches = pathname().match(new RegExp('/promo/l[0-9]+'));
        return matches ? matches[0].substr(7) : null;
    }
}

function getQueryParam(name) {
    return decodeURIComponent((new RegExp('[?&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(search())||[undefined, ''])[1].replace(/\+/g, '%20'))||null;
}

function location() {
    var matches = document.location.href.match(new RegExp(/\/promo\/registration(_new|_test)?(\?|$)/));
    return window.location != window.parent.location && !matches ? document.referrer : document.location.href;
}

function pathname() {
    return location().split('?')[0].replace(/https*:\/\/[^\/]+/i, '');
}

function search() {
    return '?' + (location().split('?')[1] || '');
}

// function setCookie(name, value, options) {
//     options = options || {};
//     options.domain = '.' + document.domain;

//     var expires = options.expires;

//     if (typeof expires == 'number' && expires) {
//         var d = new Date();
//         d.setTime(d.getTime() + expires * 1000);
//         expires = options.expires = d;
//     }
//     if (expires && expires.toUTCString) {
//         options.expires = expires.toUTCString();
//     }

//     value = encodeURIComponent(value);

//     var updatedCookie = name + '=' + value;

//     for (var propName in options) {
//         updatedCookie += '; ' + propName;
//         var propValue = options[propName];
//         if (propValue !== true) {
//             updatedCookie += '=' + propValue;
//         }
//     }

//     document.cookie = updatedCookie;
// }

function setAdcomboCookie(){
    var adcomboCookieName = 'ref.929a9991f7ee.group';
    var now = new Date();
    var exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    if(!getCookie(adcomboCookieName)) {
        setCookies(
            adcomboCookieName,
            Math.floor(Math.random() * 5) + 1,
            {expires: exp, path: '/'}
        );
    }

}

function setLandingCookie(model) {
    var now = new Date();
    var exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    setCookies(
        'l',
        model.l,
        {expires: exp, path: '/'}
    );
}
