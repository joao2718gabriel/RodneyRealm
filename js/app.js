(function () {
  const data = window.RODNEY;
  if (!data) return;

  const projects = Array.isArray(data.projects) ? data.projects : [];
  const players = Array.isArray(data.players) ? data.players : [];
  const kindOrder = ["Farm", "Base", "Redstone", "Estrutura"];

  const grid = document.querySelector("#project-grid");
  const playerGrid = document.querySelector("#player-grid");
  const faqList = document.querySelector("#faq-list");
  const filterBar = document.querySelector("#filter-bar");
  const search = document.querySelector("#search");
  const resultCount = document.querySelector("#result-count");
  const banner = document.querySelector("#demo-banner");
  const backdrop = document.querySelector("#project-dialog");
  const panel = document.querySelector("#dialog-panel");
  const nav = document.querySelector("#site-nav");
  const navToggle = document.querySelector("#nav-toggle");

  let kind = "Todas";
  let query = "";
  let lastFocus = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatText(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  function playersOf(project) {
    return (project.players || [])
      .map((id) => players.find((player) => player.id === id))
      .filter(Boolean);
  }

  function projectsOf(player) {
    return projects.filter((project) => (project.players || []).includes(player.id));
  }

  function fallbackArt(project) {
    const dimension = String(project.dimension || "").toLowerCase();
    if (dimension.includes("nether")) return "images/placeholders/nether.svg";
    if (dimension.includes("end")) return "images/placeholders/end.svg";
    const kindArt = {
      Farm: "images/placeholders/farm.svg",
      Base: "images/placeholders/base.svg",
      Redstone: "images/placeholders/redstone.svg",
      Estrutura: "images/placeholders/estrutura.svg",
    };
    return kindArt[project.kind] || "images/placeholders/estrutura.svg";
  }

  function avatarUri(player) {
    const match = String(player.name || "").match(/\d+/);
    const label = match ? match[0] : (String(player.name || "?").trim().charAt(0) || "?").toUpperCase();
    let hash = 0;
    for (const char of player.id || player.name || "x") hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    const palette = ["#a6e85a", "#e8c56a", "#7ddec0", "#d5e38a"];
    const accent = palette[hash % palette.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <rect width="80" height="80" fill="#1b3128"/>
      <rect x="8" y="8" width="22" height="22" fill="${accent}"/>
      <rect x="50" y="50" width="22" height="22" fill="${accent}" opacity=".45"/>
      <text x="40" y="49" text-anchor="middle" font-family="Space Grotesk, Segoe UI, sans-serif" font-size="28" font-weight="700" fill="#f4f7f2">${escapeHtml(label)}</text>
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  function useImage(img, src, fallback) {
    img.src = fallback;
    img.alt = img.alt || "";
    if (!src || src === fallback) return;
    const probe = new Image();
    probe.onload = () => {
      img.src = src;
    };
    probe.src = src;
  }

  function mountLogo() {
    const img = document.querySelector(".brand-logo");
    const mark = document.querySelector(".brand-mark");
    const src = (data.logo || "images/logo.png").trim();
    if (!src) return;
    const probe = new Image();
    probe.onload = () => {
      img.src = src;
      img.hidden = false;
      mark.hidden = true;
    };
    probe.src = src;
  }

  function mountHero() {
    const src = String(data.hero || "").trim();
    if (!src) return;
    const hero = document.querySelector(".hero-image");
    const probe = new Image();
    probe.onload = () => {
      hero.src = src;
    };
    probe.src = src;
  }

  function mountAddress() {
    const address = data.address || "IP em breve";
    document.querySelector("#server-ip").textContent = address;
    const meta = document.querySelector("#hero-meta");
    const items = [...(data.meta || [])];
    if (data.edition) items.push(data.edition);
    meta.innerHTML = items
      .map((item) => `<span><i class="meta-mark" aria-hidden="true"></i>${escapeHtml(item)}</span>`)
      .join("");
  }

  function mountStats() {
    document.querySelector("#stat-projects").textContent = String(projects.length);
    document.querySelector("#stat-players").textContent = String(players.length);
  }

  function kinds() {
    const present = new Set(projects.map((project) => project.kind).filter(Boolean));
    const ordered = kindOrder.filter((item) => present.has(item));
    present.forEach((item) => {
      if (!ordered.includes(item)) ordered.push(item);
    });
    return ["Todas", ...ordered];
  }

  function countKind(item) {
    if (item === "Todas") return projects.length;
    return projects.filter((project) => project.kind === item).length;
  }

  function renderFilters() {
    filterBar.innerHTML = kinds()
      .map((item) => {
        const active = item === kind ? " active" : "";
        const pressed = item === kind ? "true" : "false";
        return `<button class="filter-chip${active}" type="button" data-kind="${escapeHtml(item)}" aria-pressed="${pressed}">${escapeHtml(item)}<span>${countKind(item)}</span></button>`;
      })
      .join("");
  }

  function matchesQuery(project) {
    if (!query) return true;
    const names = playersOf(project).map((player) => `${player.name} ${player.role}`).join(" ");
    const haystack = [project.name, project.kind, project.dimension, project.status, project.summary, project.about, names]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  }

  function visibleProjects() {
    return projects.filter((project) => (kind === "Todas" || project.kind === kind) && matchesQuery(project));
  }

  function renderProjects() {
    const visible = visibleProjects();
    const noun = visible.length === 1 ? "estrutura" : "estruturas";
    resultCount.textContent = query || kind !== "Todas" ? `${visible.length} ${noun}` : `${projects.length} estruturas e farms`;

    if (!visible.length) {
      grid.innerHTML = `<p class="empty-state">Nenhuma estrutura encontrada. Ajuste a busca ou o filtro, ou cadastre projetos em js/data.js.</p>`;
      return;
    }

    grid.innerHTML = visible
      .map((project) => {
        const members = playersOf(project);
        const names = members.length ? members.map((player) => player.name).join(", ") : "Jogadores a definir";
        const avatars = members
          .slice(0, 4)
          .map((player) => `<img alt="" data-src="${escapeHtml(player.image || "")}" data-fallback="${escapeHtml(avatarUri(player))}">`)
          .join("");
        const example = data.demo ? `<span class="mode-tag example">Exemplo</span>` : "";
        return `<a class="mode-card" href="#${escapeHtml(project.id)}">
          <div class="mode-art">
            <img alt="" data-src="${escapeHtml(project.image || "")}" data-fallback="${escapeHtml(fallbackArt(project))}">
            <span class="mode-tag">${escapeHtml(project.kind || "Estrutura")}</span>
            ${example}
          </div>
          <div class="mode-body">
            <div class="card-meta">
              <span class="dim">${escapeHtml(project.dimension || "Mapa")}</span>
              <span class="status" data-status="${escapeHtml(project.status || "")}">${escapeHtml(project.status || "")}</span>
            </div>
            <h3>${escapeHtml(project.name)}</h3>
            <p class="summary">${escapeHtml(project.summary || "")}</p>
            <div class="card-foot">
              <div class="avatar-stack">${avatars}</div>
              <p class="member-names">${escapeHtml(names)}</p>
            </div>
          </div>
        </a>`;
      })
      .join("");

    grid.querySelectorAll("img").forEach((img) => {
      useImage(img, img.dataset.src, img.dataset.fallback);
    });
  }

  function renderPlayers() {
    const needle = query.trim();
    const visible = players.filter((player) => {
      if (!needle) return true;
      const related = projectsOf(player).map((project) => project.name).join(" ");
      return `${player.name} ${player.role} ${related}`.toLowerCase().includes(needle);
    });

    if (!visible.length) {
      playerGrid.innerHTML = `<p class="empty-state">${players.length ? "Nenhum jogador encontrado para essa busca." : "Nenhum jogador cadastrado ainda. Adicione a lista em js/data.js."}</p>`;
      return;
    }

    playerGrid.innerHTML = visible
      .map((player) => {
        const related = projectsOf(player);
        const chips = related.length
          ? related.map((project) => `<a class="project-chip" href="#${escapeHtml(project.id)}">${escapeHtml(project.name)}</a>`).join("")
          : `<p class="quiet">Ainda não entra em nenhum projeto listado.</p>`;
        const example = data.demo ? `<p class="role">Exemplo · ${escapeHtml(player.role || "A definir")}</p>` : `<p class="role">${escapeHtml(player.role || "Jogador")}</p>`;
        return `<article class="player-card" id="player-${escapeHtml(player.id)}">
          <div class="player-id">
            <img class="player-avatar" alt="" data-src="${escapeHtml(player.image || "")}" data-fallback="${escapeHtml(avatarUri(player))}">
            <div>
              <h3>${escapeHtml(player.name)}</h3>
              ${example}
            </div>
          </div>
          <div>
            <p class="mini-label">Projetos</p>
            <div class="chip-list">${chips}</div>
          </div>
        </article>`;
      })
      .join("");

    playerGrid.querySelectorAll("img").forEach((img) => {
      useImage(img, img.dataset.src, img.dataset.fallback);
    });
  }

  function renderFaq() {
    const items = Array.isArray(data.faq) ? data.faq : [];
    faqList.innerHTML = items
      .map((item) => `<details class="faq-row">
          <summary>${escapeHtml(item.q)}<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M7 1v12M1 7h12" fill="none" stroke="currentColor" stroke-width="2"/></svg></summary>
          <p>${formatText(item.a)}</p>
        </details>`)
      .join("");
  }

  function fillDialog(project) {
    const image = document.querySelector("#dialog-image");
    image.alt = `Imagem de ${project.name}`;
    useImage(image, project.image || "", fallbackArt(project));
    document.querySelector("#dialog-kicker").textContent = data.demo ? `${project.kind || "Estrutura"} · Exemplo` : (project.kind || "Estrutura");
    document.querySelector("#dialog-title").textContent = project.name;
    document.querySelector("#dialog-copy").innerHTML = formatText(project.about || project.summary || "");

    const facts = [
      ["Dimensão", project.dimension],
      ["Status", project.status],
      ["Tipo", project.kind],
    ];
    if (project.coords) facts.push(["Coordenadas", project.coords]);
    document.querySelector("#dialog-facts").innerHTML = facts
      .filter(([, value]) => value)
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");

    const members = playersOf(project);
    const list = document.querySelector("#dialog-players");
    if (!members.length) {
      list.innerHTML = `<li class="quiet">Nenhum jogador vinculado a este projeto ainda.</li>`;
      return;
    }
    list.innerHTML = members
      .map((player) => `<li><a class="dialog-player" href="#player-${escapeHtml(player.id)}">
          <img class="mini-avatar" alt="" data-src="${escapeHtml(player.image || "")}" data-fallback="${escapeHtml(avatarUri(player))}">
          <span><strong>${escapeHtml(player.name)}</strong><br><span class="role">${escapeHtml(player.role || "")}</span></span>
        </a></li>`)
      .join("");
    list.querySelectorAll("img").forEach((img) => useImage(img, img.dataset.src, img.dataset.fallback));
  }

  function lockPage(locked) {
    document.body.classList.toggle("lock", locked);
    document.querySelectorAll("[data-lock]").forEach((element) => {
      element.inert = locked;
    });
  }

  function hideDialog() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    lockPage(false);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function openProject(project) {
    lastFocus = document.activeElement;
    fillDialog(project);
    backdrop.hidden = false;
    lockPage(true);
    document.querySelector("#dialog-close").focus();
  }

  function syncHash() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    const project = projects.find((item) => item.id === id);
    if (project) openProject(project);
    else hideDialog();
  }

  function closeToPage() {
    if (location.hash && projects.some((project) => project.id === decodeURIComponent(location.hash.slice(1)))) {
      history.pushState(null, "", location.pathname + location.search);
    }
    hideDialog();
  }

  function onKeydown(event) {
    if (backdrop.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeToPage();
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = [...panel.querySelectorAll("button, a, input, textarea, select")].filter((node) => !node.hidden);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function bind() {
    filterBar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-kind]");
      if (!button) return;
      kind = button.dataset.kind;
      filterBar.querySelectorAll(".filter-chip").forEach((chip) => {
        const on = chip.dataset.kind === kind;
        chip.classList.toggle("active", on);
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderProjects();
    });

    function openFromLink(event, selector) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const link = event.target.closest(selector);
      if (!link) return;
      event.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      syncHash();
    }

    grid.addEventListener("click", (event) => openFromLink(event, "a.mode-card"));
    playerGrid.addEventListener("click", (event) => openFromLink(event, "a.project-chip"));

    search.addEventListener("input", () => {
      query = search.value.trim().toLowerCase();
      renderProjects();
      renderPlayers();
    });

    document.querySelector("#copy-ip").addEventListener("click", async () => {
      const address = document.querySelector("#server-ip").textContent.trim();
      const button = document.querySelector("#copy-ip");
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(address);
        else {
          const area = document.createElement("textarea");
          area.value = address;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.left = "-999px";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        button.textContent = "Copiado";
      } catch {
        button.textContent = "Selecionar";
      }
      window.setTimeout(() => {
        button.textContent = "Copiar";
      }, 1600);
    });

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeToPage();
    });
    document.querySelector("#dialog-close").addEventListener("click", closeToPage);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);

    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.textContent = open ? "Fechar" : "Menu";
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
      }
    });

    const links = [...document.querySelectorAll(".site-nav a")];
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      sections.forEach((section) => observer.observe(section));
    }
  }

  function warnData() {
    const ids = new Set();
    projects.forEach((project) => {
      if (ids.has(project.id)) console.warn("Rodney Realm: id de projeto repetido:", project.id);
      ids.add(project.id);
      (project.players || []).forEach((id) => {
        if (!players.some((player) => player.id === id)) {
          console.warn("Rodney Realm: jogador não encontrado:", id, "em", project.id);
        }
      });
    });
  }

  if (data.demo) banner.hidden = false;
  mountLogo();
  mountHero();
  mountAddress();
  mountStats();
  renderFilters();
  renderProjects();
  renderPlayers();
  renderFaq();
  bind();
  syncHash();
  warnData();
})();
