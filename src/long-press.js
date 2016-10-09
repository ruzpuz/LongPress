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

    function  drownEvent(event) {

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
        angular.element(document.body).removeClass('ng-long-press');
        $timeout(scope.callback);
    }
    function clickEventStopped(event) {

        drownEvent(event);

        domElem.removeEventListener('mouseout', clickEventStopped);
        domElem.removeEventListener('mouseup', clickEventStopped);
        domElem.removeEventListener('touchend', clickEventStopped);
        domElem.removeEventListener('touchcancel', clickEventStopped);
        domElem.removeEventListener('touchmove', clickEventStopped);

        $timeout(returnOnClick);
        $timeout(returnHref);

        $timeout.cancel(longPressTimer);

        return false;
    }
    function clickEventStarted(event) {
        angular.element(document.body).addClass('ng-long-press');

        clickedElementOrigin = event.target;
        drownEvent(event);

        longPressTimer = $timeout(longPressHappened, length);

        domElem.addEventListener('mouseout', clickEventStopped);
        domElem.addEventListener('mouseup', clickEventStopped);
        domElem.addEventListener('touchend', clickEventStopped);
        domElem.addEventListener('touchcancel', clickEventStopped);
        domElem.addEventListener('touchmove', clickEventStopped);

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
            throw new Error(error);
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

    function bind(element) {
        var elements = getDomElements(element);
        this.boundElements = arrayUnion(this.boundElements, elements);

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         *  We will create hash from element - and fetch callback with it.
         * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        console.log(elements);
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

        this.boundElements = [];
        this.longClickDuration = defaultLongClickDuration;

        this.bind = bind;
        this.unbind = unbind;
        this.setLongClickDuration = setLongClickDuration;

    }
    
    if(!window.longPress) {
        window.longPress =  new LongPress();
    }

}());