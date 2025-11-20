(function () {
    const updateText = (el, value) => {
        if (el && typeof value === "string") el.textContent = value;
    };

    const updateHref = (el, value) => {
        if (el && typeof value === "string") {
            try {
                const url = new URL(value, window.location.origin);
                if (url.protocol === "http:" || url.protocol === "https:") {
                    el.href = url.toString();
                }
            } catch (e) {
                console.error("Invalid URL:", value);
            }
        }
    };

    const addThemeClass = (el, className) => {
        if (el && typeof className === "string" && /^[A-Za-z0-9_-]+$/.test(className)) {
            el.classList.add(className);
        }
    };
    const setFontFamily = (value) => {
        if (typeof value === "string" && value.trim()) {
            document.documentElement.style.setProperty("--iv-font-base", value);
        }
    };

    updateText(document.getElementById("title"), window._env_.DEFAULT_TITLE);
    updateHref(document.getElementById("font"), window._env_.DEFAULT_FONT_URL);
    updateHref(document.getElementById("icon"), window._env_.DEFAULT_FAVICON);
    addThemeClass(document.body, window._env_.DEFAULT_THEME);
    setFontFamily(window._env_.DEFAULT_FONT_FAMILY);
})();
