(function () {
  var UNIT = 16.99;
  var qtyWrap = document.querySelector(".viewcart-gift1-qty");
  var qtyNum = document.querySelector(".viewcart-gift1-qty-num");
  var subEl = document.querySelector(".viewcart-gift1-subtotal");
  if (!qtyWrap || !qtyNum || !subEl) return;

  function updateSubtotal() {
    var n = parseInt(qtyNum.textContent, 10) || 1;
    var total = UNIT * n;
    var itemLabel = n === 1 ? "1 item" : n + " items";
    subEl.textContent = "Subtotal (" + itemLabel + "): $" + total.toFixed(2);
  }

  qtyWrap.addEventListener("click", function () {
    requestAnimationFrame(updateSubtotal);
  });
  updateSubtotal();
})();
