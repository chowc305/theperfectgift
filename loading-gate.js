(function () {
  try {
    if (sessionStorage.getItem("perfectGiftLoadingComplete") === "1") {
      return;
    }
  } catch (e) {
    return;
  }
  window.location.replace("loadingpage.html");
})();
