(function () {
  var STORAGE_KEY = "perfectGiftCartHasItems";
  var COUNT_KEY = "perfectGiftCartCount";
  var tipEmpty = "empty";
  var tipAdded = "You've added something to the cart";

  function getCartCountFromStorage() {
    var c = 0;
    try {
      c = parseInt(localStorage.getItem(COUNT_KEY), 10) || 0;
    } catch (e) {}
    if (c === 0) {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "1") {
          c = 1;
        }
      } catch (e) {}
    }
    return Math.min(Math.max(c, 0), 2);
  }

  function syncHeaderCartFromStorage() {
    var defaultImg = document.getElementById("headerCartDefault");
    var add1 = document.getElementById("headerCartAdd1");
    var headerCart = document.getElementById("headerCart");
    var badge = document.querySelector(".header-cart-add1-badge");
    if (!defaultImg || !add1) return;

    var count = getCartCountFromStorage();

    if (count < 1) {
      defaultImg.removeAttribute("hidden");
      add1.setAttribute("hidden", "");
      add1.setAttribute("aria-hidden", "true");
      if (badge) badge.textContent = "1";
      if (headerCart) {
        headerCart.setAttribute("title", tipEmpty);
        headerCart.setAttribute("aria-label", tipEmpty);
      }
      if (typeof window.syncFaviconFromCart === "function") {
        window.syncFaviconFromCart();
      }
      return;
    }

    if (badge) badge.textContent = String(count);
    defaultImg.setAttribute("hidden", "");
    add1.removeAttribute("hidden");
    add1.setAttribute("aria-hidden", "false");
    if (headerCart) {
      headerCart.setAttribute("title", tipAdded);
      headerCart.setAttribute("aria-label", tipAdded);
    }
    if (typeof window.syncFaviconFromCart === "function") {
      window.syncFaviconFromCart();
    }
  }

  window.syncHeaderCartFromStorage = syncHeaderCartFromStorage;

  function goCartPage() {
    var add1 = document.getElementById("headerCartAdd1");
    var hasBadge = add1 && !add1.hasAttribute("hidden");
    var currentPage = window.location.pathname.split("/").pop().toLowerCase();

    if (!hasBadge && currentPage === "giftresults.html") {
      window.location.href = "viewcartgift1.html";
      return;
    }

    var giftResultPages = [
      "giftresults.html",
      "2giftresults.html",
      "3giftresults.html",
      "4giftresults.html",
    ];
    var isGiftResultPage = giftResultPages.indexOf(currentPage) !== -1;

    if (hasBadge && isGiftResultPage) {
      window.location.href = "viewcartplus.html";
      return;
    }

    window.location.href = hasBadge ? "viewcartextra.html" : "viewcartempty.html";
  }

  function initHeaderCartNav() {
    var headerCart = document.getElementById("headerCart");
    if (!headerCart) return;

    headerCart.style.cursor = "pointer";
    headerCart.setAttribute("role", "button");
    headerCart.setAttribute("tabindex", "0");

    if (
      !document.getElementById("surveyStep6Form") &&
      document.body.getAttribute("data-cart-page") !== "extra"
    ) {
      syncHeaderCartFromStorage();
    }

    headerCart.addEventListener("click", function () {
      goCartPage();
    });

    headerCart.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goCartPage();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeaderCartNav);
  } else {
    initHeaderCartNav();
  }
})();
