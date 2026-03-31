function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showLaptopScreenComplete() {
    const el = document.getElementById("laptopScreenComplete");
    if (!el) return;
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
}

function checkAllCellsDismissed(cells) {
    const total = cells.length;
    if (!total) return;
    const dismissed = cells.filter(function (c) {
        return c.classList.contains("laptop-cell--dismissed");
    }).length;
    if (dismissed === total) {
        showLaptopScreenComplete();
    }
}

function initLaptopCells() {
    const cells = Array.from(document.querySelectorAll(".laptop-cell"));
    if (!cells.length) return;

    cells.forEach(function (cell) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "laptop-cell-cancel";
        btn.setAttribute("aria-label", "Remove gift");
        const icon = document.createElement("img");
        icon.src = "imgs/cancel.svg";
        icon.alt = "";
        icon.className = "laptop-cell-cancel-icon";
        btn.appendChild(icon);
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            cell.classList.remove("laptop-cell--hover");
            cell.classList.add("laptop-cell--dismissed");
            checkAllCellsDismissed(cells);
        });
        cell.appendChild(btn);

        cell.addEventListener("mouseenter", function () {
            if (cell.classList.contains("laptop-cell--dismissed")) return;
            cell.classList.add("laptop-cell--hover");
        });
        cell.addEventListener("mouseleave", function () {
            cell.classList.remove("laptop-cell--hover");
        });
    });

    shuffleInPlace(cells);

    const minGap = 0.06;
    const maxGap = 0.2;
    let delaySec = Math.random() * 0.08;

    cells.forEach(function (cell) {
        cell.style.opacity = "0";
        cell.style.animationName = "laptop-cell-fade-in";
        cell.style.animationDuration = "0.55s";
        cell.style.animationTimingFunction = "ease-out";
        cell.style.animationDelay = delaySec + "s";
        cell.style.animationFillMode = "forwards";

        cell.addEventListener(
            "animationend",
            function onFadeEnd(e) {
                if (e.animationName !== "laptop-cell-fade-in") return;
                cell.style.animation = "";
                cell.style.removeProperty("opacity");
                cell.removeEventListener("animationend", onFadeEnd);
            },
            false
        );

        delaySec += minGap + Math.random() * (maxGap - minGap);
    });

    const nextBtn = document.getElementById("laptopScreenCompleteNext");
    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            window.location.href = "form.html";
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLaptopCells);
} else {
    initLaptopCells();
}

window.onload = function () {
    setTimeout(function () {
        const signupBox = document.getElementById("signupBox");
        if (signupBox) {
            signupBox.classList.add("show");
        }
    }, 8000);
};

function closePopup() {
    const signupBox = document.getElementById("signupBox");
    if (signupBox) {
        signupBox.classList.remove("show");
    }
}
