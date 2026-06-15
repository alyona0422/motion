document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "planBAmbientLightV1";
  const FAVORITE_SLOT_COUNT = 3;
  const CUSTOM_LABELS = ["自定义一", "自定义二", "自定义三"];

  function createDefaultState() {
    return {
      power: false,
      color: "#FFFFFF",
      favorites: [null, null, null],
      brightness: 60,
      autoBrightness: false,
      mode: "steady",
      breathSpeed: "medium",
      musicSync: false,
      trainingSync: false
    };
  }

  const DEFAULT_STATE = createDefaultState();

  const ambientPowerToggle = document.getElementById("ambientPowerToggle");
  const featureGroup = document.getElementById("featureGroup");
  const presetGrid = document.getElementById("presetGrid");
  const colorBoardInput = document.getElementById("colorBoardInput");
  const addFavoriteBtn = document.getElementById("addFavoriteBtn");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const brightnessValue = document.getElementById("brightnessValue");
  const autoBrightnessToggle = document.getElementById("autoBrightnessToggle");
  const modeSegment = document.getElementById("modeSegment");
  const breathingSpeedGroup = document.getElementById("breathingSpeedGroup");
  const musicSyncToggle = document.getElementById("musicSyncToggle");
  const trainingSyncToggle = document.getElementById("trainingSyncToggle");
  const resetDefaultsBtn = document.getElementById("resetDefaultsBtn");
  const resetDefaultsModal = document.getElementById("resetDefaultsModal");
  const closeResetModalBtn = document.getElementById("closeResetModalBtn");
  const cancelResetBtn = document.getElementById("cancelResetBtn");
  const confirmResetBtn = document.getElementById("confirmResetBtn");

  let state = loadState();

  function normalizeHex(color) {
    if (typeof color !== "string") return "#FFFFFF";
    const value = color.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(value)) return "#FFFFFF";
    return value.toUpperCase();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      const merged = { ...DEFAULT_STATE, ...parsed };
      merged.color = normalizeHex(merged.color);
      merged.brightness = clamp(Number(merged.brightness) || DEFAULT_STATE.brightness, 0, 100);
      merged.mode = merged.mode === "breathing" ? "breathing" : "steady";
      merged.breathSpeed = ["slow", "medium", "fast"].includes(merged.breathSpeed) ? merged.breathSpeed : "medium";
      merged.autoBrightness = Boolean(merged.autoBrightness);
      merged.musicSync = Boolean(merged.musicSync);
      merged.trainingSync = Boolean(merged.trainingSync);
      merged.power = Boolean(merged.power);
      if (!Array.isArray(merged.favorites)) {
        merged.favorites = [...DEFAULT_STATE.favorites];
      }
      merged.favorites = merged.favorites.slice(0, FAVORITE_SLOT_COUNT).map((item) => (item ? normalizeHex(item) : null));
      while (merged.favorites.length < FAVORITE_SLOT_COUNT) merged.favorites.push(null);
      return merged;
    } catch (error) {
      return createDefaultState();
    }
  }

  function resetToDefaults() {
    state = createDefaultState();
    saveState();
    render();
  }

  function openResetModal() {
    if (resetDefaultsModal) resetDefaultsModal.classList.add("active");
  }

  function closeResetModal() {
    if (resetDefaultsModal) resetDefaultsModal.classList.remove("active");
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function setToggle(el, isOn) {
    if (!el) return;
    el.classList.toggle("is-on", isOn);
    el.setAttribute("aria-checked", isOn ? "true" : "false");
  }

  function renderCustomChips() {
    if (!presetGrid) return;
    const slots = presetGrid.querySelectorAll(".custom-chip");
    slots.forEach((slot) => {
      const idx = Number(slot.dataset.index);
      const color = state.favorites[idx];
      const dot = slot.querySelector(".chip-dot");
      const normalized = color ? normalizeHex(color) : null;
      slot.classList.toggle("is-active", normalized && normalized === state.color);
      slot.classList.toggle("has-color", Boolean(normalized));
      if (dot) {
        if (normalized) {
          dot.style.setProperty("--chip-color", normalized);
          dot.classList.remove("is-empty");
        } else {
          dot.style.removeProperty("--chip-color");
          dot.classList.add("is-empty");
        }
      }
      const label = CUSTOM_LABELS[idx] || `自定义${idx + 1}`;
      slot.setAttribute("aria-label", normalized ? `${label} ${normalized}` : `${label} 未设置`);
    });
  }

  function renderPresets() {
    if (!presetGrid) return;
    const chips = presetGrid.querySelectorAll(".preset-chip:not(.custom-chip)");
    chips.forEach((chip) => {
      const chipColor = normalizeHex(chip.dataset.color || "");
      chip.classList.toggle("is-active", chipColor === state.color);
    });
  }

  function renderMode() {
    const modeButtons = modeSegment ? modeSegment.querySelectorAll("[data-mode]") : [];
    const speedButtons = breathingSpeedGroup ? breathingSpeedGroup.querySelectorAll("[data-speed]") : [];
    const modeLocked = state.musicSync || state.trainingSync;

    if (modeSegment) modeSegment.classList.toggle("is-locked", modeLocked);
    modeButtons.forEach((btn) => {
      const mode = btn.dataset.mode;
      btn.classList.toggle("is-active", mode === state.mode);
      btn.disabled = modeLocked;
    });

    if (breathingSpeedGroup) {
      breathingSpeedGroup.classList.toggle("is-hidden", state.mode !== "breathing");
    }

    speedButtons.forEach((btn) => {
      const speed = btn.dataset.speed;
      btn.classList.toggle("is-active", speed === state.breathSpeed);
      btn.disabled = modeLocked;
    });
  }

  function render() {
    setToggle(ambientPowerToggle, state.power);
    setToggle(autoBrightnessToggle, state.autoBrightness);
    setToggle(musicSyncToggle, state.musicSync);
    setToggle(trainingSyncToggle, state.trainingSync);

    if (featureGroup) {
      featureGroup.classList.toggle("is-disabled", !state.power);
    }

    if (brightnessSlider) brightnessSlider.value = String(state.brightness);
    if (brightnessValue) brightnessValue.textContent = String(state.brightness);
    if (colorBoardInput) colorBoardInput.value = state.color;

    const autoLocked = state.musicSync || state.trainingSync;
    if (autoBrightnessToggle) autoBrightnessToggle.disabled = autoLocked;

    renderPresets();
    renderCustomChips();
    renderMode();
  }

  function addToFavorites(color) {
    const normalized = normalizeHex(color);
    if (state.favorites.includes(normalized)) return;
    const emptyIndex = state.favorites.findIndex((item) => !item);
    if (emptyIndex >= 0) {
      state.favorites[emptyIndex] = normalized;
      return;
    }
    state.favorites.shift();
    state.favorites.push(normalized);
  }

  if (ambientPowerToggle) {
    ambientPowerToggle.addEventListener("click", () => {
      state.power = !state.power;
      saveState();
      render();
    });
  }

  if (presetGrid) {
    presetGrid.querySelectorAll(".preset-chip:not(.custom-chip)").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.color = normalizeHex(chip.dataset.color || "");
        saveState();
        render();
      });
    });

    presetGrid.querySelectorAll(".custom-chip").forEach((slot) => {
      let longPressTimer = null;
      let didClear = false;

      const clearLongPress = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      };

      slot.addEventListener("pointerdown", () => {
        const index = Number(slot.dataset.index);
        if (!state.favorites[index]) return;
        didClear = false;
        longPressTimer = setTimeout(() => {
          state.favorites[index] = null;
          didClear = true;
          saveState();
          render();
        }, 650);
      });

      slot.addEventListener("pointerup", () => {
        const index = Number(slot.dataset.index);
        const color = state.favorites[index];
        clearLongPress();
        if (!didClear && color) {
          state.color = color;
          saveState();
          render();
        }
      });

      slot.addEventListener("pointerleave", clearLongPress);
      slot.addEventListener("pointercancel", clearLongPress);
    });
  }

  if (colorBoardInput) {
    colorBoardInput.addEventListener("input", (event) => {
      state.color = normalizeHex(event.target.value);
      saveState();
      render();
    });
  }

  if (addFavoriteBtn) {
    addFavoriteBtn.addEventListener("click", () => {
      addToFavorites(state.color);
      saveState();
      render();
    });
  }

  if (brightnessSlider) {
    brightnessSlider.addEventListener("input", (event) => {
      state.brightness = clamp(Number(event.target.value), 0, 100);
      saveState();
      render();
    });
  }

  if (autoBrightnessToggle) {
    autoBrightnessToggle.addEventListener("click", () => {
      if (autoBrightnessToggle.disabled) return;
      const next = !state.autoBrightness;
      state.autoBrightness = next;
      if (next) {
        state.musicSync = false;
        state.trainingSync = false;
      }
      saveState();
      render();
    });
  }

  if (modeSegment) {
    modeSegment.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        state.mode = btn.dataset.mode === "breathing" ? "breathing" : "steady";
        saveState();
        render();
      });
    });
  }

  if (breathingSpeedGroup) {
    breathingSpeedGroup.querySelectorAll("[data-speed]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const speed = btn.dataset.speed;
        if (["slow", "medium", "fast"].includes(speed)) {
          state.breathSpeed = speed;
          saveState();
          render();
        }
      });
    });
  }

  if (musicSyncToggle) {
    musicSyncToggle.addEventListener("click", () => {
      const next = !state.musicSync;
      state.musicSync = next;
      if (next) {
        state.trainingSync = false;
        state.autoBrightness = false;
      }
      saveState();
      render();
    });
  }

  if (trainingSyncToggle) {
    trainingSyncToggle.addEventListener("click", () => {
      const next = !state.trainingSync;
      state.trainingSync = next;
      if (next) {
        state.musicSync = false;
        state.autoBrightness = false;
      }
      saveState();
      render();
    });
  }

  if (resetDefaultsBtn) resetDefaultsBtn.addEventListener("click", openResetModal);
  if (closeResetModalBtn) closeResetModalBtn.addEventListener("click", closeResetModal);
  if (cancelResetBtn) cancelResetBtn.addEventListener("click", closeResetModal);
  if (confirmResetBtn) {
    confirmResetBtn.addEventListener("click", () => {
      resetToDefaults();
      closeResetModal();
    });
  }

  render();
});
