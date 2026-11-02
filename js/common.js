// Shared header, footer, favourites and helpers used by every page.
(function () {
  var NAV = [
    { label: "Homepage", href: "index.html", key: "home" },
    { label: "Jobs", href: "jobs.html", key: "jobs" },
    { label: "Donate Us", href: "donate.html", key: "donate" },
    { label: "About", key: "about", children: [
      { label: "Employees", href: "team.html" },
      { label: "Success Stories", href: "success-stories.html" },
      { label: "About Us", href: "about.html" }
    ] },
    { label: "Our Supports", href: "supports.html", key: "supports" },
    { label: "Blog", href: "blog.html", key: "blog" },
    { label: "Contact Us", href: "contact.html", key: "contact" }
  ];

  function renderHeader(active) {
    var items = NAV.map(function (n) {
      if (n.children) {
        var kids = n.children.map(function (c) { return '<a href="' + c.href + '">' + c.label + '</a>'; }).join("");
        return '<li class="dropdown"><a href="about.html"' + (active === n.key ? ' class="active"' : '') + '>' + n.label + '</a><div class="dropdown-menu">' + kids + '</div></li>';
      }
      return '<li><a href="' + n.href + '"' + (active === n.key ? ' class="active"' : '') + '>' + n.label + '</a></li>';
    }).join("");
    return '<div class="container">' +
      '<a class="logo" href="index.html"><img src="wp-content/uploads/2016/01/logo5.png" alt="JobSharing"></a>' +
      '<button class="menu-toggle" aria-label="Menu" onclick="document.getElementById(\'main-nav\').classList.toggle(\'open\')">&#9776;</button>' +
      '<nav class="main-nav" id="main-nav"><ul>' + items + '</ul></nav></div>';
  }

  function renderFooter() {
    return '<p class="cta">Do you need further assistance?</p>' +
      '<a class="btn" href="contact.html">Contact Us</a>' +
      '<div class="copy"><a href="privacy.html" style="color:#aaa">Privacy policy</a> &middot; &copy; ' + new Date().getFullYear() + ' JobSharing</div>';
  }

  function mountLayout(active) {
    var h = document.getElementById("site-header");
    if (h) { h.className = "site-header"; h.innerHTML = renderHeader(active); }
    var f = document.getElementById("site-footer");
    if (f) { f.className = "site-footer"; f.innerHTML = renderFooter(); }
    var top = document.createElement("a");
    top.href = "#"; top.className = "scroll-top"; top.innerHTML = "&#8679;"; top.setAttribute("aria-label", "Back to top");
    document.body.appendChild(top);
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 300); });
  }

  // ----- Favourites (saved in this browser only) -----
  function getFavs() {
    try { return JSON.parse(localStorage.getItem("js_favs") || "[]"); } catch (e) { return []; }
  }
  function setFavs(list) {
    try { localStorage.setItem("js_favs", JSON.stringify(list)); } catch (e) { /* storage blocked: ignore */ }
  }
  function isFav(id) { return getFavs().indexOf(id) !== -1; }
  function toggleFav(id) {
    var list = getFavs();
    var i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    setFavs(list);
    return i === -1;
  }

  // ----- Helpers -----
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
  }
  function typeClass(t) {
    t = (t || "").toLowerCase();
    if (t.indexOf("part") === 0) return "badge-part";
    if (t.indexOf("full") === 0) return "badge-full";
    return "badge-other";
  }
  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      return r.json();
    });
  }

  // One job row, same layout as the WordPress list.
  function jobCard(job) {
    var fav = isFav(job.id);
    return '<div class="job-card">' +
      '<div class="job-logo">&#127970;</div>' +
      '<div><h3 class="job-title"><a href="job.html?slug=' + encodeURIComponent(job.slug) + '">' + esc(job.title) + '</a></h3>' +
      '<div class="job-meta">' + esc(job.company) + (job.location ? ', ' + esc(job.location) : '') + '</div></div>' +
      '<div class="job-right">' +
        '<span class="muted">' + esc(job.location) + '</span><br>' +
        '<span class="badge ' + typeClass(job.type) + '">' + esc(job.type) + '</span><br>' +
        '<span class="muted">' + fmtDate(job.posted) + '</span>' +
        '<button class="fav-btn' + (fav ? ' on' : '') + '" data-fav="' + job.id + '" title="Save job" aria-label="Save job">&#9829;</button>' +
      '</div></div>';
  }

  // Click handler for heart buttons inside any job list.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".fav-btn");
    if (!btn) return;
    e.preventDefault();
    var id = parseInt(btn.getAttribute("data-fav"), 10);
    btn.classList.toggle("on", toggleFav(id));
  });


  // ----- Settings, ads, donate box and Facebook box -----
  var CFG = window.SITE_CONFIG || {};
  function isSet(v) { return v && String(v).indexOf("XXXX") === -1; }

  // Ad unit. Shows a grey placeholder until the AdSense IDs in js/config.js are set.
  function adSlot(slotId, label) {
    if (!(isSet(CFG.ADSENSE_CLIENT) && isSet(slotId))) {
      return '<div class="ad-placeholder">' + (label || 'Advertisement') + '</div>';
    }
    return '<ins class="adsbygoogle" style="display:block" data-ad-client="' + CFG.ADSENSE_CLIENT +
      '" data-ad-slot="' + slotId + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  }
  // Call after ad HTML is inserted into the page.
  function initAds() {
    if (!isSet(CFG.ADSENSE_CLIENT)) return;
    document.querySelectorAll("ins.adsbygoogle:not([data-ad-init])").forEach(function (el) {
      el.setAttribute("data-ad-init", "1");
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ad blocked or not loaded */ }
    });
  }

  function donateBox() {
    return '<div class="sidebar-box donate-box"><h3>Donate us</h3>' +
      '<p>JobSharing is run on donations. Thank you for helping people find work in Cork.</p>' +
      '<div class="amount-box"><span>&euro;</span><input type="number" min="1" step="0.5" value="5" id="side-amount" aria-label="Donation amount"></div>' +
      '<a class="btn" href="' + JS.esc(CFG.DONATE_URL || "donate.html") + '" target="_blank" rel="noopener">Donate now</a></div>';
  }

  function facebookBox() {
    var page = CFG.FACEBOOK_PAGE || "https://www.facebook.com/sharingjob";
    var src = "https://www.facebook.com/plugins/page.php?href=" + encodeURIComponent(page) +
      "&tabs=timeline&width=340&height=440&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true";
    return '<div class="sidebar-box"><h3>Find us on Facebook</h3>' +
      '<iframe src="' + src + '" width="100%" height="440" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allow="encrypted-media" loading="lazy" title="JobSharing on Facebook"></iframe></div>';
  }


  // ----- Newsletter sign-up (posts to Mailchimp) -----
  function newsletterBox() {
    // The Mailchimp sign-up lives in newsletter-embed.html (your official embed code).
    return '<div class="sidebar-box newsletter-box">' +
      '<iframe src="newsletter-embed.html" title="Newsletter sign-up" loading="lazy" ' +
      'style="width:100%;height:520px;border:0;display:block" scrolling="no"></iframe></div>';
  }

  window.JS = {
    mountLayout: mountLayout, fetchJSON: fetchJSON, esc: esc, fmtDate: fmtDate,
    jobCard: jobCard, typeClass: typeClass, isFav: isFav, toggleFav: toggleFav,
    adSlot: adSlot, initAds: initAds, donateBox: donateBox, facebookBox: facebookBox, config: CFG, newsletterBox: newsletterBox
  };
})();
