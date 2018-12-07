const setCookie = (name, val, options = {}) => {
    const value = encodeURIComponent(val);
    let expires = options.expires;
    let updatedCookie = `${name}=${value}`;

    const type = obj => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    const isNumber = val => type(val) == 'number';

    if (isNumber(expires) && expires) {
        const date = new Date();

        date.setTime(date.getTime() + expires * 1000);
        expires = options.expires = date;
    }

    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    for (const propName in options) {
        updatedCookie += `; ${propName}`;
        const propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += `=${propValue}`;
        }
    }
    document.cookie = updatedCookie;
};

const getCookie = name => {
    const matches = document.cookie.match(new RegExp(
        `(?:^|; )${name.replace(/([\\.$?*|{}\\(\\)\\[\\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches && decodeURIComponent(matches[1]);
};

const removeCookie = (name, options = {}) => {
    setCookie(name, '', { expires: -1, ...options })
};

export { setCookie, getCookie, removeCookie };
