(function () {
  var BOX = "imgs/box.png";
  var GIFT = "imgs/gift.png";

  function syncFaviconFromCart() {
    var gift = false;
    try {
      if (localStorage.getItem("perfectGiftCartHasItems") === "1") {
        gift = true;
      } else {
        var c = parseInt(localStorage.getItem("perfectGiftCartCount"), 10) || 0;
        if (c > 0) gift = true;
      }
    } catch (e) {}
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.appendChild(link);
    }
    link.href = gift ? GIFT : BOX;
  }

  window.syncFaviconFromCart = syncFaviconFromCart;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncFaviconFromCart);
  } else {
    syncFaviconFromCart();
  }
})();
