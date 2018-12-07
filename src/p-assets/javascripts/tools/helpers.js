// export function qs() {
//     return document.querySelector(...arguments);
// }

export function qs(el, parent = document) {
    return parent.querySelector(el);
}

export function qsa() {
    return [...document.querySelectorAll(...arguments)];
}

export function hasClass(el, className) {
    return [...el.classList].indexOf(className) >= 0;
}
