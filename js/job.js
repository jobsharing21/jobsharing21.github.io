// Single job page: reads ?slug= and renders the matching job from data/jobs.json.
(function () {
  function init() {
    JS.mountLayout("jobs");
    var slug = new URLSearchParams(location.search).get("slug");
    var box = document.getElementById("job-box");
    JS.fetchJSON("data/jobs.json").then(function (jobs) {
      var job = jobs.filter(function (j) { return j.slug === slug; })[0];
      if (!job) {
        box.innerHTML = '<div class="empty">This job is no longer available. <a href="jobs.html">Browse current jobs</a>.</div>';
        return;
      }
      document.title = job.title + " - JobSharing";
      var fav = JS.isFav(job.id);
      var idx = jobs.indexOf(job);
      var prev = jobs[idx - 1], next = jobs[idx + 1];
      box.innerHTML =
        '<div class="job-detail">' +
          '<div class="job-main">' +
            '<p><a href="jobs.html">&larr; Back to all jobs</a></p>' +
            '<h1>' + JS.esc(job.title) + '</h1>' +
            '<div class="job-facts">' +
              '<span class="badge ' + JS.typeClass(job.type) + '">' + JS.esc(job.type) + '</span>' +
              '<span>' + JS.esc(job.location) + '</span>' +
              '<span>Posted ' + JS.fmtDate(job.posted) + '</span>' +
              (job.expires ? '<span>Closes ' + JS.fmtDate(job.expires) + '</span>' : '') +
            '</div>' +
            '<div class="job-body">' + job.description_html + '</div>' +
            // Body ad: between the description and the apply button
            '<div class="ad-body">' + JS.adSlot(JS.config.AD_SLOT_CONTENT, 'Advertisement') + '</div>' +
            (job.apply_url ? '<p class="apply-btn"><a class="btn" href="' + JS.esc(job.apply_url) + '" target="_blank" rel="noopener">Apply for job</a></p>' : '') +
            '<p><button class="fav-btn' + (fav ? ' on' : '') + '" id="fav" data-fav="' + job.id + '" style="font-size:15px;color:' + (fav ? 'var(--red)' : '#888') + '">&#9829; Save this job</button></p>' +
            '<p class="job-facts">' +
              (prev ? '<a href="job.html?slug=' + encodeURIComponent(prev.slug) + '">&larr; Previous job</a>' : '') +
              (next ? '<a href="job.html?slug=' + encodeURIComponent(next.slug) + '" style="margin-left:auto">Next job &rarr;</a>' : '') +
            '</p>' +
          '</div>' +
          // Side column
          '<aside class="job-side">' +
            '<div class="ad-side">' + JS.adSlot(JS.config.AD_SLOT_SIDEBAR, 'Advertisement') + '</div>' +
            JS.newsletterBox() +
            JS.donateBox() +
            JS.facebookBox() +
            '<div class="sidebar-box"><h3>Company</h3>' +
              '<p><strong>' + JS.esc(job.company) + '</strong></p>' +
              (job.company_website ? '<p><a href="' + JS.esc(job.company_website) + '" target="_blank" rel="noopener">Company website</a></p>' : '') +
            '</div>' +
          '</aside>' +
        '</div>';
      JS.initAds();
    }).catch(function () {
      box.innerHTML = '<div class="empty">Could not load this job. Open the site through GitHub Pages or a local web server (see README).</div>';
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
