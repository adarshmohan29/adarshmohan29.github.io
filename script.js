(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ghUrl = (p) => `https://github.com/${GITHUB_USER}/${p.repo}`;

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
  $("#themeToggle").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  });

  /* ---------- Mobile menu ---------- */
  const nav = $("#nav");
  $("#menuBtn").addEventListener("click", () => nav.classList.toggle("open"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- Project cards ---------- */
  const ghIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.6 4.4 18.6 4.7 18.6 4.7c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>`;
  const grid = $("#projectsGrid");
  grid.innerHTML = PROJECTS.map(
    (p, i) => `
    <div class="project-card reveal" role="button" tabindex="0" data-index="${i}" aria-label="Open README for ${esc(p.title)}">
      <div class="pc-top">
        <span class="pc-cat">${esc(p.category || "")}</span>
        <div class="pc-icons">
          ${p.status ? `<span class="badge">${esc(p.status)}</span>` : ""}
          <a class="pc-gh" href="${ghUrl(p)}" target="_blank" rel="noopener" aria-label="${esc(p.title)} on GitHub" title="Open on GitHub">${ghIcon}</a>
        </div>
      </div>
      <h3>${esc(p.title)}</h3>
      <p class="pc-tag">${esc(p.tagline)}</p>
      ${p.highlights?.length ? `<ul class="pc-highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      <div class="pc-foot">
        <div class="chips">${(p.tech || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <span class="pc-read">Read README <span class="arr">→</span></span>
      </div>
    </div>`
  ).join("");

  $$(".project-card", grid).forEach((card) => {
    const open = (e) => {
      if (e.target.closest(".pc-gh")) return; // let the GitHub icon open GitHub
      openProject(PROJECTS[+card.dataset.index], card);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); }
    });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- README modal ---------- */
  const modal = $("#modal");
  const content = $("#modalContent");
  let lastFocus = null;

  async function fetchReadme(p) {
    const key = `readme:${p.repo}:${p.readmePath || ""}`;
    const cached = sessionStorage.getItem(key);
    if (cached) return cached;
    const path = p.readmePath || "README.md";
    // raw.githubusercontent.com has no API rate limit; fall back to the API if the file name differs.
    let res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${p.repo}/HEAD/${path}`);
    if (!res.ok && !p.readmePath) {
      res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${p.repo}/readme`, {
        headers: { Accept: "application/vnd.github.raw" },
      });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    try { sessionStorage.setItem(key, text); } catch {}
    return text;
  }

  // Turn relative links/images in the README into absolute GitHub URLs.
  function fixUrls(container, p) {
    const dir = (p.readmePath || "").split("/").slice(0, -1).join("/");
    const base = (kind) => `https://${kind === "raw" ? "raw.githubusercontent.com" : "github.com"}/${GITHUB_USER}/${p.repo}/${kind === "raw" ? "HEAD" : "blob/HEAD"}/${dir ? dir + "/" : ""}`;
    const isRel = (u) => u && !/^([a-z]+:|\/\/|#|data:)/i.test(u);
    const resolve = (u, kind) => {
      if (u.startsWith("/")) return `https://${kind === "raw" ? "raw.githubusercontent.com" : "github.com"}/${GITHUB_USER}/${p.repo}/${kind === "raw" ? "HEAD" : "blob/HEAD"}${u}`;
      return new URL(u, base(kind)).href;
    };
    $$("img", container).forEach((img) => {
      const src = img.getAttribute("src");
      if (isRel(src)) img.src = resolve(src, "raw");
      img.loading = "lazy";
    });
    $$("a", container).forEach((a) => {
      const href = a.getAttribute("href");
      if (href?.startsWith("#")) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const id = decodeURIComponent(href.slice(1));
          const target = container.querySelector(`[id="${CSS.escape(id)}"]`);
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
      if (isRel(href)) a.href = resolve(href, "blob");
      a.target = "_blank";
      a.rel = "noopener";
    });
    // GitHub-style heading anchors for in-README links
    $$("h1,h2,h3,h4,h5,h6", container).forEach((h) => {
      h.id = h.textContent.trim().toLowerCase().replace(/[^\w\- ]+/g, "").replace(/\s/g, "-");
    });
  }

  // Drop README sections listed in p.hideSections (heading text, any level) from the popup.
  function stripSections(md, names) {
    if (!names || !names.length) return md;
    const want = names.map((n) => n.toLowerCase());
    const out = [];
    let skipLevel = 0;
    for (const line of md.split("\n")) {
      const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (m) {
        const level = m[1].length;
        if (skipLevel && level <= skipLevel) skipLevel = 0;
        if (!skipLevel && want.includes(m[2].toLowerCase())) { skipLevel = level; continue; }
      }
      if (!skipLevel) out.push(line);
    }
    return out.join("\n");
  }

  function render(md, p) {
    md = stripSections(md, p.hideSections);
    const html = DOMPurify.sanitize(marked.parse(md, { gfm: true }), { ADD_ATTR: ["target", "align"] });
    content.innerHTML = html;
    fixUrls(content, p);
    $$("pre code", content).forEach((el) => window.hljs && hljs.highlightElement(el));
  }

  async function openProject(p, trigger) {
    lastFocus = trigger || document.activeElement;
    $("#modalTitle").textContent = p.title;
    $("#modalGithub").href = ghUrl(p);
    content.innerHTML = `<div class="loader"><div class="spinner"></div>Loading README from GitHub…</div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $(".modal-body").scrollTop = 0;
    $("[data-close].icon-btn", modal).focus();
    history.replaceState(null, "", `#project/${p.repo}`);

    if (p.localReadme) return render(p.localReadme, p);
    try {
      render(await fetchReadme(p), p);
    } catch (err) {
      content.innerHTML = `<div class="error-box">
        <p>Couldn't load the README right now (${esc(err.message)}).</p>
        <p style="margin-top:14px"><a class="btn primary sm" href="${ghUrl(p)}" target="_blank" rel="noopener">${ghIcon} Open it on GitHub</a></p>
      </div>`;
    }
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    history.replaceState(null, "", "#projects");
    lastFocus?.focus?.();
  }
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      const f = $$('a[href], button, [tabindex]:not([tabindex="-1"])', $(".modal-panel")).filter((el) => el.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Deep link: /#project/TriageMesh opens that README directly
  const m = location.hash.match(/^#project\/(.+)$/);
  if (m) {
    const p = PROJECTS.find((x) => x.repo === decodeURIComponent(m[1]));
    if (p) setTimeout(() => openProject(p), 300);
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Scroll-spy nav ---------- */
  const links = $$("a[data-section]", nav);
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.dataset.section === en.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  links.forEach((l) => { const s = document.getElementById(l.dataset.section); if (s) spy.observe(s); });
})();
