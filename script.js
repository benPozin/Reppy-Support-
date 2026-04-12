/**
 * Reppy Support — pet themes (click any pet with data-pet-theme)
 * EDIT: To add a pet theme, add html[data-theme="name"] { ... } in styles.css and include "name" in THEMES + THEME_COLORS below.
 */

(function () {
  "use strict";

  var STORAGE_KEY = "reppy-support-theme";
  var THEMES = ["flame", "water", "air", "earth", "lightning"];
  var THEME_COLORS = {
    flame: "#221811",
    water: "#111d25",
    air: "#151c23",
    earth: "#1c1812",
    lightning: "#21180d"
  };
  var THEME_HERO_IMAGES = {
    flame: "assets/flame-reppy.png",
    water: "assets/water-reppy.png",
    air: "assets/air-reppy.png",
    earth: "assets/earth-reppy.png",
    lightning: "assets/lightning-reppy.png"
  };

  function applyTheme(name) {
    if (THEMES.indexOf(name) === -1) {
      name = "flame";
    }
    document.documentElement.setAttribute("data-theme", name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch (e) {
      /* private mode / blocked storage */
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", THEME_COLORS[name] || THEME_COLORS.flame);
    }
    var hero = document.querySelector(".pet--hero");
    if (hero) {
      var src = THEME_HERO_IMAGES[name] || THEME_HERO_IMAGES.flame;
      hero.setAttribute("src", src);
      hero.setAttribute("alt", "Reppy " + name + " elemental pet");
      hero.setAttribute("data-pet-theme", name);
    }
  }

  function restoreTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    if (saved && THEMES.indexOf(saved) !== -1) {
      applyTheme(saved);
    }
  }

  function themeFromTarget(el) {
    if (!el || !el.closest) {
      return null;
    }
    var node = el.closest("[data-pet-theme]");
    if (!node) {
      return null;
    }
    return node.getAttribute("data-pet-theme");
  }

  function onActivate(event) {
    var name = themeFromTarget(event.target);
    if (!name) {
      return;
    }
    event.preventDefault();
    applyTheme(name);
  }

  function runParticleBurst(canvas) {
    if (!canvas || !canvas.getContext) {
      return;
    }
    var ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var root = getComputedStyle(document.documentElement);
    var accent = root.getPropertyValue("--accent").trim() || "#ff8c42";
    var bright = root.getPropertyValue("--accent-bright").trim() || "#ffb86b";
    var dim = root.getPropertyValue("--accent-dim").trim() || "#c45c1c";
    var colors = [accent, bright, dim, "#ffffff"];

    var cx = w * 0.5;
    var cy = h * 0.48;
    var particles = [];
    var i;
    var n = 380;
    for (i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = 3.5 + Math.random() * 10;
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.2,
        life: 0.92 + Math.random() * 0.08,
        decay: 0.008 + Math.random() * 0.006,
        size: 1.5 + Math.random() * 2.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    var frames = 0;
    var maxFrames = 52;

    function step() {
      ctx.clearRect(0, 0, w, h);
      var alive = false;
      for (i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.life <= 0) {
          continue;
        }
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.11;
        p.vx *= 0.985;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      frames++;
      if (alive && frames < maxFrames) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function initIntro() {
    var overlay = document.getElementById("intro-overlay");
    if (!overlay || !document.body.classList.contains("page-home")) {
      return;
    }

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      overlay.remove();
      return;
    }

    var canvas = document.getElementById("intro-particle-canvas");
    var skipBtn = overlay.querySelector(".intro-skip");
    var spinMs = 650;
    var burstHoldMs = 480;
    var exitMs = 340;
    var tSpin;
    var tBurst;
    var finished = false;

    function cleanupOverlay() {
      if (finished) {
        return;
      }
      finished = true;
      clearTimeout(tSpin);
      clearTimeout(tBurst);
      overlay.classList.add("intro-overlay--exit");
      document.body.classList.remove("intro-active");
      setTimeout(function () {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, exitMs);
    }

    function startBurst() {
      if (finished) {
        return;
      }
      overlay.classList.add("intro-overlay--burst");
      runParticleBurst(canvas);
      tBurst = setTimeout(cleanupOverlay, burstHoldMs);
    }

    document.body.classList.add("intro-active");
    if (skipBtn) {
      skipBtn.focus();
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", cleanupOverlay);
    }

    document.addEventListener("keydown", function onEsc(e) {
      if (e.key === "Escape" && overlay.parentNode) {
        document.removeEventListener("keydown", onEsc);
        cleanupOverlay();
      }
    });

    tSpin = setTimeout(startBurst, spinMs);
  }

  function init() {
    restoreTheme();

    document.body.addEventListener("click", onActivate);

    document.body.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      var name = themeFromTarget(event.target);
      if (!name) {
        return;
      }
      event.preventDefault();
      applyTheme(name);
    });

    initIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
