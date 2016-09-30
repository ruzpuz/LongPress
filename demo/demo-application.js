(function () {
    'use strict';

    longPress.setLongClickDuration(1500);

    try{longPress.bind(document.querySelectorAll('[data-on-long-press]'))} catch (e) {
        console.log(e)
    }
    console.log(longPress);
}());