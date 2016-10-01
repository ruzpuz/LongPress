(function () {
    'use strict';

    longPress.setLongClickDuration(1500);

    try{
        longPress.bind(document.querySelector('div'));
    } catch (e) {
        console.log(e)
    }
    console.log(longPress);
}());