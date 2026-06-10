(() => {
  const input = document.getElementById("guide-search-input");
  const list = document.getElementById("guide-search-results");
  if (!input || !list) return;

  const stripEmoji = (text) =>
    text
      .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  const normalize = (text) => stripEmoji(text).toLowerCase();

  const firstSnippet = (root) => {
    const paragraph = root.querySelector("p");
    if (!paragraph) return "";
    return normalize(paragraph.textContent).slice(0, 160);
  };

  const addEntry = (entries, seen, entry) => {
    const key = `${entry.href}|${entry.title}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push(entry);
  };

  const buildIndex = () => {
    const entries = [];
    const seen = new Set();

    document.querySelectorAll(".guide-contents-list a[href^='#']").forEach((link) => {
      const href = link.getAttribute("href");
      const title = stripEmoji(link.textContent);
      const group = stripEmoji(
        link.closest(".guide-contents-group")?.querySelector(".guide-contents-group-label")?.textContent || ""
      );
      const target = document.querySelector(href);

      addEntry(entries, seen, {
        href,
        title,
        group: group || "Contents",
        text: normalize(`${title} ${group}`),
        snippet: target ? firstSnippet(target) : "",
      });
    });

    document.querySelectorAll(".guide-section[id]").forEach((section) => {
      const href = `#${section.id}`;
      const heading = section.querySelector("h2");
      const sectionNum = section.querySelector(".section-num");
      const title = heading ? stripEmoji(heading.textContent) : section.id;
      const group = sectionNum ? stripEmoji(sectionNum.textContent) : "Guide section";

      addEntry(entries, seen, {
        href,
        title,
        group,
        text: normalize(`${title} ${group} ${firstSnippet(section)}`),
        snippet: firstSnippet(section),
      });

      section.querySelectorAll("h3[id]").forEach((subheading) => {
        const subHref = `#${subheading.id}`;
        const subTitle = stripEmoji(subheading.textContent);

        addEntry(entries, seen, {
          href: subHref,
          title: subTitle,
          group: title,
          text: normalize(`${subTitle} ${title} ${group}`),
          snippet: firstSnippet(subheading.parentElement || section),
        });
      });
    });

    document.querySelectorAll(".guide-glossary tbody tr").forEach((row) => {
      const signal = row.querySelector("td:first-child");
      const meaning = row.querySelector("td:nth-child(2)");
      if (!signal || !meaning) return;

      const title = stripEmoji(signal.textContent);
      const snippet = normalize(meaning.textContent).slice(0, 120);

      addEntry(entries, seen, {
        href: "#symptom-glossary",
        title: `Symptom: ${title}`,
        group: "Symptom glossary",
        text: normalize(`${title} ${snippet} symptom glossary`),
        snippet,
      });
    });

    const aliases = [
      { terms: ["recall", "come back", "come when called", "bolting", "run away"], href: "#expectations" },
      { terms: ["sit", "wait", "earned access", "nothing for free", "consent", "release"], href: "#pillars" },
      { terms: ["bark", "barking", "yap", "fixation", "reactive", "reactivity"], href: "#butt-push" },
      { terms: ["jump", "jumping", "lunging", "mouthing"], href: "#collar-snatch" },
      { terms: ["pulling", "slack leash", "heel"], href: "#leash" },
      { terms: ["off lead", "off-lead", "freedom", "access"], href: "#access" },
      { terms: ["treat", "treats", "reward", "food motivated"], href: "#rewards" },
      { terms: ["one second", "timing", "association window"], href: "#timing" },
      { terms: ["door", "doorway", "threshold", "front door"], href: "#front-door" },
      { terms: ["check in", "check-in", "seven seconds", "7 second"], href: "#check-in-seven" },
      { terms: ["anxiety", "calm leadership", "owner energy"], href: "#owner-mindset" },
      { terms: ["staffy", "collie", "breed", "terrier"], href: "#breed-temperament" },
      { terms: ["baby talk", "lap dog", "eye gazing", "pitfalls"], href: "#common-pitfalls" },
      { terms: ["panting", "lip lick", "shake off", "stiffening"], href: "#symptom-glossary" },
      { terms: ["dog fight", "dog meeting", "socialisation", "socialization"], href: "#dog-meetings" },
      { terms: ["trauma", "fearful", "shutdown"], href: "#trauma-signals" },
      { terms: ["daily", "practice", "three weeks", "routine"], href: "#daily" },
      { terms: ["graduation", "puppy dynamic", "relentless"], href: "#graduation" },
    ];

    aliases.forEach((alias) => {
      const entry = entries.find((item) => item.href === alias.href);
      if (!entry) return;
      entry.text += ` ${normalize(alias.terms.join(" "))}`;
    });

    return entries;
  };

  const index = buildIndex();
  let activeIndex = -1;

  const scoreEntry = (entry, query) => {
    const title = normalize(entry.title);
    const text = entry.text;
    const words = query.split(/\s+/).filter(Boolean);

    let score = 0;

    if (title === query) score += 120;
    if (title.startsWith(query)) score += 90;
    if (title.includes(query)) score += 70;

    words.forEach((word) => {
      if (title.startsWith(word)) score += 40;
      else if (title.includes(word)) score += 28;
      else if (text.includes(word)) score += 16;
    });

    if (text.includes(query)) score += 24;
    if (entry.snippet.includes(query)) score += 12;

    return score;
  };

  const getMatches = (query) => {
    const normalizedQuery = normalize(query);
    if (normalizedQuery.length < 2) return [];

    return index
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 8)
      .map((result) => result.entry);
  };

  const closeList = () => {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    list.querySelectorAll("[aria-selected='true']").forEach((item) => {
      item.setAttribute("aria-selected", "false");
    });
  };

  const openList = () => {
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };

  const navigateTo = (href) => {
    const target = document.querySelector(href);
    if (!target) return;

    closeList();
    input.value = "";
    history.replaceState(null, "", href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  const renderMatches = (matches) => {
    list.innerHTML = "";

    if (!matches.length) {
      const empty = document.createElement("li");
      empty.className = "guide-search-empty";
      empty.setAttribute("role", "presentation");
      empty.textContent = "No matching sections — try recall, leash, reactivity, or front door.";
      list.appendChild(empty);
      openList();
      return;
    }

    matches.forEach((entry, itemIndex) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "guide-search-option";
      button.setAttribute("role", "option");
      button.setAttribute("id", `guide-search-option-${itemIndex}`);
      button.dataset.href = entry.href;

      const title = document.createElement("span");
      title.className = "guide-search-option-title";
      title.textContent = entry.title;

      const meta = document.createElement("span");
      meta.className = "guide-search-option-meta";
      meta.textContent = entry.group;

      button.append(title, meta);
      button.addEventListener("click", () => navigateTo(entry.href));
      item.appendChild(button);
      list.appendChild(item);
    });

    openList();
  };

  const setActiveOption = (nextIndex) => {
    const options = list.querySelectorAll(".guide-search-option");
    if (!options.length) return;

    activeIndex = (nextIndex + options.length) % options.length;

    options.forEach((option, optionIndex) => {
      const selected = optionIndex === activeIndex;
      option.setAttribute("aria-selected", selected ? "true" : "false");
      if (selected) {
        input.setAttribute("aria-activedescendant", option.id);
      }
    });
  };

  input.addEventListener("input", () => {
    renderMatches(getMatches(input.value));
    activeIndex = -1;
    input.removeAttribute("aria-activedescendant");
  });

  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 2) {
      renderMatches(getMatches(input.value));
    }
  });

  input.addEventListener("keydown", (event) => {
    const options = list.querySelectorAll(".guide-search-option");

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (list.hidden) renderMatches(getMatches(input.value));
      setActiveOption(activeIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (list.hidden) renderMatches(getMatches(input.value));
      setActiveOption(activeIndex <= 0 ? options.length - 1 : activeIndex - 1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && options[activeIndex]) {
        navigateTo(options[activeIndex].dataset.href);
        return;
      }

      const matches = getMatches(input.value);
      if (matches[0]) navigateTo(matches[0].href);
      return;
    }

    if (event.key === "Escape") {
      closeList();
      input.blur();
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".guide-search-field")) return;
    closeList();
  });
})();
