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
    function isNodeList(element) {
        console.log(typeof element.length === 'number'
            && typeof element.item !== 'undefined'
            && typeof element.nextNode === 'function'
            && typeof element.reset === 'function');

        return (typeof element.length == 'number'
        && typeof element.item == 'function'
        && typeof element.nextNode == 'function'
        && typeof element.reset == 'function');
    }

    function getDomElements(element) {

        function throwError(details) {
            var error = {
                "message": 'Invalid arguments',
                "expected": ['DOM element', '[DOM element]', 'String', 'undefined/null'],
                "got": {
                    "value": element,
                    "type": typeof element
                }
            };
            details ? error.got.details = details : {};
            console.log(error);
            throw new Error(error);
        }

        console.log(Array.prototype.slice.call(element))
        if(!element) {
            /* TODO
             *  Should search for all elements with data-on-long-press attribute and try to eval
             * */
            Array.prototype.slice.call(document.querySelectorAll('[data-on-long-press]'));
        } else if (isString(element)) {
            return document.querySelectorAll(element);
        } else if(isNodeList(element)) {
            return Array.prototype.slice.call(element);
        } else if(Array.isArray(element)) {

            var length = element.length,
                i;

            for(i = 0; i < length; i += 1) {
                if(!isDomElement(element[i])) {
                    throwError({
                        "message" : 'At least one element in the array is not DOM element.',
                        "firstInvalidElement" : element[i]
                    });
                }
            }
            return Array.prototype.slice.call(element);

        } else if (isDomElement(element)) {
            return [element];
        } else {
            throwError();
        }

    }

    function bind(element) {
        var elements = getDomElements(element);
        console.log(elements[0])
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