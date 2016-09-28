(function () {

    function  isString(element) {
        return (typeof element === 'string' || element instanceof String)
    }
    function isDomElement(element){
        return (
            typeof HTMLElement === "object" ? element instanceof HTMLElement : //DOM2
            element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName==="string"
        );
    }

    function bind(element) {
        this.testNumber = 20;
        if(!element) {
            /* TODO
             *  Should search for all elements with data-on-long-press attribute and try to eval
             * */
            console.log('search')
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
            console.error(error);
            throw error;
        }
    }
    function unbind() {

    }
    function LongPress() {
        this.boundElements = [];
        this.bind = bind;
        this.unbind = unbind;
    }


    if(!window.longPress) {
        window.longPress =  new LongPress;
    }

}());