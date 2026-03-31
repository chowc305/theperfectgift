(function () {
  /* Show loading page for 1s, then continue */
  var HOLD_MS = 1000;

  function goNext() {
    try {
      if (sessionStorage.getItem("formFinishAfterLoading") === "1") {
        var target = sessionStorage.getItem("formFinishTarget") || "giftresults.html";
        sessionStorage.removeItem("formFinishAfterLoading");
        sessionStorage.removeItem("formFinishTarget");
        window.location.replace(target);
        return;
      }
      if (sessionStorage.getItem("ratingSubmitAfterLoading") === "1") {
        sessionStorage.removeItem("ratingSubmitAfterLoading");
        window.location.replace("thankyou.html");
        return;
      }
      if (sessionStorage.getItem("formStartAfterLoading") === "1") {
        sessionStorage.removeItem("formStartAfterLoading");
        sessionStorage.setItem("formOpenSurvey", "1");
        window.location.replace("form.html");
        return;
      }
    } catch (e) {
      /* fall through to home */
    }
    try {
      sessionStorage.setItem("perfectGiftLoadingComplete", "1");
    } catch (e) {
      /* sessionStorage unavailable — still navigate */
    }
    window.location.replace("index.html");
  }

  setTimeout(goNext, HOLD_MS);
})();
