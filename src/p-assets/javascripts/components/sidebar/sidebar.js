import { qs, qsa, hasClass } from 'javascripts/tools/helpers.js';
import { forEach } from 'ramda';

// toggle active sidebars
const buttons = qsa('button[sidebar-control]');
const sidebars = qsa('.sidebar');

forEach(button => { 
            const target = button.getAttribute('sidebar-control'); 
            button.addEventListener('click', () => activeSidebar(target));
        }, buttons);

function activeSidebar(t) {
    const currSidebar = qs(`#${t}`);
    const sidebar = s => {
        if (hasClass(s, 'active')) {
            s.classList.remove('active')
        }
    }

    currSidebar.classList.toggle('active');
    sidebars.splice(sidebars.indexOf(currSidebar), 1)

    forEach(sidebar => {
        if (hasClass(sidebar, 'active')) {
                sidebar.classList.remove('active')
            }
        }, sidebars)

    sidebars.push(currSidebar);
}

window.addEventListener('click', () => {checkOutClick(event)});

function checkOutClick(event) {
    if (!event.target.closest('.sidebar.active') && buttons.indexOf(event.target) < 0 && qs('.sidebar.active') != null) {
        qs('.sidebar.active').classList.toggle('active');
    }
}
