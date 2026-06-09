(() => {
  const toc = document.querySelector("[data-guide-toc]");
  if (!toc) return;

  const button = toc.querySelector(".toc-toggle");
  const links = toc.querySelector(".toc-links");
  if (!button || !links) return;

  const closeMenu = () => {
    toc.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    toc.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  };

  button.addEventListener("click", () => {
    if (toc.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!toc.classList.contains("is-open")) return;
    if (toc.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });
})();
