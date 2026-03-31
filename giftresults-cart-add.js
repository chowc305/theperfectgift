(function () {
  var STORAGE_KEY = "perfectGiftCartHasItems";
  var COUNT_KEY = "perfectGiftCartCount";
  var VARIANT_KEY = "perfectGiftCartVariant";

  function getBaseCount() {
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
    return c;
  }

  function hasNoCartBadge() {
    var add1 = document.getElementById("headerCartAdd1");
    return !add1 || add1.hasAttribute("hidden");
  }

  function onAddToCartClick(e) {
    e.preventDefault();
    var btn = e.currentTarget;

    if (btn.classList.contains("gift-match-add-cart")) {
      try {
        localStorage.setItem(VARIANT_KEY, "1");
      } catch (err) {}
    }

    if (btn.classList.contains("gift2-add-cart")) {
      try {
        localStorage.setItem(VARIANT_KEY, "2");
      } catch (err) {}
      if (hasNoCartBadge()) {
        try {
          localStorage.setItem(COUNT_KEY, "1");
          localStorage.setItem(STORAGE_KEY, "1");
        } catch (err2) {}
        if (typeof window.syncFaviconFromCart === "function") {
          window.syncFaviconFromCart();
        }
        window.location.href = "viewcartplus.html";
        return;
      }
    }

    if (btn.classList.contains("gift3-add-cart")) {
      try {
        localStorage.setItem(VARIANT_KEY, "3");
      } catch (err) {}
      if (hasNoCartBadge()) {
        try {
          localStorage.setItem(COUNT_KEY, "1");
          localStorage.setItem(STORAGE_KEY, "1");
        } catch (err2) {}
        if (typeof window.syncFaviconFromCart === "function") {
          window.syncFaviconFromCart();
        }
        window.location.href = "viewcartplus.html";
        return;
      }
    }

    if (btn.classList.contains("gift4-add-cart")) {
      try {
        localStorage.setItem(VARIANT_KEY, "4");
      } catch (err) {}
      if (hasNoCartBadge()) {
        try {
          localStorage.setItem(COUNT_KEY, "1");
          localStorage.setItem(STORAGE_KEY, "1");
        } catch (err2) {}
        if (typeof window.syncFaviconFromCart === "function") {
          window.syncFaviconFromCart();
        }
        window.location.href = "viewcartplus.html";
        return;
      }
    }

    var base = getBaseCount();
    var newCount = Math.min(base + 1, 2);
    try {
      localStorage.setItem(COUNT_KEY, String(newCount));
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (err) {}
    if (typeof window.syncHeaderCartFromStorage === "function") {
      window.syncHeaderCartFromStorage();
    }
    if (typeof window.syncFaviconFromCart === "function") {
      window.syncFaviconFromCart();
    }
  }

  function init() {
    var selectors = [
      ".gift-match-add-cart",
      ".gift2-add-cart",
      ".gift3-add-cart",
      ".gift4-add-cart",
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        btn.addEventListener("click", onAddToCartClick);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
