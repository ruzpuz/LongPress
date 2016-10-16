(function () {
    'use strict';

   try{
       longPress.bind(document.querySelector('#normal-1500'), null, 1500);
       longPress.bind(document.querySelector('#normal-500'), null, 500);
       longPress.bind(document.querySelector('.things-inside'), function() { alert('long-press'); }, 500);
    } catch (e) {
        console.log(e)
    }
    console.log(longPress);

}());