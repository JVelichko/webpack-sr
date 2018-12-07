import { qs, qsa } from '../tools/helpers.js';
import { forEach } from 'ramda';

const scrollToLink = el => {
    let targetId = el.getAttribute('scroll-to');

    el.addEventListener('click', () => scrollToItem(qs(targetId)));
}

function scrollToItem(item) {
    const diff = (item.offsetTop-window.scrollY)/8;

    if (Math.abs(diff)>1) {
        if (window.pageYOffset >= document.body.offsetHeight - window.innerHeight) {
            clearTimeout(window._TO);
        } else {
            window.scrollTo(0, (window.scrollY+diff));
            clearTimeout(window._TO);
            window._TO=setTimeout(scrollToItem, 10, item);
        }
    }
}

forEach(scrollToLink, qsa('[scroll-to]'));
