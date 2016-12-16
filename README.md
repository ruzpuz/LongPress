# LongPress

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/28022089c92448b1b0ec22043bbcd1ec)](https://www.codacy.com/app/ruzic-vladimir/LongPress?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ruzpuz/LongPress&amp;utm_campaign=badger)

Handle long press events on HTML elements

##How to use it
- Install it 
    
    
        bower install LongPress
    
    
Including the library will create a global object __**longPress**__ 

longPress methods
 
 - bind()
 - unbind()
 - setDefaultDuration()
 
## Examples
longPress.bind() can accept 3 arguments. If no arguments are provided library will locate all html elements with __data-on-long-press__ tag in it. In that case the callback should be provided in __data-on-long-press__ tag. 

            <div data-on-long-press="alert('long-press')">

First argument represents elements that should have long press possibilities. It can be a query, array of DOM Elements or NodeList.
Second argument is a callback. If no callback is provided library will try to construct a function with what is provided in __data-on-long-press__ tag.
Third argument is a long press duration in milliseconds. If no duration is provided default one will be used.

    longPress.bind(document.querySelector('#normal-1500'), 
                    null, 
                    1500);
    longPress.bind(document.querySelectorAll('.things-inside'), 
                    function() { alert('long-press'); },
                    500);

longPress.unbind() accepts one optional argument. It can be a query, array of DOM Elements or NodeList. If nothing is provided then all listeners will be freed. 

    longPress.unbind(document.querySelector('#normal-1500'));
    longPress.unbind();

longPress.setDefaultDuration(milliseconds) accepts new default long press duration.

## Disadvantages

While active this library will try to prevent context menu (important feature of mobile browsers) from opening. 
That means that text inside the tag might not be easily selectable 
on mobile browsers. It is a bad idea to use this library on huge content.
