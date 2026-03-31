(function () {
  var PACKAGING = 4.99;
  var VARIANT_KEY = "perfectGiftCartVariant";

  var PRODUCTS = {
    "1": {
      unit: 16.99,
      titleHtml:
        "The &ldquo;Mother&rsquo;s Guilt&rdquo; Scented Candle",
      discount: "-48%",
      main: " $16.99 (pack of 1)",
    },
    "2": {
      unit: 32.99,
      titleHtml:
        'The &ldquo;Ancestral DNA&rdquo; Pet Rock<br><span class="viewcart-plus-title-sub">(Custom-Sourced)</span>',
      discount: "-48%",
      main: " $32.99",
    },
    "3": {
      unit: 45.99,
      titleHtml:
        "The &ldquo;Existential Dread&rdquo; Alarm Clock",
      discount: "-48%",
      main: " $45.99",
    },
    "4": {
      unit: 66.99,
      titleHtml:
        "The &ldquo;Simulated Sunlight&rdquo; Shadow Box",
      discount: "-48%",
      main: " $66.99",
    },
  };

  function getVariant() {
    var v = "1";
    try {
      v = localStorage.getItem(VARIANT_KEY) || "1";
    } catch (e) {}
    if (v !== "1" && v !== "2" && v !== "3" && v !== "4") {
      v = "1";
    }
    return v;
  }

  var qtyWrap = document.querySelector(".viewcart-plus-qty");
  var qtyNum = document.querySelector(".viewcart-plus-qty-num");
  var subEl = document.querySelector(".viewcart-plus-subtotal");
  var titleEl = document.querySelector(".viewcart-plus-item-title");
  var discEl = document.querySelector(".viewcart-plus-discount");
  var mainEl = document.querySelector(".viewcart-plus-price-main");

  var product = PRODUCTS[getVariant()] || PRODUCTS["1"];
  var UNIT = product.unit;

  if (titleEl) {
    titleEl.innerHTML = product.titleHtml;
  }
  if (discEl) {
    discEl.textContent = product.discount;
  }
  if (mainEl) {
    mainEl.textContent = product.main;
  }

  if (!qtyWrap || !qtyNum || !subEl) {
    return;
  }

  function fmt(n) {
    return n.toFixed(2);
  }

  function updateSubtotal() {
    var n = parseInt(qtyNum.textContent, 10) || 1;
    var lineTotal = UNIT * n;
    var grand = lineTotal + PACKAGING;
    var itemLabel = n === 1 ? "1 item" : n + " items";
    subEl.textContent =
      "Subtotal (" +
      itemLabel +
      "): $" +
      fmt(lineTotal) +
      " + $" +
      fmt(PACKAGING) +
      "= $" +
      fmt(grand);
  }

  qtyWrap.addEventListener("click", function () {
    requestAnimationFrame(updateSubtotal);
  });
  updateSubtotal();
})();
