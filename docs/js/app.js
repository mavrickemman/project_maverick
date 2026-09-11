(() => {
  const $ = window.jQuery;
  const intro = document.getElementById("intro");

  // The HTML remains readable if scripts fail or motion is disabled.
  if (!intro || !$ || !$.fn.velocity || !$.fn.blast ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const animationLockClass = "is-entrance-animating";
  const entranceTimers = [];
  let isCancellingEntrance = false;
  let isFinished = false;
  const animatedElements = () => $("#intro, #intro .blast, .highlight, .slide-in");

  function clearSteps() {
    entranceTimers.forEach(timer => window.clearTimeout(timer));
    entranceTimers.length = 0;
  }

  function unlockPageScroll() {
    isFinished = true;
    document.body.classList.remove(animationLockClass);
    clearSteps();
    window.clearTimeout(watchdog);
    document.removeEventListener("click", cancelEntranceAnimation);
    document.removeEventListener("keydown", cancelEntranceAnimation);
  }

  function finishImmediately() {
    isCancellingEntrance = true;
    clearSteps();
    try {
      animatedElements().velocity("stop", true);
    } finally {
      // A timeout must reveal the content, not merely remove the scroll lock.
      animatedElements().css({ opacity: 1, transform: "none" });
      unlockPageScroll();
    }
  }

  function scheduleEntranceStep(callback, delay) {
    entranceTimers.push(window.setTimeout(() => {
      if (!isFinished && !isCancellingEntrance) callback();
    }, delay));
  }

  function cancelEntranceAnimation() {
    if (isFinished || isCancellingEntrance) return;
    isCancellingEntrance = true;
    clearSteps();

    animatedElements()
      .velocity("stop", true)
      .velocity({ opacity: 1, translateY: 0 }, {
        display: null,
        duration: 1200,
        easing: "easeOutQuad",
        complete: unlockPageScroll
      });
  }

  function moveHeading() {
    $("#intro").velocity({ translateY: 0 }, {
      easing: [400, 30],
      duration: 1800
    });
  }

  function slideInItems() {
    $(".highlight").velocity({ translateY: 0 }, {
      easing: [400, 30],
      duration: 1800,
      complete: unlockPageScroll
    });
    $(".slide-in").velocity("transition.slideUpIn", {
      stagger: 80,
      drag: true
    });
  }

  document.body.classList.add(animationLockClass);
  document.addEventListener("click", cancelEntranceAnimation, { passive: true });
  document.addEventListener("keydown", cancelEntranceAnimation);
  const watchdog = window.setTimeout(finishImmediately, 6000);

  try {
    $("#intro").velocity({
      translateY: Math.max(0, (($(window).outerHeight() - 64) - $("#intro").height()) / 2),
      opacity: 1
    }, 0);

    $(".highlight").velocity({ translateY: $(window).height() }, 0);

    const letters = $("#intro").blast({ delimiter: "character" });
    letters.velocity("transition.slideUpIn", {
      display: null,
      // Bound the full text reveal even as the biography grows.
      stagger: Math.min(25, 1200 / Math.max(1, letters.length - 1)),
      duration: 600,
      complete: function () {
        if (isFinished || isCancellingEntrance) return;
        scheduleEntranceStep(moveHeading, 10);
        scheduleEntranceStep(slideInItems, 800);
      }
    });
  } catch (error) {
    finishImmediately();
    console.warn("Entrance animation skipped:", error);
  }
})();
