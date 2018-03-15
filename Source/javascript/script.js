window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

$(function() {
  // This will select everything with the class smoothScroll
  // This should prevent problems with carousel, scrollspy, etc...
  $('.smoothScroll').click(function(e) {
  	e.preventDefault();
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {

      	$('html,body').on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
       $('html,body').stop();
    });

        $('html,body').animate({
          scrollTop: target.offset().top-80
        }, 700, function() {
          /* ADDED: focus the target */
          //clearSelection();

          target.focus();
          /* end ADDED */
          /* ADDED: update the URL */
          //window.location.hash = $linkElem.attr('href').substring(1);
         // window.location.hash = $(this).attr('href').substring(1, $(this).attr('href').length);
          /* end ADDED */
        }); // The number here represents the speed of the scroll in milliseconds
        return false;
      }
    }
  });
});

$(function(){ 
     var navMain = $(".navbar-collapse"); // avoid dependency on #id
     // "a:not([data-toggle])" - to avoid issues caused
     // when you have dropdown inside navbar
     navMain.on("click", "a:not([data-toggle])", null, function () {
         navMain.collapse('hide');
     });
 });