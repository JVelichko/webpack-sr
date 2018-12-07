import { qs } from 'javascripts/tools/helpers.js';

export function popupOpen(classNamePopup) {
    const popup = qs(`.popup.${classNamePopup}`);
    popup.classList.add('active');
    popupClose();
}

function cleanListnerAfterClose(activePopup) {
    activePopup.classList.remove('active'); 
    activePopup.removeEventListener('click', activePopup.classList.remove('active'))
}

function popupClose() {
    const activePopup = qs('.popup.active');
    const closeButton = qs('.popup.active .close');
    activePopup.addEventListener('click', (event) => {
        if (!event.target.closest(".form-wrapper"))
            cleanListnerAfterClose(activePopup)
    });
    closeButton.addEventListener('click', () => { cleanListnerAfterClose(activePopup)});
}