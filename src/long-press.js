(function () {

    'use strict';

    var defaultLongClickDuration = 500,
        longPressTimer,
        clickedElementHref,
        clickedElementCallback,
        clickedElementOrigin;

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
            console.log(error);
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
                console.log(error);
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

    function longPressHappened() {
        if (clickedElementOrigin.tagName === 'A') {
            removeHref();
        } else if (clickedElementOrigin.onclick) {
            removeOnClick();
        }
        removeClass(document.body, 'ng-long-press');
        setTimeout(window.longPress.boundElements.callbacks[clickedElementOrigin.getAttribute('data-lnpr-id')]);
    }
    function clickEventStopped(event) {

        drownEvent(event);

        clickedElementOrigin.removeEventListener('mouseout', clickEventStopped);
        clickedElementOrigin.removeEventListener('mouseup', clickEventStopped);
        clickedElementOrigin.removeEventListener('touchend', clickEventStopped);
        clickedElementOrigin.removeEventListener('touchcancel', clickEventStopped);
        clickedElementOrigin.removeEventListener('touchmove', clickEventStopped);

        setTimeout(returnOnClick);
        setTimeout(returnHref);

        clearTimeout(longPressTimer);

        return false;
    }
    function clickEventStarted(event) {

        addClass(document.body, 'ng-long-press');

        clickedElementOrigin = event.target;
        drownEvent(event);

        longPressTimer = setTimeout(longPressHappened, window.longPress.longClickDuration);

        clickedElementOrigin.addEventListener('mouseout', clickEventStopped);
        clickedElementOrigin.addEventListener('mouseup', clickEventStopped);
        clickedElementOrigin.addEventListener('touchend', clickEventStopped);
        clickedElementOrigin.addEventListener('touchcancel', clickEventStopped);
        clickedElementOrigin.addEventListener('touchmove', clickEventStopped);

        return false;
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

    function bind(element, callback) {
        var elements = getDomElements(element),
            msecs = Date.now(),
            length = elements.length,
            i;
        for(i = 0; i < length; i += 1) {
            if(elements[i].hasAttribute('data-lnpr-id')) {
                this.boundElements.callbacks[elements[i].getAttribute('data-lnpr-id')] = createCallback(elements[i], callback);
            } else {
                elements[i].setAttribute('data-lnpr-id', msecs);
                this.boundElements.callbacks[msecs] = createCallback(elements[i], callback);
            }
            elements[i].removeEventListener('mousedown', clickEventStarted);
            elements[i].removeEventListener('touchstart', clickEventStarted);
            elements[i].addEventListener('mousedown', clickEventStarted);
            elements[i].addEventListener('touchstart', clickEventStarted);
        }
        this.boundElements.DOMElements = arrayUnion(this.boundElements.DOMElements, elements);
    }
    function unbind(element) {
        var elements = getDomElements(element),
            boundElementsLength = this.boundElements.length,
            elementsLength = elements.length,
            i,
            j;

        for(i = 0; i < elementsLength; i += 1) {
            for (j = 0; j < boundElementsLength; j += 1) {

                if (elements[i] === this.boundElements[j]) {
                    this.boundElements.splice(j,1);
                }

            }
        }
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

        this.boundElements = { "DOMElements" : [], "callbacks": {} };
        this.longClickDuration = defaultLongClickDuration;

        this.bind = bind;
        this.unbind = unbind;
        this.setLongClickDuration = setLongClickDuration;

    }
    
    if(!window.longPress) {
        createCssClass();
        window.longPress =  new LongPress();
    }

}());