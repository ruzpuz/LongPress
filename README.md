# LongPress
Handle long press events on HTML elements

##How to use it
- Install it 
    
~~bower install long-press~~ (soon)

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

    longPress.bind(document.querySelector('#normal-1500'), null, 1500);
    longPress.bind(document.querySelectorAll('.things-inside'), function() { alert('long-press'); }, 500);


## Disadvantages

While active this directive tries to prevent context menu from opening. 
That means that text inside directive might not be easily selectable 
on mobile browsers. It is a bad idea to put this directive on huge content.
