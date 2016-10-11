(function () {
    'use strict';

    longPress.setLongClickDuration(1500);

    try{
        longPress.bind(document.querySelector('#second'));
        console.log(longPress)
    } catch (e) {
        console.log(e)
    }
}());