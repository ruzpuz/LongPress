(function () {

    'use strict';

    var defaultLongClickDuration = 500,
        longPressTimer,
        clickedElementHref,
        clickedElementCallback,
        clickedElement,
        clickedElementOrigin;

    /*  Utility functions   */
    function isInt(value) {
        var x;
        return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
    }
    function isString(element) {
        return (typeof element === 'string' || element instanceof String);
    }
    function isDomElement(element){
        return (
            typeof HTMLElement === "object" ? element instanceof HTMLElement : //DOM2
            element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName==="string"
        );
    }
    function isNodeList(nodes) {
        var stringRepr = Object.prototype.toString.call(nodes);

        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            (typeof nodes.length === 'number') &&
            (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
    }
    function arrayUnion(first, second) {
        var tmp = first.concat(second);
        function unique(item, pos) {
            return tmp.indexOf(item) === pos;
        }
        return tmp.filter(unique);
    }
    function createCallback(element, callback) {
        var error;
        if(callback && typeof callback !== 'function') {
            error = {
                "message": 'Callback is not a function',
                "expected": 'function',
                "got": {
                    "value": callback,
                    "type": typeof callback
                }
            };
            throw error;
        } else if(callback) {
            return callback;
        } else{
            if(element.hasAttribute('data-on-long-press')) {
                return new Function(element.getAttribute('data-on-long-press'));
            } else {
                error = {
                    "message": 'Callback not provided',
                    "expected": 'An expression in data-on-long-press attribute'
                };
                throw error;
            }
        }
    }
    function hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        }
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += " " + className;
        }
    }
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }
    function createCssClass() {
        var style = document.createElement('style');

        style.type = 'text/css';
        style.id = 'ng-long-press-style';
        style.innerHTML = '.ng-long-press {-webkit-touch-callout: none !important; user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; -webkit-user-select: none !important;}';

        if(!document.getElementById('ng-long-press-style')) {
            document.getElementsByTagName('head')[0].appendChild(style);
        }

    }

    /*  Functions that prevent default behavior of elements  */
    function drownEvent(event) {

        event.cancel=true;
        event.returnValue=false;
        event.cancelBubble=true;

        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) { event.preventDefault(); }

    }
    function returnHref() {
        if (clickedElementOrigin) {
            clickedElementOrigin.setAttribute('href', clickedElementHref);
        }
        clickedElementHref = null;
        clickedElementOrigin = null;
    }
    function removeHref() {
        if (clickedElementOrigin) {
            clickedElementHref = clickedElementOrigin.href;
            clickedElementOrigin.removeAttribute('href');
        }
    }
    function removeOnClick() {
        if (clickedElementOrigin) {
            clickedElementCallback = clickedElementOrigin.onclick;
            clickedElementOrigin.onclick = null;
        }
    }
    function returnOnClick() {
        if (clickedElementOrigin) {
            clickedElementOrigin.onclick = clickedElementCallback;
        }
    }

    /*  Event handling functions  */
    function longPressHappened() {
        if (clickedElementOrigin.tagName === 'A') {
            console.log(clickedElementOrigin)
            removeHref();
        } else if (clickedElementOrigin.onclick) {
            removeOnClick();
        }
        removeClass(document.body, 'ng-long-press');
        setTimeout(window.longPress.boundElements.callbacks[clickedElement.getAttribute('data-lnpr-id')].callback);
    }
    function clickEventStopped(event) {

        drownEvent(event);

        clickedElement.removeEventListener('mouseout', clickEventStopped);
        clickedElement.removeEventListener('mouseup', clickEventStopped);
        clickedElement.removeEventListener('touchend', clickEventStopped);
        clickedElement.removeEventListener('touchcancel', clickEventStopped);
        clickedElement.removeEventListener('touchmove', clickEventStopped);

        setTimeout(returnOnClick);
        setTimeout(returnHref);

        clearTimeout(longPressTimer);

        return false;
    }
    function clickEventStarted(event) {

        addClass(document.body, 'ng-long-press');
        clickedElement = this;
        clickedElementOrigin = event.target;
        drownEvent(event);

        longPressTimer = setTimeout(longPressHappened, window
            .longPress
            .boundElements
            .callbacks[clickedElement.getAttribute('data-lnpr-id')]
            .duration);

        clickedElement.addEventListener('mouseout', clickEventStopped);
        clickedElement.addEventListener('mouseup', clickEventStopped);
        clickedElement.addEventListener('touchend', clickEventStopped);
        clickedElement.addEventListener('touchcancel', clickEventStopped);
        clickedElement.addEventListener('touchmove', clickEventStopped);

        return false;
    }

    /*  Function that transforms any valid input to an array of DOMElements */
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
            throw error;
        }

        if(!element) {
           return Array.prototype.slice.call(document.querySelectorAll('[data-on-long-press]'));
        } else if (isString(element)) {
            return Array.prototype.slice.call(document.querySelectorAll(element));
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

    /*  Methods */
    function bind(element, callback, duration) {
        var elements = getDomElements(element),
            msecs = Date.now(),
            length = elements.length,
            i;

        for(i = 0; i < length; i += 1) {
            if(elements[i].hasAttribute('data-lnpr-id')) {
                window.longPress.boundElements.callbacks[elements[i].getAttribute('data-lnpr-id')] = {
                    "callback" : createCallback(elements[i], callback),
                    "duration" : isInt(duration) ? duration : window.longPress.defaultDuration
                };
            } else {
                elements[i].setAttribute('data-lnpr-id', msecs);
                window.longPress.boundElements.callbacks[msecs] = {
                    "callback" : createCallback(elements[i], callback),
                    "duration" : isInt(duration) ? duration : window.longPress.defaultDuration
                };
            }
            elements[i].removeEventListener('mousedown', clickEventStarted);
            elements[i].removeEventListener('touchstart', clickEventStarted);
            elements[i].addEventListener('mousedown', clickEventStarted);
            elements[i].addEventListener('touchstart', clickEventStarted);
        }
        window.longPress.boundElements.DOMElements = arrayUnion(window.longPress.boundElements.DOMElements, elements);
    }
    function unbind(element) {
        var elements = getDomElements(element),
            boundElementsLength = window.longPress.boundElements.DOMElements.length,
            elementsLength = elements.length,
            i, j;

        for(i = 0; i < elementsLength; i += 1) {
            for (j = 0; j < boundElementsLength; j += 1) {
                if (elements[i] === window.longPress.boundElements.DOMElements[j]) {
                    elements[i].removeEventListener('mousedown', clickEventStarted);
                    elements[i].removeEventListener('touchstart', clickEventStarted);
                    delete window.longPress.boundElements.callbacks[elements[i].getAttribute('data-lnpr-id')];
                    window.longPress.boundElements.DOMElements.splice(j,1);
                }
            }
        }
    }
    function setDefaultDuration(duration) {
        if(!isInt(duration)) {
            var error = {
                "message": 'Invalid argument',
                "expected": 'Integer',
                "got": {
                    "value": duration,
                    "type": typeof duration
                }
            };
            throw error;
        } else {
            window.longPress.defaultDuration = duration;
        }
    }

    /*  Constructor */
    function LongPress() {

        this.boundElements = { "DOMElements" : [], "callbacks": {} };
        this.defaultDuration = defaultLongClickDuration;

        this.bind = bind;
        this.unbind = unbind;
        this.setDefaultDuration = setDefaultDuration;

    }
    
    if(!window.longPress) {
        createCssClass();
        window.longPress =  new LongPress();
    }

}());