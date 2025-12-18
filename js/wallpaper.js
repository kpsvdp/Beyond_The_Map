(() => {
  const wallpaper = document.getElementById("wallpaper");
  const toggleBtn = document.getElementById("dayNightToggle");
  if (!wallpaper || !toggleBtn) return;

  const setMode = (mode) => {
    wallpaper.classList.remove("day", "night");
    wallpaper.classList.add(mode);

    // Button shows the NEXT view to switch to
    toggleBtn.textContent = mode === "day" ? "🌙 Night View" : "🌞 Day View";
    localStorage.setItem("wallpaperMode", mode);
  };

  // Keep wallpaper in-sync with the global theme:
  // light theme  -> DAY wallpaper
  // dark theme   -> NIGHT wallpaper
  const themeToMode = (theme) => (theme === "dark" ? "night" : "day");

  const applyFromTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    setMode(themeToMode(theme));

    // Keep the Theme button label consistent even if wallpaper button changes theme
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.textContent = theme === "dark" ? "🌙 Theme" : "☀️ Theme";
  };

  // Initial load: follow theme (prevents the "reversed" feel)
  applyFromTheme();

  // If theme changes (via Theme button), update wallpaper automatically
  const obs = new MutationObserver((muts) => {
    if (muts.some((m) => m.type === "attributes" && m.attributeName === "data-theme")) {
      applyFromTheme();
    }
  });
  obs.observe(document.documentElement, { attributes: true });

  // Optional manual override: this also flips the theme so both stay aligned
  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("pb_theme", nextTheme);
    applyFromTheme();
  });
})();
