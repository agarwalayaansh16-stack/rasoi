/* Rasoi Indian Restaurant — interactions (no dependencies) */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var config = window.RASOI_CONFIG || {};
  var body = document.body;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  /* ---------- Sticky header state ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(!body.classList.contains("nav-open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960 && body.classList.contains("nav-open")) setMenu(false);
  });

  /* ---------- Active nav link while scrolling ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var active = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  // Stagger siblings inside the same parent for a softer cascade
  reveals.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains("reveal");
    });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", Math.min(i * 0.09, 0.45) + "s");
  });

  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Image fallback: hide broken images, keep branded backdrop ---------- */
  document.querySelectorAll("img").forEach(function (img) {
    function fail() { img.classList.add("img-failed"); }
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener("error", fail);
  });

  /* ---------- Booking links (configurable) ---------- */
  if (config.bookingUrl) {
    document.querySelectorAll("[data-book]").forEach(function (a) {
      a.setAttribute("href", config.bookingUrl);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Social links (configurable; hidden until set) ---------- */
  var social = config.social || {};
  document.querySelectorAll("[data-social]").forEach(function (li) {
    var url = social[li.getAttribute("data-social")];
    if (url) {
      li.querySelector("a").setAttribute("href", url);
      li.hidden = false;
    }
  });

  /* ---------- Booking form → pre-filled email ---------- */
  var form = document.getElementById("booking-form");
  var status = document.getElementById("form-status");
  var dateInput = document.getElementById("bf-date");

  // Earliest selectable date = today (local time)
  var now = new Date();
  var today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = today;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var required = form.querySelectorAll("[required]");
    var firstInvalid = null;
    required.forEach(function (field) {
      var ok = field.value.trim() !== "" && field.checkValidity();
      field.classList.toggle("is-invalid", !ok);
      field.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      status.textContent = "Please fill in your name, phone, date and time.";
      status.className = "form-note is-error";
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var location = data.get("location");
    var subject = "Table booking request — Rasoi " + location;
    var lines = [
      "Hello Rasoi team,",
      "",
      "I would like to request a table:",
      "",
      "Location: Rasoi " + location,
      "Date: " + data.get("date"),
      "Time: " + data.get("time"),
      "Guests: " + data.get("guests"),
      "Name: " + data.get("name"),
      "Phone: " + data.get("phone")
    ];
    var notes = (data.get("notes") || "").trim();
    if (notes) lines.push("Notes: " + notes);
    lines.push("", "Thank you!");

    var email = config.bookingEmail || "Gardenrasoi@gmail.com";
    var href = "mailto:" + email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    window.location.href = href;

    status.textContent = "Your email app should open with the request ready to send. If it doesn't, email " + email + " or call the restaurant directly.";
    status.className = "form-note is-success";
  });

  form.addEventListener("input", function (e) {
    if (e.target.classList.contains("is-invalid") && e.target.value.trim() !== "") {
      e.target.classList.remove("is-invalid");
      e.target.removeAttribute("aria-invalid");
    }
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
