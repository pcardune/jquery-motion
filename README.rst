=============
jQuery Motion
=============

The jQuery motion plugin makes it easy to animate arbitrarily complex
dom manipulation.

For example, let's say you want to move several list items from one
unordered list to another - maybe for adding products to a shopping cart.
You might write a javascript function with jQuery that looks like
this::

  function addItemsToShoppingCart(){
    $("#items li.selected").appendTo("#shopping-cart");
  }

Which gets executed when a user pushes a button::

  $("#add-to-cart").click(addItemsToShoppingCart);

With the jQuery motion plugin, you can make the selected items move
gracefully into the shopping cart without having to change your
existing dom manipulation code.  Using motion it would look like
this::

  $("#add-to-cart").click(
    function(){
      $("#items li,#shopping-cart li").motion(addItemsToShoppingCart);
    });

Or in a more concise form::

  $("#add-to-cart").click($("#items li,#shopping-cart li").withMotion(addItemsToShoppingCart));


In Depth Overview
-----------------

Motion works by taking a snapshot of the DOM before and after it has
been manipulated, keeping track of the positions of all the DOM
elements being moved.  Using absolute positioning, the DOM elements
are then "moved" from their old location to their new location on the
page.

Provided Functions
..................

- **motion**

   Animate the selected elements using the given DOM
   manipulation function.

  - *arguments:*

    - **mover** - A function that performs some DOM manipulation.

    - **speed** - The speed of the animation.  This can be any value
      accepted by jQuery.animate. (i.e. "slow", "medium", "fast")

    - **callback** - A function to call once all animations have
        completed.

    - **spacerClass** - A css class to be added to spacer elements.
        Defaults to ``__spacer__``.  Spacer elements are used to
        maintain the size and shape of the original location of an
        animated dom element while the animation is taking place.

    - **maxEffected** - The maximum number of elements that should be
        animated.  If more than this number of elements are selected,
        then animations will be turned off.  Animating too many
        elements can slow down the browser.  Defaults to 100.

    These arguments can be passed in sequentially like so::

      $(".effected").motion(mover, speed, callback, spacerClass, maxEffected);

    or as a JavaScript object like so::

      $(".effected").motion({mover:someFunc,
                             speed:"slow",
                             maxEffected:50});

- **withMotion**

    Return a function for use with event handlers that
    just calls the ``motion`` function.  This takes all the same
    arguments as the ``motion`` function.  For example::

      $("#some-button").click($(".effected").withMotion(someMoverFunc));