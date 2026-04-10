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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
