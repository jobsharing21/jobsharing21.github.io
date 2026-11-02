// Single blog post page: reads ?slug= and renders the matching post from data/blog.json.
(function () {
  function init() {
    JS.mountLayout("blog");
    var slug = new URLSearchParams(location.search).get("slug");
    var box = document.getElementById("post-box");
    JS.fetchJSON("data/blog.json").then(function (posts) {
      var post = posts.filter(function (p) { return p.slug === slug && p.content_html; })[0];
      if (!post) {
        box.innerHTML = '<p>This post could not be found. <a href="blog.html">Back to the blog</a>.</p>';
        return;
      }
      document.title = post.title + " - JobSharing";
      box.innerHTML =
        '<p><a href="blog.html">&larr; Back to the blog</a></p>' +
        '<h1>' + JS.esc(post.title) + '</h1>' +
        '<div class="date">' + JS.fmtDate(post.date) + '</div>' +
        '<div class="post-body">' + post.content_html + '</div>';
    }).catch(function () {
      box.innerHTML = '<p class="muted">This post could not be loaded.</p>';
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
