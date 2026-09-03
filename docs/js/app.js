const animationLockClass = "is-entrance-animating";
const entranceTimers = [];
let isCancellingEntrance = false;

document.body.classList.add(animationLockClass);
document.addEventListener("click", cancelEntranceAnimation, { passive: true });
document.addEventListener("keydown", cancelEntranceAnimation);
scheduleEntranceStep(unlockPageScroll, 6000);

function scheduleEntranceStep(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  entranceTimers.push(timer);
  return timer;
}

function unlockPageScroll() {
  document.body.classList.remove(animationLockClass);
  entranceTimers.forEach(window.clearTimeout);
  entranceTimers.length = 0;
  isCancellingEntrance = false;
  document.removeEventListener("click", cancelEntranceAnimation);
  document.removeEventListener("keydown", cancelEntranceAnimation);
}

function cancelEntranceAnimation() {
  if (!document.body.classList.contains(animationLockClass) || isCancellingEntrance) {
    return;
  }

  isCancellingEntrance = true;
  entranceTimers.forEach(window.clearTimeout);
  entranceTimers.length = 0;

  $("#intro, #intro .blast, .highlight, .slide-in")
    .velocity("stop", true)
    .velocity({
      opacity: 1,
      translateY: 0
    }, {
      display: null,
      duration: 1200,
      easing: "easeOutQuad",
      complete: unlockPageScroll
    });
}

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
    }, {
      easing: [400,30],
      duration: 1800,
      complete: unlockPageScroll
    });
  $(".slide-in")
    .velocity("transition.slideUpIn", {
      stagger: 80,
      drag: true
    });

  scheduleEntranceStep(function(){
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
    scheduleEntranceStep(moveHeading, 10);
    scheduleEntranceStep(slideInItems, 800);
  }
});
