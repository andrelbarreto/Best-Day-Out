var modal = (function() {                   //declare modal object
    var $window = $(window);
    var $modal = $('<div class="modal"/>');  //create markup for modal
    var $content = $('<div class="modal-content"/>');
    var $close = $('<button role="button" class="modal-close">close</button>');
    
    $modal.append($content, $close);        // Add close button to modal

    $close.on('click', function(e) {       // If user cliks on close
        e.preventDefault();                 // Prevent link behavior
        modal.close();                      // close window
    
    });


    return {        // Add code to modal
        center : function() {
            // Calculate distance from top and left of window to center of modal
        var top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
        var left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;
        $modal.css({                        //Set CSS for the modal
            top: top + $window.scrollTop(),   //center vertically
            left : left + $window.scrollLeft()
        });
    },
    open : function (settings) {    // Define open() method
        $content.empty().append(settings.content); // set new content of modal

        $modal.css({                //set modal dimensions
            width: settings.width  || 'auto',   // set width
            height: settings.height  || 'auto'  // set height
        }).appendTo('body');                    // add it to the page

        modal.center();                         //Call center() method
        $(window).on('resize', modal.center);   //Call it if window resized
    },

        close: function() {                         //Define close() method
            $content.empty();                       // Remove content from modal
            $modal.detach();                        // Remove modal from page
            $(window).off('resize', modal.center);  //  Remove event handler
        }
        };
    }());
        
    // Created by Andre Barreto with reference from book Javascript & JQuery by Jon Duckett

        


