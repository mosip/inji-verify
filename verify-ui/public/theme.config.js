(function () {
    const updateText = (el, value) => {
        if (el && typeof value === "string") el.textContent = value;
    };

    const updateHref = (el, value) => {
        if (!el || typeof value !== "string") return false;
        try {
            const url = new URL(value);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                return false;
            }
            el.href = url.toString();
            return true;
        } catch (e) {
            return false;
        }
    };

    const addThemeClass = (el, className) => {
        if (el && typeof className === "string" && /^[A-Za-z0-9_-]+$/.test(className)) {
            el.classList.add(className);
        }
    };

    updateText(document.getElementById("title"), window._env_.DEFAULT_TITLE);
    updateHref(document.getElementById("font"), window._env_.DEFAULT_FONT_URL);
    updateHref(document.getElementById("icon"), window._env_.DEFAULT_FAVICON);
    addThemeClass(document.body, window._env_.DEFAULT_THEME);
})();