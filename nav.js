(() => {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  const button = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".site-header-nav");
  if (!button || !nav) return;

  const closeMenu = () => {
    header.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    button.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    header.classList.add("is-open");
    document.body.classList.add("nav-open");
    button.setAttribute("aria-expanded", "true");
  };

  button.addEventListener("click", () => {
    if (header.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("is-open")) return;
    if (header.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });
})();
