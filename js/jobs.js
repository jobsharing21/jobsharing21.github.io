// Job search page: keyword/location search, type filters, load-more.
(function () {
  var PAGE_SIZE = 10;
  var all = [];
  var shown = PAGE_SIZE;
  var els = {};

  function filtered() {
    var kw = els.kw.value.trim().toLowerCase();
    var loc = els.loc.value.trim().toLowerCase();
    var checked = Array.prototype.filter.call(els.types, function (c) { return c.checked; })
      .map(function (c) { return c.value.toLowerCase(); });
    var allChecked = checked.length === els.types.length;
    return all.filter(function (j) {
      var text = (j.title + " " + j.company + " " + j.location + " " + j.type).toLowerCase();
      if (kw && text.indexOf(kw) === -1) return false;
      if (loc && (j.location || "").toLowerCase().indexOf(loc) === -1) return false;
      if (!allChecked && checked.indexOf((j.type || "").toLowerCase()) === -1) return false;
      return true;
    });
  }

  function render(reset) {
    if (reset) shown = PAGE_SIZE;
    var list = filtered();
    els.count.textContent = list.length === all.length ? "Showing all Jobs" : "Showing " + list.length + " of " + all.length + " jobs";
    if (!list.length) {
      els.list.innerHTML = '<div class="empty">No jobs match your search.</div>';
      els.more.style.display = "none";
      return;
    }
    els.list.innerHTML = list.slice(0, shown).map(JS.jobCard).join("");
    els.more.style.display = list.length > shown ? "block" : "none";
  }

  function init() {
    JS.mountLayout("jobs");
    els.kw = document.getElementById("kw");
    els.loc = document.getElementById("loc");
    els.types = document.querySelectorAll(".type-filter");
    els.list = document.getElementById("job-list");
    els.count = document.getElementById("results-count");
    els.more = document.getElementById("load-more");
    els.kw.addEventListener("input", function () { render(true); });
    els.loc.addEventListener("input", function () { render(true); });
    Array.prototype.forEach.call(els.types, function (c) { c.addEventListener("change", function () { render(true); }); });
    els.more.addEventListener("click", function () { shown += PAGE_SIZE; render(false); });
    els.list.innerHTML = '<div class="empty">Loading jobs&hellip;</div>';
    JS.fetchJSON("data/jobs.json").then(function (data) {
      all = data;
      render(true);
    }).catch(function () {
      els.list.innerHTML = '<div class="empty">Could not load jobs. Open this site through GitHub Pages or a local web server (see README).</div>';
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
