(function($){
     $.fn.withMotion = function(mover, speed, callback, spacerClass, maxEffected){
         var that = this;
         return function(){
             $(that).motion(mover, speed, callback, spacerClass, maxEffected);
         };
     };

     $.fn.motion = function(mover, speed, callback, spacerClass, maxEffected){
         var config = {
             spacerClass: "__spacer__",
             callback: $.noop || function(){},
             maxEffected: 100,
             speed: "medium"
         };
         if ($.isFunction(mover)){
             $.extend(
                 config,
                 {
                     mover: mover,
                     callback: callback,
                     spacerClass: spacerClass,
                     maxEffected: maxEffected
                 });
         } else {
             $.extend(config,mover);
         }
         var effected = this;
         if (effected.length > config.maxEffected){
             config.mover.call(this);
             config.callback();
             return;
         }
         // step 1: go through effected elements and save their current position.
         effected.each(
             function(){
                 $.data(this, "fromPosition", $(this).offset());
             });

         config.mover.call(this);

         var animating = 0;
         var spacers = [];
         function check(){
             if (animating === 0){
                 effected.css({position:'', left:'', top:''});
                 for (var i=0,ii=spacers.length; i<ii; i++){
                     spacers[i].remove();
                 }
                 config.callback();
             }
         }
         var docViewTop = $(window).scrollTop();
         var docViewBottom = docViewTop + $(window).height();
         effected.each(
             function(){
                 // save new position of effected element
                 var $this = $(this);
                 var toPosition = $this.offset();
                 var fromPosition = $.data(this, "fromPosition");
                 if (!toPosition || !fromPosition){
                     // probably removed
                     return;
                 }
                 /**
                  * animate the effected element.  This will automatically skip over elements which:
                  *  a) have not actually moved
                  *  b) are not within the viewable window space.
                  */
                 if ((fromPosition.top != toPosition.top || fromPosition.left != toPosition.left) &&
                     ((fromPosition.top < docViewBottom && fromPosition.top >= docViewTop) ||
                      (toPosition.top < docViewBottom && toPosition.top >= docViewTop))){


                     // add spacers for effected element
                     var spacer = $('<'+this.tagName+' class="'+this.className+' '+config.spacerClass+'">'
                                    + '</'+this.tagName+'>')
                         .css(
                             {
                                 height: $this.height(),
                                 width: $this.width()
                             });
                     spacers.push(spacer);
                     $this.after(spacer);

                     $this.css({position:'absolute',
                                top:fromPosition.top+"px",
                                left:fromPosition.left+"px"});
                     $this.animate(
                         {
                             top:toPosition.top+"px",
                             left:toPosition.left+"px"
                         },
                         config.speed,
                         function(){
                             animating--;
                             check();
                         });
                     animating++;
                 }
             });
     };

 })(jQuery);
