function moveHeading() {
  $("#intro").velocity({transform: "translateY(30px)"}, [400, 30], 1800);
}

function slideInItems() {
  $(".highlight").velocity({transform: "translateY(0px)", display: "block" }, [400, 30], 1800);
  $(".slide-in").velocity("transition.slideUpIn", {stagger: 80, drag: true});
}

$("#intro").velocity({
    transform: "translateY(" + (($(window).outerHeight() - $("#intro").height()) / 2) + "px)",
    opacity: 1
  }, 0
);

$(".highlight").velocity({
    transform: "translateY(" + $(window).height() + "px)",
    display: "none"
  }, 0
);

$("#intro").blast({
  delimiter: "character"
}).velocity("transition.slideUpIn", {
  display: "none",
  stagger: 25,
  duration: 600,
  complete: function () {
    setTimeout(moveHeading, 10);
    setTimeout(slideInItems, 10);
  }
});
