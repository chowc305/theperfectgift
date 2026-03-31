(function () {
    const intro = document.getElementById("formSurveyIntro");
    const flow = document.getElementById("formFlow");
    const surveyWrap = document.getElementById("formSurveyWrap");
    const startBtn = document.getElementById("formSurveyStart");
    const step1Form = document.getElementById("surveyStep1Form");
    const step2Form = document.getElementById("surveyStep2Form");
    const step3Form = document.getElementById("surveyStep3Form");
    const step4Form = document.getElementById("surveyStep4Form");
    const step5Form = document.getElementById("surveyStep5Form");
    const step6Form = document.getElementById("surveyStep6Form");
    const step7Form = document.getElementById("surveyStep7Form");
    const step8Form = document.getElementById("surveyStep8Form");
    const step9Form = document.getElementById("surveyStep9Form");
    const step10Form = document.getElementById("surveyStep10Form");
    const step11Form = document.getElementById("surveyStep11Form");
    const step12Form = document.getElementById("surveyStep12Form");
    const step13Form = document.getElementById("surveyStep13Form");
    const step14Form = document.getElementById("surveyStep14Form");
    const step14NextBtn = document.getElementById("step14NextBtn");
    const step15Form = document.getElementById("surveyStep15Form");
    const step8NextBtn = document.getElementById("step8NextBtn");
    const progressTrack = document.getElementById("progressTrackerTrack");
    const progressTracker = document.getElementById("progressTracker");
    const importanceScale = document.getElementById("importanceScale");
    const analogDigitalScale = document.getElementById("analogDigitalScale");
    const reallyMeanScale = document.getElementById("reallyMeanScale");
    const signupPopupOverlay = document.getElementById("signupPopupOverlay");
    const signupPopupForm = document.getElementById("signupPopupForm");
    const signupPopupClose = document.getElementById("signupPopupClose");
    const signupEmail = document.getElementById("signupEmail");
    const cookieBox1Overlay = document.getElementById("cookieBox1Overlay");
    const cookieBox1Shell = document.getElementById("cookieBox1Shell");
    const cookieBox2Overlay = document.getElementById("cookieBox2Overlay");
    const cookieBox2Shell = document.getElementById("cookieBox2Shell");
    const cookieAcceptBtn = document.getElementById("cookieAcceptBtn");
    const cookieDeclineBtn = document.getElementById("cookieDeclineBtn");
    const cookieAllowFewBtn = document.getElementById("cookieAllowFewBtn");
    const cookieDecline2Btn = document.getElementById("cookieDecline2Btn");

    let cookieBox1Choice = null;
    let cookieBox2Resolved = false;
    let step8NextTimer = null;

    const PROGRESS_STORAGE_KEY = "perfectGiftSurveyProgress";
    let activeStep = 1;

    function collectFormValues() {
        const flowEl = document.getElementById("formFlow");
        if (!flowEl) return {};
        const out = {};
        const inputs = flowEl.querySelectorAll("input, textarea, select");
        inputs.forEach(function (el) {
            const name = el.name;
            if (!name) return;
            if (el.type === "radio") {
                if (el.checked) out[name] = el.value;
            } else if (el.type === "checkbox") {
                out[name] = el.checked;
            } else {
                out[name] = el.value;
            }
        });
        return out;
    }

    function applyFormValues(values) {
        if (!values || typeof values !== "object") return;
        const flowEl = document.getElementById("formFlow");
        if (!flowEl) return;
        const inputs = flowEl.querySelectorAll("input, textarea, select");
        inputs.forEach(function (el) {
            const name = el.name;
            if (!name || !Object.prototype.hasOwnProperty.call(values, name)) return;
            const val = values[name];
            if (el.type === "radio") {
                el.checked = el.value === val;
            } else if (el.type === "checkbox") {
                el.checked = !!val;
            } else {
                el.value = val;
            }
        });
        if (importanceScale) syncRangeVisual(importanceScale);
        if (analogDigitalScale) syncRangeVisual(analogDigitalScale);
        if (reallyMeanScale) syncRangeVisual(reallyMeanScale);
    }

    function clearFormProgress() {
        try {
            localStorage.removeItem(PROGRESS_STORAGE_KEY);
        } catch (e) {
            /* ignore */
        }
    }

    function saveFormProgress() {
        if (!flow || flow.hasAttribute("hidden")) return;
        try {
            const payload = {
                v: 1,
                step: activeStep,
                cookieBox1Choice: cookieBox1Choice,
                cookieBox2Resolved: cookieBox2Resolved,
                values: collectFormValues(),
            };
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            /* ignore */
        }
    }

    function loadSavedProgress() {
        let raw;
        try {
            raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
        } catch (e) {
            return false;
        }
        if (!raw) return false;
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            return false;
        }
        if (!data || typeof data.step !== "number" || data.step < 1 || data.step > 15) {
            return false;
        }
        if (data.cookieBox1Choice !== undefined) {
            cookieBox1Choice = data.cookieBox1Choice;
        }
        if (data.cookieBox2Resolved !== undefined) {
            cookieBox2Resolved = !!data.cookieBox2Resolved;
        }
        if (!intro || !flow) return false;
        intro.setAttribute("hidden", "");
        intro.setAttribute("aria-hidden", "true");
        flow.removeAttribute("hidden");
        flow.setAttribute("aria-hidden", "false");
        if (surveyWrap) surveyWrap.classList.add("form-survey-wrap--survey-flow");
        applyFormValues(data.values || {});
        showStep(data.step);
        return true;
    }

    const PROGRESS_STEP = 5;
    const stepForms = [
        step1Form,
        step2Form,
        step3Form,
        step4Form,
        step5Form,
        step6Form,
        step7Form,
        step8Form,
        step9Form,
        step10Form,
        step11Form,
        step12Form,
        step13Form,
        step14Form,
        step15Form,
    ].filter(Boolean);
    let progressPct = PROGRESS_STEP;

    function setProgress(pct) {
        progressPct = Math.min(100, Math.max(0, pct));
        if (progressTrack) {
            progressTrack.style.setProperty("--progress-pct", progressPct + "%");
        }
    }

    function updateProgressLabel(step) {
        if (progressTracker) {
            progressTracker.setAttribute(
                "aria-label",
                "Survey progress, step " + step + " of several"
            );
        }
    }

    function clearFormBackground() {
        document.body.classList.remove(
            "form-bg--sky",
            "form-bg--1",
            "form-bg--2",
            "form-bg--3",
            "form-bg--4"
        );
    }

    function updateFormBackground(stepNum) {
        if (!flow || flow.hasAttribute("hidden")) {
            clearFormBackground();
            return;
        }
        var idx = ((stepNum - 1) % 4) + 1;
        clearFormBackground();
        document.body.classList.add("form-bg--sky", "form-bg--" + idx);
    }

    function showStep(stepNum) {
        stepForms.forEach(function (form) {
            if (!form) return;
            const n = parseInt(form.getAttribute("data-step"), 10);
            const on = n === stepNum;
            if (on) {
                form.removeAttribute("hidden");
                form.setAttribute("aria-hidden", "false");
            } else {
                form.setAttribute("hidden", "");
                form.setAttribute("aria-hidden", "true");
            }
        });
        var progressForStep;
        if (stepNum <= 5) {
            progressForStep = PROGRESS_STEP * stepNum;
        } else if (stepNum <= 7) {
            progressForStep = 25 + 10 + (stepNum - 6) * PROGRESS_STEP;
        } else if (stepNum === 12) {
            progressForStep = 86;
        } else if (stepNum === 13) {
            progressForStep = 96;
        } else if (stepNum === 14) {
            progressForStep = 98;
        } else if (stepNum === 15) {
            progressForStep = 100;
        } else {
            progressForStep = 50 + (stepNum - 8) * 10;
        }
        setProgress(Math.min(100, progressForStep));
        updateProgressLabel(stepNum);
        if (stepNum === 3 && importanceScale) {
            syncRangeVisual(importanceScale);
        }
        if (stepNum === 7 && analogDigitalScale) {
            syncRangeVisual(analogDigitalScale);
        }
        if (stepNum === 15 && reallyMeanScale) {
            syncRangeVisual(reallyMeanScale);
        }
        if (stepNum === 2) {
            openSignupPopup();
        } else {
            closeSignupPopup();
        }
        if (stepNum === 3 && cookieBox1Choice === null) {
            openCookie1();
        } else {
            closeCookie1Instant();
        }
        if (stepNum === 6 && cookieBox1Choice === "decline" && !cookieBox2Resolved) {
            openCookie2();
        } else {
            closeCookie2Instant();
        }
        if (stepNum === 8) {
            armStep8Next();
        } else {
            resetStep8Next();
        }
        updateHeaderCart();
        if (stepNum === 14) {
            updateStep14NextLabel();
        }
        activeStep = stepNum;
        updateFormBackground(stepNum);
        saveFormProgress();
    }

    function updateStep14NextLabel() {
        if (!step14Form || !step14NextBtn) return;
        const checked = step14Form.querySelector('input[name="expensive-priority"]:checked');
        if (!checked) {
            step14NextBtn.textContent = "next";
            return;
        }
        if (checked.value === "yes") {
            step14NextBtn.textContent = "good choice.";
        } else if (checked.value === "no") {
            step14NextBtn.textContent = "really?";
        } else {
            step14NextBtn.textContent = "next";
        }
    }

    function resetStep8Next() {
        if (!step8NextBtn) return;
        if (step8NextTimer) {
            clearTimeout(step8NextTimer);
            step8NextTimer = null;
        }
        step8NextBtn.classList.remove("is-visible");
        step8NextBtn.setAttribute("hidden", "");
        step8NextBtn.setAttribute("aria-hidden", "true");
    }

    function armStep8Next() {
        if (!step8NextBtn) return;
        resetStep8Next();
        step8NextTimer = setTimeout(function () {
            if (!step8Form || step8Form.hasAttribute("hidden")) return;
            step8NextBtn.removeAttribute("hidden");
            step8NextBtn.setAttribute("aria-hidden", "false");
            requestAnimationFrame(function () {
                step8NextBtn.classList.add("is-visible");
            });
            step8NextTimer = null;
        }, 8000);
    }

    function updateHeaderCart() {
        const headerCart = document.getElementById("headerCart");
        const defaultImg = document.getElementById("headerCartDefault");
        const add1 = document.getElementById("headerCartAdd1");
        const tipEmpty = "empty";
        const tipAdded = "You've added something to the cart";
        if (!defaultImg || !add1) {
            if (headerCart) {
                headerCart.setAttribute("title", tipEmpty);
                headerCart.setAttribute("aria-label", tipEmpty);
            }
            return;
        }

        let showBadge = false;

        const landscapeForm = document.getElementById("surveyStep6Form");
        if (landscapeForm) {
            const checked = landscapeForm.querySelector('input[name="landscape"]:checked');
            const v = checked ? checked.value : "";
            if (v === "mountain" || v === "cityscape") {
                showBadge = true;
            }
        }

        if (step5Form) {
            const hs = step5Form.querySelector('input[name="home-sense"]:checked');
            if (hs && hs.value === "visual-aesthetic") {
                showBadge = true;
            }
        }

        if (importanceScale) {
            const n = Number(importanceScale.value);
            if (!Number.isNaN(n) && n > 5) {
                showBadge = true;
            }
        }
        const badgeEl = document.querySelector(".header-cart-add1-badge");
        if (showBadge) {
            defaultImg.setAttribute("hidden", "");
            add1.removeAttribute("hidden");
            add1.setAttribute("aria-hidden", "false");
            let n = 1;
            try {
                n = parseInt(localStorage.getItem("perfectGiftCartCount"), 10) || 0;
            } catch (e) {}
            if (n < 1) n = 1;
            if (n > 2) n = 2;
            if (badgeEl) badgeEl.textContent = String(n);
        } else {
            defaultImg.removeAttribute("hidden");
            add1.setAttribute("hidden", "");
            add1.setAttribute("aria-hidden", "true");
            if (badgeEl) badgeEl.textContent = "1";
        }
        if (headerCart) {
            if (showBadge) {
                headerCart.setAttribute("title", tipAdded);
                headerCart.setAttribute("aria-label", tipAdded);
            } else {
                headerCart.setAttribute("title", tipEmpty);
                headerCart.setAttribute("aria-label", tipEmpty);
            }
        }
        try {
            if (showBadge) {
                localStorage.setItem("perfectGiftCartHasItems", "1");
                var existing = 0;
                try {
                    existing = parseInt(localStorage.getItem("perfectGiftCartCount"), 10) || 0;
                } catch (e2) {}
                if (existing < 1) {
                    localStorage.setItem("perfectGiftCartCount", "1");
                }
            } else {
                localStorage.removeItem("perfectGiftCartHasItems");
                localStorage.removeItem("perfectGiftCartCount");
                localStorage.removeItem("perfectGiftCartVariant");
            }
        } catch (e) {
            /* ignore */
        }
        if (typeof window.syncFaviconFromCart === "function") {
            window.syncFaviconFromCart();
        }
    }

    function syncBodyOverflow() {
        var signupOpen = signupPopupOverlay && !signupPopupOverlay.hasAttribute("hidden");
        var c1 = cookieBox1Overlay && !cookieBox1Overlay.hasAttribute("hidden");
        var c2 = cookieBox2Overlay && !cookieBox2Overlay.hasAttribute("hidden");
        document.body.style.overflow = signupOpen || c1 || c2 ? "hidden" : "";
    }

    function openSignupPopup() {
        if (!signupPopupOverlay) return;
        signupPopupOverlay.removeAttribute("hidden");
        signupPopupOverlay.setAttribute("aria-hidden", "false");
        syncBodyOverflow();
        if (signupEmail) {
            window.setTimeout(function () {
                signupEmail.focus();
            }, 0);
        }
    }

    function closeSignupPopup() {
        if (!signupPopupOverlay) return;
        if (signupPopupOverlay.hasAttribute("hidden")) {
            syncBodyOverflow();
            return;
        }
        signupPopupOverlay.setAttribute("hidden", "");
        signupPopupOverlay.setAttribute("aria-hidden", "true");
        if (signupPopupForm) {
            signupPopupForm.reset();
        }
        syncBodyOverflow();
    }

    function openCookie1() {
        if (!cookieBox1Overlay || cookieBox1Choice !== null) return;
        cookieBox1Overlay.removeAttribute("hidden");
        cookieBox1Overlay.setAttribute("aria-hidden", "false");
        cookieBox1Overlay.classList.remove("is-open");
        syncBodyOverflow();
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                cookieBox1Overlay.classList.add("is-open");
            });
        });
    }

    function closeCookie1Instant() {
        if (!cookieBox1Overlay) return;
        cookieBox1Overlay.classList.remove("is-open");
        cookieBox1Overlay.setAttribute("hidden", "");
        cookieBox1Overlay.setAttribute("aria-hidden", "true");
        syncBodyOverflow();
    }

    function closeCookie1Animated() {
        if (!cookieBox1Overlay || cookieBox1Overlay.hasAttribute("hidden")) return;
        if (!cookieBox1Overlay.classList.contains("is-open")) {
            closeCookie1Instant();
            return;
        }
        cookieBox1Overlay.classList.remove("is-open");
        function onEnd(e) {
            if (e.target !== cookieBox1Shell || e.propertyName !== "transform") return;
            cookieBox1Shell.removeEventListener("transitionend", onEnd);
            if (cookieBox1Overlay.hasAttribute("hidden")) {
                syncBodyOverflow();
                return;
            }
            cookieBox1Overlay.setAttribute("hidden", "");
            cookieBox1Overlay.setAttribute("aria-hidden", "true");
            syncBodyOverflow();
        }
        cookieBox1Shell.addEventListener("transitionend", onEnd);
    }

    function openCookie2() {
        if (!cookieBox2Overlay || cookieBox2Resolved) return;
        cookieBox2Overlay.removeAttribute("hidden");
        cookieBox2Overlay.setAttribute("aria-hidden", "false");
        cookieBox2Overlay.classList.remove("is-open");
        syncBodyOverflow();
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                cookieBox2Overlay.classList.add("is-open");
            });
        });
    }

    function closeCookie2Instant() {
        if (!cookieBox2Overlay) return;
        cookieBox2Overlay.classList.remove("is-open");
        cookieBox2Overlay.setAttribute("hidden", "");
        cookieBox2Overlay.setAttribute("aria-hidden", "true");
        syncBodyOverflow();
    }

    function closeCookie2Animated() {
        if (!cookieBox2Overlay || cookieBox2Overlay.hasAttribute("hidden")) return;
        if (!cookieBox2Overlay.classList.contains("is-open")) {
            closeCookie2Instant();
            return;
        }
        cookieBox2Overlay.classList.remove("is-open");
        function onEnd(e) {
            if (e.target !== cookieBox2Shell || e.propertyName !== "transform") return;
            cookieBox2Shell.removeEventListener("transitionend", onEnd);
            if (cookieBox2Overlay.hasAttribute("hidden")) {
                syncBodyOverflow();
                return;
            }
            cookieBox2Overlay.setAttribute("hidden", "");
            cookieBox2Overlay.setAttribute("aria-hidden", "true");
            syncBodyOverflow();
        }
        cookieBox2Shell.addEventListener("transitionend", onEnd);
    }

    function syncRangeVisual(input) {
        const min = Number(input.min);
        const max = Number(input.max);
        const val = Number(input.value);
        const pct = max <= min ? 0 : ((val - min) / (max - min)) * 100;
        input.style.setProperty("--range-fill", pct + "%");
        input.setAttribute("aria-valuenow", String(val));
        input.setAttribute("aria-valuemin", String(min));
        input.setAttribute("aria-valuemax", String(max));
        input.setAttribute("aria-valuetext", String(val) + " out of " + String(max));
    }

    if (importanceScale) {
        importanceScale.addEventListener("input", function () {
            syncRangeVisual(importanceScale);
            updateHeaderCart();
        });
        syncRangeVisual(importanceScale);
    }

    if (analogDigitalScale) {
        analogDigitalScale.addEventListener("input", function () {
            syncRangeVisual(analogDigitalScale);
        });
        syncRangeVisual(analogDigitalScale);
    }

    if (reallyMeanScale) {
        reallyMeanScale.addEventListener("input", function () {
            syncRangeVisual(reallyMeanScale);
        });
        syncRangeVisual(reallyMeanScale);
    }

    if (signupPopupClose) {
        signupPopupClose.addEventListener("click", function () {
            closeSignupPopup();
        });
    }

    if (signupPopupForm) {
        signupPopupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!signupPopupForm.reportValidity()) return;
            closeSignupPopup();
        });
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener("click", function () {
            cookieBox1Choice = "accept";
            closeCookie1Animated();
            saveFormProgress();
        });
    }
    if (cookieDeclineBtn) {
        cookieDeclineBtn.addEventListener("click", function () {
            cookieBox1Choice = "decline";
            closeCookie1Animated();
            saveFormProgress();
        });
    }
    if (cookieAllowFewBtn) {
        cookieAllowFewBtn.addEventListener("click", function () {
            cookieBox2Resolved = true;
            closeCookie2Animated();
            saveFormProgress();
        });
    }
    if (cookieDecline2Btn) {
        cookieDecline2Btn.addEventListener("click", function () {
            cookieBox2Resolved = true;
            closeCookie2Animated();
            saveFormProgress();
        });
    }

    function startSurveyFlow() {
        if (!intro || !flow) return;
        clearFormProgress();
        intro.setAttribute("hidden", "");
        intro.setAttribute("aria-hidden", "true");
        flow.removeAttribute("hidden");
        flow.setAttribute("aria-hidden", "false");
        if (surveyWrap) surveyWrap.classList.add("form-survey-wrap--survey-flow");
        showStep(1);
    }

    if (intro && flow && startBtn) {
        startBtn.addEventListener("click", function () {
            try {
                sessionStorage.setItem("formStartAfterLoading", "1");
            } catch (e) {
                /* ignore */
            }
            window.location.href = "loadingpage.html";
        });
    }

    try {
        if (sessionStorage.getItem("formOpenSurvey") === "1") {
            sessionStorage.removeItem("formOpenSurvey");
            startSurveyFlow();
        } else if (!loadSavedProgress()) {
            clearFormBackground();
        }
    } catch (e) {
        clearFormBackground();
    }

    if (step1Form) {
        step1Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step1Form.reportValidity()) return;
            showStep(2);
        });
    }

    if (step2Form) {
        step2Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step2Form.reportValidity()) return;
            showStep(3);
        });
    }

    if (step6Form) {
        step6Form.addEventListener("change", function (e) {
            const t = e.target;
            if (t && t.name === "landscape") updateHeaderCart();
        });
    }

    if (step5Form) {
        step5Form.addEventListener("change", function (e) {
            const t = e.target;
            if (t && t.name === "home-sense") updateHeaderCart();
        });
    }

    if (step3Form) {
        step3Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (cookieBox1Choice === null) return;
            if (!step3Form.reportValidity()) return;
            showStep(4);
        });
    }

    if (step4Form) {
        step4Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step4Form.reportValidity()) return;
            showStep(5);
        });
    }

    if (step5Form) {
        step5Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step5Form.reportValidity()) return;
            showStep(6);
        });
    }

    if (step6Form) {
        step6Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (cookieBox1Choice === "decline" && !cookieBox2Resolved) return;
            if (!step6Form.reportValidity()) return;
            showStep(7);
        });
    }

    if (step7Form) {
        step7Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step7Form.reportValidity()) return;
            showStep(8);
        });
    }

    if (step8Form) {
        step8Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step8Form.reportValidity()) return;
            resetStep8Next();
            showStep(9);
        });
    }

    if (step9Form) {
        step9Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step9Form.reportValidity()) return;
            showStep(10);
        });
    }

    if (step10Form) {
        step10Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step10Form.reportValidity()) return;
            showStep(11);
        });
    }

    if (step11Form) {
        step11Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step11Form.reportValidity()) return;
            showStep(12);
        });
    }

    if (step12Form) {
        step12Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step12Form.reportValidity()) return;
            showStep(13);
        });
    }

    if (step13Form) {
        step13Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step13Form.reportValidity()) return;
            showStep(14);
        });
    }

    if (step14Form) {
        step14Form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!step14Form.reportValidity()) return;
            showStep(15);
        });
        step14Form.addEventListener("change", function (e) {
            const t = e.target;
            if (t && t.name === "expensive-priority") {
                updateStep14NextLabel();
            }
        });
    }

    if (step15Form) {
        step15Form.addEventListener("submit", function (e) {
            e.preventDefault();
            clearFormProgress();
            const target =
                typeof window.getRandomGiftResultsPage === "function"
                    ? window.getRandomGiftResultsPage()
                    : "giftresults.html";
            try {
                sessionStorage.setItem("formFinishAfterLoading", "1");
                sessionStorage.setItem("formFinishTarget", target);
            } catch (e) {
                /* ignore */
            }
            window.location.href = "loadingpage.html";
        });
    }

    if (flow) {
        flow.addEventListener("click", function (e) {
            const btn = e.target.closest("[data-action='back-step']");
            if (!btn) return;
            const form = btn.closest("form.question-box");
            if (form === step2Form) showStep(1);
            else if (form === step3Form) showStep(2);
            else if (form === step4Form) showStep(3);
            else if (form === step5Form) showStep(4);
            else if (form === step6Form) showStep(5);
            else if (form === step7Form) showStep(6);
            else if (form === step8Form) showStep(7);
            else if (form === step9Form) showStep(8);
            else if (form === step10Form) showStep(9);
            else if (form === step11Form) showStep(10);
            else if (form === step12Form) showStep(11);
            else if (form === step13Form) showStep(12);
            else if (form === step14Form) showStep(13);
            else if (form === step15Form) showStep(14);
        });
    }

    function saveFormProgressIfInSurvey() {
        if (!flow || flow.hasAttribute("hidden")) return;
        saveFormProgress();
    }

    var headerCartEl = document.getElementById("headerCart");
    if (headerCartEl) {
        headerCartEl.addEventListener("click", saveFormProgressIfInSurvey, true);
    }

    updateHeaderCart();
})();
