(() => {
  const controlCenter = document.getElementById("controlCenter");
  if (!controlCenter) return;

  const shell = document.querySelector(".device-shell");
  const content = document.querySelector(".content");
  const panel = document.getElementById("controlCenterPanel");
  const handle = document.getElementById("controlCenterHandle");
  const panelDragZone = document.getElementById("controlCenterDrag");
  const scrim = document.getElementById("controlCenterScrim");
  const wifiTile = document.getElementById("wifiToggleTile");
  const btTile = document.getElementById("btToggleTile");

  if (!shell || !content || !panel || !handle || !panelDragZone || !scrim) return;

  let panelOffset = 0;
  let openProgress = 0;
  let isOpen = false;
  let dragState = null;
  let suppressHandleClick = false;

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

  const sliders = [...controlCenter.querySelectorAll("[data-slider]")];
  const volumePath = document.getElementById("volumeIconPath");
  const sliderState = {
    brightness: 0.62,
    volume: 0.58
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

  const playlist = [
    { title: "Night Sprint", artist: "Pulse Drive" },
    { title: "Skyline Tempo", artist: "Nova Loop" },
    { title: "Core Ignite", artist: "Atlas Beat" }
  ];
  let trackIndex = 0;
  let isPlaying = true;

  const musicCard = document.getElementById("ccMusicCard");
  const titleEl = document.getElementById("ccMusicTitle");
  const artistEl = document.getElementById("ccMusicArtist");
  const playBtn = document.getElementById("ccPlayBtn");
  const prevBtn = document.getElementById("ccPrevBtn");
  const nextBtn = document.getElementById("ccNextBtn");
  const playIcon = document.getElementById("ccPlayIcon");
  const pauseIcon = document.getElementById("ccPauseIcon");

  function renderTrack() {
    const track = playlist[trackIndex];
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
  }

  function renderPlaying() {
    if (musicCard) musicCard.classList.toggle("playing", isPlaying);
    if (playIcon) playIcon.hidden = isPlaying;
    if (pauseIcon) pauseIcon.hidden = !isPlaying;
    if (playBtn) playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
      renderTrack();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      trackIndex = (trackIndex + 1) % playlist.length;
      renderTrack();
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      isPlaying = !isPlaying;
      renderPlaying();
    });
  }

  renderTrack();
  renderPlaying();
  updateOffset();
  applyProgress(0);
  window.addEventListener("resize", updateOffset);
})();
