function moveHeading() {
  $("#intro")
    .velocity({
      translateY: "0",
    }, [400,30], 1800);
}

// Slide in list items
function slideInItems() {
  $('.highlight')
    .velocity({
      translateY: 0,
    }, [400,30], 1800);
  $(".slide-in")
    .velocity("transition.slideUpIn", {
      stagger: 80,
      drag: true
    });

  setTimeout(function(){
    $('#tipCalc')
      .velocity({
        scale: 1,
      }, [400,30], 1000);
  }, 500);
}

// Center heading position
$("#intro")
  .velocity({
    translateY: (($(window).outerHeight() - 64) - $("#intro").height()) / 2,
    opacity: 1
  }, 0);

$('.highlight')
  .velocity({
    translateY: $(window).height(),
  }, 0);

$("#intro").blast({
  delimiter: "character"
 }).velocity("transition.slideUpIn", {
  display: null,
  stagger: 25,
  duration: 600,
  complete: function () {
    setTimeout(moveHeading, 10);
    setTimeout(slideInItems, 800);
  }
});


