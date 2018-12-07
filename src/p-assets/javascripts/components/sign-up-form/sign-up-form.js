import { qs, qsa } from '../../tools/helpers.js';
import { api, config, getSignUpUrl } from '../api-config/api-config.js';
import { recaptcha } from '../recaptcha/recaptcha.js';

import { forEach } from 'ramda';
import { setCookie } from '../../tools/cookies.js';
import { plusToDate } from '../../tools/plusDate.js'
import { redirectToTrading } from '../../tools/redirectTo';

// TODO после того, как закинут в consul путь - 
// уберу. сейчас нет смысла красиво делать
const devPath = 'binomo.loc';
const basePath = (process.env.NODE_ENV === 'production') ? `${location.origin}/api` : `${location.protocol}//${devPath}/api`;


api(() => {
  formInit();
});

function formInit() {
    const forms = qsa('[name=signUp]');
    const url = getSignUpUrl(config.device_id, basePath);

    forEach(form => {
                nameToPlaceholder(form);
                initCurrencies(qs('.currency-block.currency-inner', form), config.currencies);
                qs('.sign-up-btn', form).addEventListener('click', () => sendForm(url, form))
            }, forms);
}

// shitty trick for form
// name of input in to placeholders for all forms
// need TODO translate (t="...") not only in innerHTML
function nameToPlaceholder(form) {
    const emailTitle = qs('label.email .form-title', form);
    const passwTitle = qs('label.password .form-title', form);
    qs('input[name=email]', form).setAttribute('placeholder', emailTitle.innerHTML);
    qs('input[name=password]', form).setAttribute('placeholder', passwTitle.innerHTML);
}

function initCurrencies(container, currencies) {
    const template = container.children[0].cloneNode(true);
    const currency = curr => {
        const rendered = template.cloneNode(true);
        qs('input', rendered).checked = currencies.default === curr.iso;
        qs('.decorator span', rendered).innerHTML = curr.unit;
        qs('input', rendered).value = curr.iso;
        container.appendChild(rendered);
    }

    container.innerHTML = '';
    forEach(currency, currencies.list);
}

function sendForm(url, form) {
    fetch(url, {
        method: 'POST',
        body: new FormData(form),
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            const checkIagree = qs('input:checked', qs('label.i_agree', form));

            setCookie('agreed', !!checkIagree, {
                expires: plusToDate(new Date(), 100, 'year'),
                path: '/',
            });
            setCookie('isFirstSession', true, {
                expires: plusToDate(new Date(), 1, 'hour'),
                path: '/',
            });
            redirectToTrading();
        } else {
            showErrors(response.errors, form);
            resetForm(form);
        };
    }).catch(error => console.error('!!!>>>>>', error));
}

function showErrors(errors, form) {
    const error = err => {
        const label = qs(`label.${err.field}`, form);
        const tooltip = qs('.tooltip', label);

        tooltip.classList.add('active');
        qs('.tooltip-inner', tooltip).innerHTML = err.message;

        if (err.field == 'g-recaptcha-response') {
            recaptcha(form);

            if (err.code == 'invalid') {
                grecaptcha.reset()
            };
        };
    };

    forEach(error, errors);
}

function resetForm(form) {
    const labels = [...form.querySelectorAll('label.focus-helper')];

    forEach(label => {
        const tooltip = qs('.tooltip', label);

        label.addEventListener('click', () => {
            tooltip.classList.remove('active');
            qs('.tooltip-inner', tooltip).innerHTML = '';
        });
    }, labels);
}
