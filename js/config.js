// ==========================================================
// SITE SETTINGS – edit these values, then re-upload the site.
// Anything still set to XXXX is treated as "not set up yet":
// ad spaces show a grey placeholder instead of an ad.
// ==========================================================
window.SITE_CONFIG = {
  // Google Analytics 4 "Measurement ID" (starts with G-)
  // Also replace G-XXXXXXXXXX in the <head> of every .html page (see README.md).
  GA_ID: "G-XXXXXXXXXX",

  // Google AdSense publisher ID (starts with ca-pub-)
  // Also replace ca-pub-XXXXXXXXXXXXXXXX in the <head> of every .html page.
  ADSENSE_CLIENT: "ca-pub-XXXXXXXXXXXXXXXX",

  // Ad unit IDs from AdSense (Ads > By ad unit > Display ads)
  AD_SLOT_SIDEBAR: "XXXXXXXXXX",   // side column on job posts
  AD_SLOT_CONTENT: "XXXXXXXXXX",   // between the job description and the apply button

  // Donation button target (PayPal donate link, Buy Me a Coffee, Ko-fi, etc.)
  DONATE_URL: "https://www.paypal.com/donate",

  // Mailchimp embedded sign-up form action URL:
  // Mailchimp > Audience > Signup forms > Embedded forms > copy the value of action="..."
  // It looks like https://xxxx.us1.list-manage.com/subscribe/post?u=...&id=...
  MAILCHIMP_FORM_ACTION: "https://YOUR-SERVER.list-manage.com/subscribe/post?u=XXXX&id=XXXX",

  // Facebook page shown in the sidebar
  FACEBOOK_PAGE: "https://www.facebook.com/sharingjob"
};
