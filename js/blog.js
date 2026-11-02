// Blog list page (and "Latest news" on the home page).
(function () {
  function card(p) {
    return '<div class="blog-card"><h3><a href="blog.html">' + JS.esc(p.title) + '</a></h3>' +
      '<div class="date">' + JS.fmtDate(p.date) + '</div><p>' + JS.esc(p.excerpt) + '</p></div>';
  }
  window.renderBlog = function (targetId, limit, perPage) {
    var el = document.getElementById(targetId);
    if (!el) return;
    JS.fetchJSON("data/blog.json").then(function (posts) {
      var list = limit ? posts.slice(0, limit) : posts;
      var shown = perPage || list.length;
      function draw() {
        el.innerHTML = list.slice(0, shown).map(card).join("");
        var more = document.getElementById(targetId + "-more");
        if (more) more.style.display = list.length > shown ? "inline-block" : "none";
      }
      draw();
      var more = document.getElementById(targetId + "-more");
      if (more) more.addEventListener("click", function () { shown += perPage; draw(); });
    }).catch(function () {
      el.innerHTML = '<p class="muted">News could not be loaded.</p>';
    });
  };
})();
