(function initTrainingRecordsPage() {
  const root = document.getElementById("trainingRecordsScreen");
  if (!root || document.body.dataset.planBPage !== "training-records") return;

  const rangeButtons = Array.from(document.querySelectorAll(".tr-range-btn"));
  const backBtn = document.getElementById("trainingRecordsBackBtn");
  const clearFilterBtn = document.getElementById("clearChartFilterBtn");
  const activeFilterHint = document.getElementById("activeFilterHint");
  const historyListContainer = document.getElementById("historyListContainer");
  const historyEmpty = document.getElementById("historyEmpty");
  const volumeEmptyOverlay = document.getElementById("volumeEmptyOverlay");
  const qualityEmptyOverlay = document.getElementById("qualityEmptyOverlay");
  const chartsView = document.getElementById("trChartsView");
  const listView = document.getElementById("trListView");

  const chartEls = {
    volume: document.getElementById("volumeChart"),
    quality: document.getElementById("qualityChart"),
    source: document.getElementById("sourceChart"),
    mode: document.getElementById("modeChart")
  };

  const TYPE_COLORS = {
    Strength: "#4da3ff",
    Pilates: "#b38bff",
    Cardio: "#ff974d"
  };

  const MODE_LABELS = {
    Strength: "力量",
    Pilates: "普拉提",
    Cardio: "有氧"
  };

  const SOURCE_LABELS = {
    "Plan Follow": "计划跟练",
    "Free Training": "自由训练"
  };

  function getModeLabel(mode) {
    return MODE_LABELS[mode] || mode;
  }

  function getSourceLabel(source) {
    return SOURCE_LABELS[source] || source;
  }

  function getFilterTypeLabel(type) {
    if (type === "mode") return "模式";
    if (type === "source") return "来源";
    return type;
  }

  const WEEK_DATA = {
      labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      /* Underlying stats: limited strength samples (overlays only in Week; charts use demo series). */
      volumeByType: {
        Strength: [0, 0, 0, 0, 0, 0, 0],
        Pilates: [0, 0, 0, 0, 0, 0, 0],
        Cardio: [1100, 900, 1400, 1300, 800, 1800, 1000]
      },
      qualityScore: [],
      sourceSplit: [
        { name: "Plan Follow", value: 4 },
        { name: "Free Training", value: 3 }
      ],
      modeSplit: [
        { name: "Strength", value: 4 },
        { name: "Pilates", value: 2 },
        { name: "Cardio", value: 1 }
      ],
      bodyLoad: {
        chest: 78,
        core: 66,
        arms: 72,
        glutes: 58,
        legs: 74,
        back: 63,
        rearShoulders: 49,
        hamstrings: 54
      },
      records: [
        { title: "力量：全身训练", time: "今天 08:30", duration: "45m", metric: "8,200 kg", mode: "Strength", source: "Plan Follow" },
        { title: "普拉提：核心流", time: "昨天 19:20", duration: "32m", metric: "1,120 kg", mode: "Pilates", source: "Free Training" },
        { title: "力量：上肢强化", time: "周五 07:40", duration: "56m", metric: "10,500 kg", mode: "Strength", source: "Plan Follow" },
        { title: "有氧：划船HIIT", time: "周四 18:05", duration: "28m", metric: "420 kcal", mode: "Cardio", source: "Free Training" },
        { title: "力量：下肢链路", time: "周二 08:00", duration: "42m", metric: "7,600 kg", mode: "Strength", source: "Plan Follow" },
        { title: "普拉提：脊柱重置", time: "周一 20:12", duration: "35m", metric: "980 kg", mode: "Pilates", source: "Plan Follow" }
      ]
    };

  const MONTH_DATA = {
      labels: ["第1周", "第2周", "第3周", "第4周"],
      volumeByType: {
        Strength: [0, 0, 0, 0],
        Pilates: [0, 0, 0, 0],
        Cardio: [6900, 7100, 8200, 7600]
      },
      qualityScore: [],
      sourceSplit: [
        { name: "Plan Follow", value: 1 },
        { name: "Free Training", value: 9 }
      ],
      modeSplit: [
        { name: "Strength", value: 0 },
        { name: "Pilates", value: 0 },
        { name: "Cardio", value: 10 }
      ],
      bodyLoad: {
        chest: 12,
        core: 24,
        arms: 20,
        glutes: 48,
        legs: 80,
        back: 22,
        rearShoulders: 10,
        hamstrings: 65
      },
      records: [
        { title: "有氧：耐力骑行", time: "4月02日 07:55", duration: "35m", metric: "530 kcal", mode: "Cardio", source: "Free Training" },
        { title: "有氧：爬坡冲刺", time: "4月05日 18:40", duration: "25m", metric: "410 kcal", mode: "Cardio", source: "Free Training" },
        { title: "有氧：节奏划船", time: "4月10日 07:28", duration: "31m", metric: "460 kcal", mode: "Cardio", source: "Free Training" },
        { title: "有氧：骑行构建", time: "4月13日 19:10", duration: "38m", metric: "590 kcal", mode: "Cardio", source: "Plan Follow" },
        { title: "有氧：恢复跑", time: "4月16日 06:58", duration: "27m", metric: "350 kcal", mode: "Cardio", source: "Free Training" }
      ]
    };

  const LEGACY_YEAR_RECORDS = [
    { title: "力量：渐进推举", time: "3月20日 08:12", duration: "53m", metric: "9,850 kg", mode: "Strength", source: "Plan Follow" },
    { title: "普拉提：平衡控制", time: "3月18日 19:03", duration: "33m", metric: "1,230 kg", mode: "Pilates", source: "Plan Follow" },
    { title: "有氧：二区骑行", time: "3月15日 07:35", duration: "42m", metric: "620 kcal", mode: "Cardio", source: "Free Training" },
    { title: "力量：拉力能力", time: "3月10日 08:24", duration: "49m", metric: "8,900 kg", mode: "Strength", source: "Free Training" },
    { title: "力量：腿部爆发", time: "3月07日 07:50", duration: "58m", metric: "10,980 kg", mode: "Strength", source: "Plan Follow" },
    { title: "普拉提：灵活性重置", time: "3月02日 20:02", duration: "37m", metric: "1,420 kg", mode: "Pilates", source: "Free Training" }
  ];

  function mergeUniqueRecords(recordGroups) {
    var allRecords = [];
    var seen = new Set();
    recordGroups.forEach(function (group) {
      (group || []).forEach(function (record) {
        var key = [record.title, record.time, record.duration, record.metric, record.mode, record.source].join("|");
        if (seen.has(key)) return;
        seen.add(key);
        allRecords.push(record);
      });
    });
    return allRecords;
  }

  const PERIOD_DATA = {
    week: WEEK_DATA,
    month: MONTH_DATA,
    all: {
      records: mergeUniqueRecords([WEEK_DATA.records, MONTH_DATA.records, LEGACY_YEAR_RECORDS])
    }
  };

  const state = {
    range: "week",
    filter: null
  };

  const charts = {
    volume: null,
    quality: null,
    source: null,
    mode: null
  };

  function initCharts() {
    if (!window.echarts) {
      Object.values(chartEls).forEach((el) => {
        if (!el) return;
        el.innerHTML = "<p style='padding:12px;color:#9fb0c6;font-size:12px;'>图表库加载失败。</p>";
      });
      return;
    }
    charts.volume = echarts.init(chartEls.volume);
    charts.quality = echarts.init(chartEls.quality);
    charts.source = echarts.init(chartEls.source);
    charts.mode = echarts.init(chartEls.mode);
    wireChartEvents();
  }

  function computeMovingAverage(values, windowSize) {
    return values.map(function (_, index) {
      var start = Math.max(0, index - windowSize + 1);
      var section = values.slice(start, index + 1);
      var sum = section.reduce(function (acc, current) { return acc + current; }, 0);
      return Math.round(sum / section.length);
    });
  }

  function mapZoneLevel(value, maxValue) {
    if (!maxValue || value <= 0) return 0;
    var ratio = value / maxValue;
    if (ratio >= 0.9) return 5;
    if (ratio >= 0.7) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.3) return 2;
    return 1;
  }

  function applyBodyMap(bodyLoad) {
    var zoneIds = ["chest", "core", "arms", "glutes", "legs", "back", "rearShoulders", "hamstrings"];
    var values = zoneIds.map(function (id) { return Number(bodyLoad[id] || 0); });
    var maxValue = Math.max.apply(null, values.concat([0]));
    zoneIds.forEach(function (zoneId) {
      var path = document.getElementById(zoneId);
      if (!path) return;
      path.classList.remove("tr-zone-1", "tr-zone-2", "tr-zone-3", "tr-zone-4", "tr-zone-5");
      var level = mapZoneLevel(Number(bodyLoad[zoneId] || 0), maxValue);
      if (level > 0) path.classList.add("tr-zone-" + String(level));
    });
  }

  function setRange(range) {
    if (!PERIOD_DATA[range]) return;
    state.range = range;
    state.filter = null;
    rangeButtons.forEach(function (button) {
      var active = button.dataset.range === range;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    applyViewMode();
    renderAll();
  }

  function setFilter(filter) {
    state.filter = filter;
    renderHistory();
  }

  function clearFilter() {
    state.filter = null;
    renderHistory();
  }

  function getCurrentData() {
    return PERIOD_DATA[state.range] || PERIOD_DATA.week;
  }

  function applyViewMode() {
    var isAllRange = state.range === "all";
    if (chartsView) chartsView.hidden = isAllRange;
    if (listView) listView.hidden = !isAllRange;
    if (!isAllRange) {
      requestAnimationFrame(function () {
        resizeAllCharts();
      });
    }
  }

  function buildDemoVolumeSeries(range, labels) {
    var presets = {
      week: {
        Strength: [4100, 5600, 5200, 6700, 7200, 6400, 6900],
        Pilates: [860, 980, 1200, 910, 1320, 1050, 1180],
        Cardio: [1450, 1320, 1580, 1490, 1660, 1740, 1600]
      },
      month: {
        Strength: [16800, 18200, 19600, 20500],
        Pilates: [3900, 4300, 4700, 5200],
        Cardio: [6100, 6800, 7200, 7600]
      }
    };
    var base = presets[range] || presets.week;
    var length = labels.length;
    return {
      Strength: base.Strength.slice(0, length),
      Pilates: base.Pilates.slice(0, length),
      Cardio: base.Cardio.slice(0, length)
    };
  }

  function buildDemoQualitySeries(range, labels) {
    var presets = {
      week: [84, 86, 88, 89, 91, 92, 93],
      month: [83, 85, 87, 89]
    };
    var base = presets[range] || presets.week;
    return base.slice(0, labels.length);
  }

  function sumSeries(arr) {
    if (!Array.isArray(arr)) return 0;
    return arr.reduce(function (sum, v) { return sum + Number(v || 0); }, 0);
  }

  /** When "real" period data has no strength/pilates load, show hint on top of demo chart. */
  function shouldShowVolumeEmptyOverlay(data) {
    var s = data.volumeByType && data.volumeByType.Strength;
    var p = data.volumeByType && data.volumeByType.Pilates;
    return sumSeries(s) + sumSeries(p) === 0;
  }

  /** When period has no AI quality samples, show hint on top of demo chart. */
  function shouldShowQualityEmptyOverlay(data) {
    return !Array.isArray(data.qualityScore) || data.qualityScore.length === 0;
  }

  /** Week-only overlays; Month/All always hide regardless of underlying stats. */
  function updateEmptyOverlays(data) {
    if (volumeEmptyOverlay) {
      var showVolume = state.range === "week" && shouldShowVolumeEmptyOverlay(data);
      volumeEmptyOverlay.hidden = !showVolume;
    }
    if (qualityEmptyOverlay) {
      var showQuality = state.range === "week" && shouldShowQualityEmptyOverlay(data);
      qualityEmptyOverlay.hidden = !showQuality;
    }
  }

  function renderVolumeChart(data) {
    if (!charts.volume) return;
    var demoVolume = buildDemoVolumeSeries(state.range, data.labels);
    var strengthSeries = demoVolume.Strength;
    var pilatesSeries = demoVolume.Pilates;
    var cardioSeries = demoVolume.Cardio;
    var totals = data.labels.map(function (_, index) {
      return (strengthSeries[index] || 0) + (pilatesSeries[index] || 0) + (cardioSeries[index] || 0);
    });
    var trend = computeMovingAverage(totals, 3);

    charts.volume.setOption({
      animationDuration: 350,
      grid: { left: 34, right: 18, top: 30, bottom: 26 },
      legend: {
        top: 0,
        textStyle: { color: "#cbd5e1", fontSize: 10 },
        itemHeight: 8,
        itemWidth: 12
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: data.labels,
        axisLabel: { color: "#9fb0c6", fontSize: 10 },
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.24)" } }
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#9fb0c6", fontSize: 10, formatter: "{value}" },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.14)" } }
      },
      series: [
        { name: "力量", type: "bar", stack: "volume", barMaxWidth: 22, itemStyle: { color: TYPE_COLORS.Strength, borderRadius: [4, 4, 0, 0] }, data: strengthSeries },
        { name: "普拉提", type: "bar", stack: "volume", barMaxWidth: 22, itemStyle: { color: TYPE_COLORS.Pilates, borderRadius: [4, 4, 0, 0] }, data: pilatesSeries },
        { name: "有氧", type: "bar", stack: "volume", barMaxWidth: 22, itemStyle: { color: TYPE_COLORS.Cardio, borderRadius: [4, 4, 0, 0] }, data: cardioSeries },
        {
          name: "移动均值",
          type: "line",
          smooth: true,
          symbolSize: 5,
          lineStyle: { width: 2, color: "#67e8f9" },
          itemStyle: { color: "#67e8f9" },
          data: trend
        }
      ]
    });
  }

  function renderQualityChart(data) {
    if (!charts.quality) return;
    var qualitySeries = buildDemoQualitySeries(state.range, data.labels);
    charts.quality.setOption({
      animationDuration: 350,
      grid: { left: 34, right: 18, top: 18, bottom: 26 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: data.labels,
        axisLabel: { color: "#9fb0c6", fontSize: 10 },
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.24)" } }
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { color: "#9fb0c6", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.14)" } }
      },
      series: [{
        name: "AI评分",
        type: "line",
        smooth: true,
        connectNulls: false,
        symbolSize: 6,
        lineStyle: { width: 2.5, color: "#4ade80" },
        areaStyle: { color: "rgba(74, 222, 128, 0.16)" },
        itemStyle: { color: "#4ade80" },
        data: qualitySeries
      }]
    });
  }

  function buildRingOption(dataset, title) {
    var total = dataset.reduce(function (sum, item) { return sum + Number(item.value || 0); }, 0);
    return {
      animationDuration: 350,
      color: dataset.map(function (item) {
        if (item.name === "Strength" || item.name === "Plan Follow") return TYPE_COLORS.Strength;
        if (item.name === "Pilates") return TYPE_COLORS.Pilates;
        if (item.name === "Cardio" || item.name === "Free Training") return TYPE_COLORS.Cardio;
        return "#94a3b8";
      }),
      title: {
        text: String(total),
        subtext: "次训练",
        left: "center",
        top: "35%",
        textStyle: { color: "#f8fafc", fontSize: 18, fontWeight: 700 },
        subtextStyle: { color: "#9fb0c6", fontSize: 10 }
      },
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        textStyle: { color: "#cbd5e1", fontSize: 10 },
        itemWidth: 10,
        itemHeight: 8
      },
      series: [{
        name: title,
        type: "pie",
        radius: ["54%", "76%"],
        center: ["50%", "42%"],
        itemStyle: { borderColor: "rgba(2,6,23,0.9)", borderWidth: 2 },
        label: { show: false },
        data: dataset.map(function (item) {
          return {
            name: SOURCE_LABELS[item.name] || MODE_LABELS[item.name] || item.name,
            value: item.value
          };
        })
      }]
    };
  }

  function renderStructureCharts(data) {
    if (!charts.source || !charts.mode) return;
    charts.source.setOption(buildRingOption(data.sourceSplit, "来源占比"));
    charts.mode.setOption(buildRingOption(data.modeSplit, "模式占比"));
  }

  function toSourceClass(source) {
    return source === "Plan Follow" ? "source-plan" : "source-free";
  }

  function toModeClass(mode) {
    if (mode === "Strength") return "mode-strength";
    if (mode === "Pilates") return "mode-pilates";
    return "mode-cardio";
  }

  function filterRecords(records) {
    if (!state.filter) return records;
    return records.filter(function (item) {
      if (state.filter.type === "mode") return item.mode === state.filter.value;
      if (state.filter.type === "source") return item.source === state.filter.value;
      return true;
    });
  }

  function renderHistory() {
    var data = getCurrentData();
    var filtered = filterRecords(data.records || []);
    historyListContainer.innerHTML = "";
    historyEmpty.hidden = filtered.length > 0;

    filtered.forEach(function (record) {
      var row = document.createElement("article");
      row.className = "tr-history-row";

      var top = document.createElement("div");
      top.className = "tr-row-top";

      var titleWrap = document.createElement("div");
      var title = document.createElement("h3");
      title.className = "tr-row-title";
      title.textContent = record.title;
      var time = document.createElement("p");
      time.className = "tr-row-time";
      time.textContent = record.time;
      titleWrap.append(title, time);

      var value = document.createElement("p");
      value.className = "tr-row-value";
      value.textContent = record.metric + " · " + record.duration;
      top.append(titleWrap, value);

      var meta = document.createElement("div");
      meta.className = "tr-row-meta";

      var sourceChip = document.createElement("span");
      sourceChip.className = "tr-chip " + toSourceClass(record.source);
      sourceChip.textContent = getSourceLabel(record.source);

      var modeChip = document.createElement("span");
      modeChip.className = "tr-chip " + toModeClass(record.mode);
      modeChip.textContent = getModeLabel(record.mode);

      meta.append(sourceChip, modeChip);
      row.append(top, meta);
      historyListContainer.appendChild(row);
    });

    var hasFilter = Boolean(state.filter);
    clearFilterBtn.hidden = !hasFilter;
    activeFilterHint.hidden = !hasFilter;
    if (hasFilter) {
      activeFilterHint.textContent = "按" + getFilterTypeLabel(state.filter.type) + "筛选：" + (state.filter.type === "mode" ? getModeLabel(state.filter.value) : getSourceLabel(state.filter.value));
    }
  }

  function renderAll() {
    var data = getCurrentData();
    if (state.range === "all") {
      if (volumeEmptyOverlay) volumeEmptyOverlay.hidden = true;
      if (qualityEmptyOverlay) qualityEmptyOverlay.hidden = true;
      renderHistory();
      return;
    }
    updateEmptyOverlays(data);
    renderVolumeChart(data);
    renderQualityChart(data);
    renderStructureCharts(data);
    applyBodyMap(data.bodyLoad || {});
  }

  function wireChartEvents() {
    /* Intentionally left blank:
     * chart-click-to-filter behavior was removed when list moved to All Training tab.
     */
  }

  function wireEvents() {
    rangeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setRange(button.dataset.range);
      });
    });

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        window.location.href = "plan-b-profile.html";
      });
    }
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener("click", clearFilter);
    }

    var homeTabBtn = document.getElementById("homeTabBtn");
    var allTrainingNavBtn = document.getElementById("allTrainingNavBtn");
    var profileTabBtn = document.getElementById("profileTabBtn");

    if (homeTabBtn) {
      homeTabBtn.addEventListener("click", function () {
        window.location.href = "index-plan-b-home.html";
      });
    }
    if (allTrainingNavBtn) {
      allTrainingNavBtn.addEventListener("click", function () {
        window.location.href = "plan-b-all-training.html";
      });
    }
    if (profileTabBtn) {
      profileTabBtn.addEventListener("click", function () {
        window.location.href = "plan-b-profile.html";
      });
    }

    window.addEventListener("resize", function () {
      Object.keys(charts).forEach(function (key) {
        if (charts[key] && charts[key].resize) charts[key].resize();
      });
    });
  }

  function resizeAllCharts() {
    Object.keys(charts).forEach(function (key) {
      if (charts[key] && charts[key].resize) charts[key].resize();
    });
  }

  initCharts();
  applyViewMode();
  wireEvents();
  renderAll();
  requestAnimationFrame(function () {
    resizeAllCharts();
    requestAnimationFrame(resizeAllCharts);
  });
})();
