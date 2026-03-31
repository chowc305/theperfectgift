(function () {
    var qtyWrapSelector =
        ".gift-match-qty, .gift2-qty, .gift3-qty, .gift4-qty, .viewcart-gift1-qty, .viewcart-plus-qty";
    var numSelector =
        ".gift-match-qty-num, .gift2-qty-num, .gift3-qty-num, .gift4-qty-num, .viewcart-gift1-qty-num, .viewcart-plus-qty-num";

    document.addEventListener("click", function (e) {
        var wrap = e.target.closest(qtyWrapSelector);
        if (!wrap) return;
        var btn = e.target.closest("button");
        if (!btn || !wrap.contains(btn)) return;
        var numEl = wrap.querySelector(numSelector);
        if (!numEl) return;
        var buttons = wrap.querySelectorAll("button");
        if (buttons.length < 2) return;

        var n = parseInt(numEl.textContent, 10);
        if (isNaN(n) || n < 1) n = 1;

        if (btn === buttons[0]) {
            n = Math.max(1, n - 1);
        } else if (btn === buttons[1]) {
            n = Math.min(99, n + 1);
        } else {
            return;
        }

        numEl.textContent = String(n);
    });
})();
