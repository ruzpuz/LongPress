(function () {
    'use strict';

    longPress.setLongClickDuration(1500);
    try{longPress.bind()} catch (e) {
        console.log(e)
    }
    console.log(longPress);
}());