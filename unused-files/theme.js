// Dark mode toggle with persistence and simple event broadcast.
(() => {
  const STORAGE_KEY = "theme";
  const btn = document.getElementById("themeToggleBtn");
  const icon = document.getElementById("themeIcon");

  function apply(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    if (icon)
      icon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    localStorage.setItem(STORAGE_KEY, theme);
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme } })
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    apply(localStorage.getItem(STORAGE_KEY) || "light");
    btn &&
      btn.addEventListener("click", () => {
        const next =
          (localStorage.getItem(STORAGE_KEY) || "light") === "light"
            ? "dark"
            : "light";
        apply(next);
      });
  });
})();
