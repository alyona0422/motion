(() => {
  const controlCenter = document.getElementById("controlCenter");
  if (!controlCenter) return;

  const shell = document.querySelector(".device-shell");
  const content = document.querySelector(".content");
  const panel = document.getElementById("controlCenterPanel");
  const handle = document.getElementById("controlCenterHandle");
  const panelDragZone = document.getElementById("controlCenterDrag");
  const scrim = document.getElementById("controlCenterScrim");
  const fab = document.getElementById("controlCenterFab");
  const wifiTile = document.getElementById("wifiToggleTile");
  const btTile = document.getElementById("btToggleTile");

  if (!shell || !content || !panel || !handle || !panelDragZone || !scrim) return;

  let panelOffset = 0;
  let openProgress = 0;
  let isOpen = false;
  let dragState = null;
  let suppressHandleClick = false;
  let suppressFabClick = false;

  function updateOffset() {
    const height = panel.getBoundingClientRect().height || 280;
    panelOffset = Math.max(height + 18, 280);
    applyProgress(openProgress);
  }

  function applyProgress(nextProgress) {
    const clamped = Math.max(0, Math.min(1, nextProgress));
    openProgress = clamped;
    const translateY = (-panelOffset) + panelOffset * clamped;
    panel.style.transform = `translateY(${translateY}px)`;
    scrim.style.opacity = String(clamped);
    controlCenter.classList.toggle("is-open", clamped > 0);
    if (clamped > 0.98) {
      document.body.classList.add("cc-open");
      isOpen = true;
      handle.setAttribute("aria-expanded", "true");
    } else if (clamped < 0.02) {
      document.body.classList.remove("cc-open");
      isOpen = false;
      handle.setAttribute("aria-expanded", "false");
    }
  }

  function openCenter() {
    panel.style.removeProperty("transition");
    scrim.style.removeProperty("transition");
    requestAnimationFrame(() => {
      panel.style.transition = "";
      scrim.style.transition = "";
      applyProgress(1);
    });
  }

  function closeCenter() {
    panel.style.removeProperty("transition");
    scrim.style.removeProperty("transition");
    requestAnimationFrame(() => {
      panel.style.transition = "";
      scrim.style.transition = "";
      applyProgress(0);
    });
  }

  function startDragOpen(pointerId, clientY) {
    dragState = {
      pointerId,
      mode: "open",
      startY: clientY,
      moved: false
    };
    panel.style.transition = "none";
    scrim.style.transition = "none";
  }

  function startDragClose(pointerId, clientY) {
    dragState = {
      pointerId,
      mode: "close",
      startY: clientY,
      moved: false
    };
    panel.style.transition = "none";
    scrim.style.transition = "none";
  }

  function onPointerMove(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const deltaY = event.clientY - dragState.startY;
    if (Math.abs(deltaY) > 4) dragState.moved = true;

    if (dragState.mode === "open") {
      const progress = Math.max(0, Math.min(1, deltaY / panelOffset));
      applyProgress(progress);
    } else {
      const progress = Math.max(0, Math.min(1, 1 + (deltaY / panelOffset)));
      applyProgress(progress);
    }
  }

  function onPointerUp(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const finalProgress = openProgress;
    const mode = dragState.mode;
    const moved = dragState.moved;
    dragState = null;
    panel.style.transition = "";
    scrim.style.transition = "";
    if (mode === "open") {
      if (finalProgress > 0.32) openCenter();
      else closeCenter();
      if (!moved) openCenter();
      suppressHandleClick = moved;
    } else {
      if (finalProgress < 0.68) closeCenter();
      else openCenter();
    }
  }

  handle.classList.add("cc-handle");
  handle.setAttribute("aria-expanded", "false");
  handle.addEventListener("click", () => {
    if (suppressHandleClick) {
      suppressHandleClick = false;
      return;
    }
    if (isOpen) closeCenter();
    else openCenter();
    handle.setAttribute("aria-expanded", String(!isOpen));
  });
  handle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) closeCenter();
      else openCenter();
    }
  });
  handle.addEventListener("pointerdown", (event) => {
    if (isOpen) return;
    handle.setPointerCapture(event.pointerId);
    startDragOpen(event.pointerId, event.clientY);
  });
  panelDragZone.addEventListener("pointerdown", (event) => {
    if (!isOpen) return;
    panelDragZone.setPointerCapture(event.pointerId);
    startDragClose(event.pointerId, event.clientY);
  });

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  scrim.addEventListener("click", closeCenter);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeCenter();
  });

  function wireTileToggle(tile) {
    if (!tile) return;
    tile.addEventListener("click", () => {
      const active = tile.classList.toggle("active");
      const state = tile.querySelector(".cc-tile-state");
      if (state) state.textContent = active ? "On" : "Off";
      tile.setAttribute("aria-pressed", String(active));
    });
  }

  wireTileToggle(wifiTile);
  wireTileToggle(btTile);

  if (wifiTile) {
    let longPressTimer = null;
    let suppressNextWifiClick = false;

    const clearLongPress = () => {
      if (!longPressTimer) return;
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    };

    const startLongPress = () => {
      clearLongPress();
      longPressTimer = window.setTimeout(() => {
        suppressNextWifiClick = true;
        window.location.href = "plan-b-device-settings.html";
      }, 550);
    };

    wifiTile.addEventListener("pointerdown", startLongPress);
    wifiTile.addEventListener("pointerup", clearLongPress);
    wifiTile.addEventListener("pointercancel", clearLongPress);
    wifiTile.addEventListener("pointerleave", clearLongPress);
    wifiTile.addEventListener("contextmenu", (event) => event.preventDefault());
    wifiTile.addEventListener("click", (event) => {
      if (!suppressNextWifiClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressNextWifiClick = false;
    }, { capture: true });
  }

  if (fab) {
    let fabDrag = null;

    const placeFab = (left, top) => {
      const shellRect = shell.getBoundingClientRect();
      const fabRect = fab.getBoundingClientRect();
      const minLeft = 10;
      const minTop = 10;
      const maxLeft = shellRect.width - fabRect.width - 10;
      const maxTop = shellRect.height - fabRect.height - 10;
      const clampedLeft = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));
      const clampedTop = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));
      fab.style.left = `${clampedLeft}px`;
      fab.style.top = `${clampedTop}px`;
      fab.style.right = "auto";
      fab.style.bottom = "auto";
    };

    fab.addEventListener("pointerdown", (event) => {
      const shellRect = shell.getBoundingClientRect();
      const fabRect = fab.getBoundingClientRect();
      fab.setPointerCapture(event.pointerId);
      fabDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: fabRect.left - shellRect.left,
        startTop: fabRect.top - shellRect.top,
        moved: false
      };
      fab.classList.add("is-dragging");
    });

    fab.addEventListener("pointermove", (event) => {
      if (!fabDrag || fabDrag.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - fabDrag.startX;
      const deltaY = event.clientY - fabDrag.startY;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        fabDrag.moved = true;
      }
      placeFab(fabDrag.startLeft + deltaX, fabDrag.startTop + deltaY);
    });

    const endFabDrag = (event) => {
      if (!fabDrag || fabDrag.pointerId !== event.pointerId) return;
      suppressFabClick = fabDrag.moved;
      fabDrag = null;
      fab.classList.remove("is-dragging");
    };

    fab.addEventListener("pointerup", endFabDrag);
    fab.addEventListener("pointercancel", endFabDrag);

    fab.addEventListener("click", () => {
      if (suppressFabClick) {
        suppressFabClick = false;
        return;
      }
      if (!isOpen) openCenter();
    });
  }

  const sliders = [...controlCenter.querySelectorAll("[data-slider]")];
  const volumePath = document.getElementById("volumeIconPath");
  const sliderState = {
    brightness: 0.62,
    volume: 0.58,
    ambient: 0.48
  };

  function applyBrightness(value) {
    const brightness = 0.72 + value * 0.5;
    content.style.filter = `brightness(${brightness.toFixed(2)})`;
  }

  function applyVolumeIcon(value) {
    if (!volumePath) return;
    if (value < 0.05) {
      volumePath.setAttribute("d", "M11 5L6 9H3v6h3l5 4V5z");
    } else {
      volumePath.setAttribute("d", "M11 5L6 9H3v6h3l5 4V5zm3.5 4.5a5 5 0 0 1 0 5m2.5-7.5a8.5 8.5 0 0 1 0 10");
    }
  }

  function applyAmbient(value) {
    const alpha = 0.08 + value * 0.2;
    shell.style.boxShadow =
      `0 42px 110px rgba(0, 0, 0, 0.76), inset 0 0 0 1px rgba(148, 163, 184, 0.2), 0 0 36px rgba(14, 165, 233, ${alpha.toFixed(2)})`;
  }

  function renderSlider(sliderEl, value) {
    const fill = sliderEl.querySelector(".cc-slider-fill");
    const thumb = sliderEl.querySelector(".cc-slider-thumb");
    const percent = Math.round(value * 100);
    if (fill) fill.style.height = `${percent}%`;
    if (thumb) thumb.style.bottom = `${percent}%`;
    sliderEl.setAttribute("aria-valuenow", String(percent));
  }

  function setSliderValue(key, value) {
    const clamped = Math.max(0, Math.min(1, value));
    sliderState[key] = clamped;
    const sliderEl = controlCenter.querySelector(`[data-slider="${key}"]`);
    if (sliderEl) renderSlider(sliderEl, clamped);
    if (key === "brightness") applyBrightness(clamped);
    if (key === "volume") applyVolumeIcon(clamped);
    if (key === "ambient") applyAmbient(clamped);
  }

  function wireSlider(sliderEl) {
    const key = sliderEl.dataset.slider;
    const track = sliderEl.querySelector(".cc-slider-track");
    if (!key || !track) return;

    function setValueFromPointer(clientY) {
      const rect = track.getBoundingClientRect();
      const ratio = (rect.bottom - clientY) / rect.height;
      setSliderValue(key, ratio);
    }

    track.addEventListener("pointerdown", (event) => {
      track.setPointerCapture(event.pointerId);
      setValueFromPointer(event.clientY);
      const move = (moveEvent) => setValueFromPointer(moveEvent.clientY);
      const stop = () => {
        track.removeEventListener("pointermove", move);
        track.removeEventListener("pointerup", stop);
        track.removeEventListener("pointercancel", stop);
      };
      track.addEventListener("pointermove", move);
      track.addEventListener("pointerup", stop);
      track.addEventListener("pointercancel", stop);
    });
  }

  sliders.forEach((slider) => wireSlider(slider));
  setSliderValue("brightness", sliderState.brightness);
  setSliderValue("volume", sliderState.volume);
  setSliderValue("ambient", sliderState.ambient);
  updateOffset();
  applyProgress(0);
  window.addEventListener("resize", updateOffset);
})();
