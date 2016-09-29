(function () {
    'use strict';

    var defaultLongClickDuration = 500;

    function isInt(value) {
        var x;
        return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
    }
    function isString(element) {
        return (typeof element === 'string' || element instanceof String)
    }
    function isDomElement(element){
        return (
            typeof HTMLElement === "object" ? element instanceof HTMLElement : //DOM2
            element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName==="string"
        );
    }
    function getDomElements(element) {
        if(!element) {
            /* TODO
             *  Should search for all elements with data-on-long-press attribute and try to eval
             * */
            console.log('search')
            return document.querySelectorAll('[data-on-long-press]')
        } else if (isString(element)) {
            console.log('string')
        } else if (isDomElement(element)) {
            console.log('dom element')
        } else {
            var error = {
                "message": 'Invalid arguments',
                "expected": ['DOM element', '[DOM element]', 'String', 'undefined/null'],
                "got": {
                    "value": element,
                    "type": typeof element
                }
            };
            console.log(error);
            throw new Error(error);
        }
    }

    function bind(element) {
        var elements = getDomElements(element);
        console.log(elements)
    }
    function unbind() {

    }
    function setLongClickDuration(duration) {
        if(!isInt(duration)) {
            var error = {
                "message": 'Invalid argument',
                "expected": 'Integer',
                "got": {
                    "value": duration,
                    "type": typeof duration
                }
            };
            console.log(error);
            throw error;
        } else {
            this.longClickDuration = duration;
        }
    }
    function LongPress() {

        this.boundElements = [];
        this.longClickDuration = defaultLongClickDuration;

        this.bind = bind;
        this.unbind = unbind;
        this.setLongClickDuration = setLongClickDuration;

    }
    
    if(!window.longPress) {
        window.longPress =  new LongPress;
    }

}());