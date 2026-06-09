(() => {
  const triggers = document.querySelectorAll(".hero-photo-trigger");
  const dialog = document.getElementById("photo-lightbox");
  const dialogImg = document.getElementById("photo-lightbox-img");
  const dialogCaption = document.getElementById("photo-lightbox-caption");
  const closeButton = dialog?.querySelector(".photo-lightbox-close");
  const preview = document.getElementById("hero-photo-preview");
  const previewImg = preview?.querySelector("img");

  if (!triggers.length || !dialog || !dialogImg || !preview || !previewImg) return;

  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const preloaded = new Set();

  const preload = (src) => {
    if (preloaded.has(src)) return;
    preloaded.add(src);
    const img = new Image();
    img.src = src;
  };

  const hidePreview = () => {
    preview.classList.remove("is-preview-visible");
    previewImg.removeAttribute("src");
  };

  const positionPreview = (trigger) => {
    const rect = trigger.getBoundingClientRect();
    const previewWidth = 300;
    const previewHeight = 300;
    let left = rect.right + 12;
    let top = rect.top + rect.height / 2 - previewHeight / 2;

    if (left + previewWidth > window.innerWidth - 12) {
      left = rect.left - previewWidth - 12;
    }

    top = Math.max(12, Math.min(top, window.innerHeight - previewHeight - 12));
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
  };

  const showPreview = (trigger) => {
    const src = trigger.dataset.fullSrc;
    if (!src) return;

    preload(src);
    previewImg.src = src;
    previewImg.alt = trigger.querySelector("img")?.alt || "";
    positionPreview(trigger);
    preview.classList.add("is-preview-visible");
  };

  const openDialog = (trigger) => {
    const src = trigger.dataset.fullSrc;
    const img = trigger.querySelector("img");
    if (!src) return;

    preload(src);
    dialogImg.src = src;
    dialogImg.alt = img?.alt || "";
    dialogCaption.textContent = trigger.getAttribute("aria-label")?.replace(/^View larger photo of\s+/i, "") || img?.alt || "";
    hidePreview();

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  };

  triggers.forEach((trigger) => {
    if (hoverCapable) {
      trigger.addEventListener("mouseenter", () => showPreview(trigger));
      trigger.addEventListener("mouseleave", hidePreview);
      trigger.addEventListener("focus", () => showPreview(trigger));
      trigger.addEventListener("blur", hidePreview);
    }

    trigger.addEventListener("click", () => openDialog(trigger));
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialogImg.removeAttribute("src");
    dialogCaption.textContent = "";
  });

  window.addEventListener(
    "scroll",
    () => {
      if (preview.classList.contains("is-preview-visible")) hidePreview();
    },
    { passive: true }
  );
})();
