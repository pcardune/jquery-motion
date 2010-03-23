(function($){
     $.fn.motion = function(mover, callback, spacerClass, maxAffected){
         var config = {
             spacerClass: "__spacer__",
             callback: $.noop || function(){},
             maxAffected: 100
         };
         if ($.isFunction(mover)){
             $.extend(
                 config,
                 {
                     mover: mover,
                     callback: callback,
                     spacerClass: spacerClass,
                     maxAffected: maxAffected
                 });
         } else {
             $.extend(config,mover);
         }
         var affected = this;
         if (affected.length > config.maxAffected){
             config.mover.call(this);
             config.callback();
             return;
         }
         // step 1: go through affected elements and save their current position.
         affected.each(
             function(){
                 $.data(this, "fromPosition", $(this).offset());
             });

         config.mover.call(this);

         var animating = 0;
         var spacers = [];
         function check(){
             if (animating === 0){
                 affected.css({position:'', left:'', top:''});
                 for (var i=0,ii=spacers.length; i<ii; i++){
                     spacers[i].remove();
                 }
                 config.callback();
             }
         }
         var docViewTop = $(window).scrollTop();
         var docViewBottom = docViewTop + $(window).height();
         affected.each(
             function(){
                 // save new position of affected element
                 var $this = $(this);
                 var toPosition = $this.offset();
                 var fromPosition = $.data(this, "fromPosition");
                 if (!toPosition || !fromPosition){
                     // probably removed
                     return;
                 }
                 /**
                  * animate the affected element.  This will automatically skip over elements which:
                  *  a) have not actually moved
                  *  b) are not within the viewable window space.
                  */
                 if ((fromPosition.top != toPosition.top || fromPosition.left != toPosition.left) &&
                     ((fromPosition.top < docViewBottom && fromPosition.top >= docViewTop) ||
                      (toPosition.top < docViewBottom && toPosition.top >= docViewTop))){


                     // add spacers for affected element
                     var spacer = $('<'+this.tagName+' class="'+this.className+' '+config.spacerClass+'">'
                                    + '</'+this.tagName+'>')
                         .css(
                             {
                                 height: $this.height(),
                                 width: $this.width()
                             });
                     spacers.push(spacer);
                     $this.after(spacer);

                     $this.css({position:'fixed',
                                top:fromPosition.top+"px",
                                left:fromPosition.left+"px"});
                     $this.animate(
                         {
                             top:toPosition.top+"px",
                             left:toPosition.left+"px"
                         },
                         "slow",
                         function(){
                             animating--;
                             check();
                         });
                     animating++;
                 }
             });
     };

 })(jQuery);
