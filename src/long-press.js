(function () {

    function  isString(element) {
        return (typeof element === 'string' || element instanceof String)
    }

    function LongPressConstructor(element) {
        if(!element) {
            /* TODO default constructor
            *  Should search for all elements with data-on-long-press attribute and try to eval
            * */
        } else if (isString(element)) {

        }
    }
    var  LongPress = window.LongPress || (window.LongPress = LongPressConstructor);

}());
