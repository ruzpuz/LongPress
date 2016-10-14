(function () {
    'use strict';
    longPress.bind(document.querySelector('#second'), null, 500);

   /* try{
        //longPress.bind(document.querySelector('#second'));
        console.log(longPress)
    } catch (e) {
        console.log(e)
    }*/
    longPress.unbind(document.querySelector('#second'));
    console.log(longPress);

}());