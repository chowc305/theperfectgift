(function () {
  var form = document.querySelector(".rating-card");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    try {
      sessionStorage.setItem("ratingSubmitAfterLoading", "1");
    } catch (err) {
      /* ignore */
    }
    window.location.href = "loadingpage.html";
  });
})();
