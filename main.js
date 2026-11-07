/* Shared behaviour: theme toggle, footer year, project rendering + filters */

(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }
})();

function renderProjects(projects) {
  var grid = document.getElementById("grid");
  var filters = document.getElementById("filters");
  if (!grid || !filters) return;

  var categories = ["All"].concat(
    Array.from(new Set(projects.map(function (p) { return p.category; })))
  );
  var active = "All";

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function drawFilters() {
    filters.innerHTML = categories.map(function (c) {
      return '<button class="filter' + (c === active ? " active" : "") +
        '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");
  }

  function drawGrid() {
    var list = projects.filter(function (p) {
      return active === "All" || p.category === active;
    });

    if (!list.length) {
      grid.innerHTML = '<p class="empty">No projects in this category yet.</p>';
      return;
    }

    grid.innerHTML = list.map(function (p, i) {
      var thumb = p.image
        ? '<div class="thumb" style="background:url(' + esc(p.image) + ') center/cover"></div>'
        : '<div class="thumb" style="background:linear-gradient(135deg,' +
          (p.colors ? p.colors[0] : "#5b5bf0") + "," +
          (p.colors ? p.colors[1] : "#8b5cf6") + ')">' + (p.emoji || "✨") + "</div>";

      var tags = (p.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + "</span>";
      }).join("");

      var links = "";
      if (p.demo) links += '<a href="' + esc(p.demo) + '" target="_blank" rel="noopener">Live demo ↗</a>';
      if (p.code) links += '<a href="' + esc(p.code) + '" target="_blank" rel="noopener">Code ↗</a>';

      return '<article class="project" style="animation-delay:' + i * 60 + 'ms">' +
        thumb +
        '<div class="project-body">' +
          "<h3>" + esc(p.title) + "</h3>" +
          "<p>" + esc(p.description) + "</p>" +
          '<div class="tags">' + tags + "</div>" +
          '<div class="links">' + links + "</div>" +
        "</div></article>";
    }).join("");
  }

  filters.addEventListener("click", function (e) {
    var b = e.target.closest(".filter");
    if (!b) return;
    active = b.getAttribute("data-cat");
    drawFilters();
    drawGrid();
  });

  drawFilters();
  drawGrid();
}
