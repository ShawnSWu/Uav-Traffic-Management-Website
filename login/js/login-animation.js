AOS.init({
    duration: 800,
    easing: 'slide',
    once: false
});

jQuery(document).ready(function($) {

    var siteMenuClone = function() {

        $(document).mouseup(function(e) {
            var container = $(".site-mobile-menu");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ( $('body').hasClass('offcanvas-menu') ) {
                    $('body').removeClass('offcanvas-menu');
                }
            }
        });
    };

    siteMenuClone();



});