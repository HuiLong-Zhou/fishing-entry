(function () {
  "use strict";

  const scene = document.querySelector("#ocean-scene");
  const fishLayer = document.querySelector("#fish-layer");
  const fishTemplate = document.querySelector("#fish-template");
  const fallbackLinks = document.querySelector("#fallback-links");
  const fishingLine = document.querySelector("#fishing-line");
  const fishingHook = document.querySelector("#fishing-hook");
  const boatGroup = document.querySelector(".boat-group");
  const boatReflection = document.querySelector(".boat-reflection");
  const sun = document.querySelector(".sun");
  const sunHalo = document.querySelector(".sun-halo");
  const links = Array.isArray(window.SITE_LINKS) ? window.SITE_LINKS : [];

  if (!scene || !fishLayer || !fishTemplate || !fishingLine || !fishingHook) {
    return;
  }

  let rodTip = { x: 847, y: 353 };
  const defaultHook = { x: 1005, y: 596 };
  const oceanBounds = {
    desktop: { minX: 220, maxX: 1490, minY: 470, maxY: 825 },
    mobile: { minX: 410, maxX: 790, minY: 430, maxY: 820 }
  };

  let activePointer = false;
  let currentHook = null;
  let layoutFrame = 0;

  function svgPointFromEvent(event) {
    const point = scene.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(scene.getScreenCTM().inverse());
  }

  function isCompactLayout() {
    const viewBox = scene.viewBox.baseVal;
    return viewBox.width <= 1240 || window.matchMedia("(max-width: 760px), (max-aspect-ratio: 4 / 5)").matches;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function clampHook(point) {
    const bounds = isCompactLayout() ? oceanBounds.mobile : oceanBounds.desktop;
    return {
      x: clamp(point.x, bounds.minX, bounds.maxX),
      y: clamp(point.y, bounds.minY, bounds.maxY)
    };
  }

  function updateFishingLine(point) {
    const target = clampHook(point);
    const distance = Math.hypot(target.x - rodTip.x, target.y - rodTip.y);
    const sag = clamp(distance * 0.16, 38, 112);
    const controlX = (rodTip.x + target.x) / 2;
    const controlY = (rodTip.y + target.y) / 2 + sag;

    currentHook = target;
    fishingLine.setAttribute(
      "d",
      `M ${rodTip.x} ${rodTip.y} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${target.x.toFixed(2)} ${target.y.toFixed(2)}`
    );
    fishingHook.setAttribute("transform", `translate(${target.x.toFixed(2)} ${target.y.toFixed(2)})`);
  }

  function setDefaultHook() {
    const compact = isCompactLayout();
    updateFishingLine(
      compact
        ? { x: 668, y: 582 }
        : defaultHook
    );
  }

  function applyFishLayout() {
    const compact = isCompactLayout();
    scene.setAttribute("viewBox", compact ? "0 0 1200 900" : "0 0 1600 900");

    if (boatGroup && boatReflection) {
      const boatTransform = compact ? "translate(220 172) scale(0.6)" : null;

      if (boatTransform) {
        boatGroup.setAttribute("transform", boatTransform);
        boatReflection.setAttribute("transform", "translate(220 172) scale(0.6)");
      } else {
        boatGroup.removeAttribute("transform");
        boatReflection.removeAttribute("transform");
      }
    }

    if (sun && sunHalo) {
      const sunRadius = compact ? 48 : 67;
      const haloRadius = compact ? 168 : 245;
      const sunX = compact ? 748 : 1120;
      const sunY = compact ? 232 : 330;

      sun.setAttribute("cx", sunX);
      sun.setAttribute("cy", sunY);
      sun.setAttribute("r", sunRadius);
      sunHalo.setAttribute("cx", sunX);
      sunHalo.setAttribute("cy", sunY);
      sunHalo.setAttribute("r", haloRadius);
      rodTip = compact
        ? { x: 220 + 847 * 0.6, y: 172 + 353 * 0.6 }
        : { x: 847, y: 353 };
    }

    fishLayer.querySelectorAll(".fish-link").forEach((link) => {
      const config = link.fishConfig;
      const position = compact ? config.mobilePosition : config.desktopPosition;
      const scale = Number.isFinite(config.scale) ? config.scale : 1;

      if (Array.isArray(position) && position.length === 2) {
        link.setAttribute("transform", `translate(${position[0]} ${position[1]}) scale(${scale})`);
      }
    });

    if (!activePointer) {
      setDefaultHook();
    }
  }

  function requestFishLayout() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(applyFishLayout);
  }

  function createFish(config, index) {
    const fish = fishTemplate.content.firstElementChild?.firstElementChild?.cloneNode(true);

    if (!fish) {
      return null;
    }

    const title = fish.querySelector(".fish-label-title");
    const colors = config.colors || {};

    fish.classList.add(`fish--${config.id}`);
    const target = config.target || "_blank";

    fish.setAttribute("href", config.url);
    fish.setAttribute("target", target);
    fish.setAttribute("rel", target === "_blank" ? "noopener noreferrer" : "");
    fish.setAttribute("aria-label", `前往 ${config.name}`);
    fish.fishConfig = config;
    fish.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.assign(config.url);
    });
    fish.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.assign(config.url);
      }
    });

    if (title) {
      title.textContent = config.name;
    }

    fish.style.setProperty("--fish-body", colors.body || "#d98a57");
    fish.style.setProperty("--fish-light", colors.light || "#ffe0a7");
    fish.style.setProperty("--fish-accent", colors.accent || "#b9624d");
    fish.style.setProperty("--fish-glow", colors.glow || "rgba(244, 172, 101, 0.5)");
    fish.style.animationDelay = `${index * -0.22}s`;

    return fish;
  }

  function renderFish() {
    const fragment = document.createDocumentFragment();

    links.forEach((config, index) => {
      if (!config || !config.id || !config.name || !config.url) {
        return;
      }

      const fish = createFish(config, index);

      if (fish) {
        fragment.appendChild(fish);
      }
    });

    fishLayer.replaceChildren(fragment);
  }

  function renderFallbackLinks() {
    if (!fallbackLinks) {
      return;
    }

    const fragment = document.createDocumentFragment();

    links.forEach((config) => {
      if (!config || !config.name || !config.url) {
        return;
      }

      const link = document.createElement("a");
      link.href = config.url;
      link.target = config.target || "_blank";
      link.rel = link.target === "_blank" ? "noopener noreferrer" : "";
      link.textContent = config.name;
      link.style.setProperty("--link-color", config.colors?.body || "#f3bd83");
      fragment.appendChild(link);
    });

    fallbackLinks.replaceChildren(fragment);
  }

  scene.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    activePointer = true;
    updateFishingLine(svgPointFromEvent(event));
  });

  scene.addEventListener("pointerleave", () => {
    activePointer = false;
    setDefaultHook();
  });

  window.addEventListener("resize", requestFishLayout);
  window.addEventListener("orientationchange", requestFishLayout);

  renderFish();
  renderFallbackLinks();
  applyFishLayout();

  if (!currentHook) {
    setDefaultHook();
  }

  document.documentElement.classList.add("is-ready");
})();
