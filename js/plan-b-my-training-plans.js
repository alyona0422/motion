(function initMyPlansPage() {
  const root = document.getElementById("myPlansScreen");
  if (!root || document.body.dataset.planBPage !== "my-training-plans") return;

  const tabButtons = Array.from(document.querySelectorAll(".my-plans-tab"));
  const listEl = document.getElementById("myPlansList");
  const emptyEl = document.getElementById("myPlansEmpty");

  // Mock data for user's training plans
  const myPlansData = {
    ongoing: [
      {
        id: "plan-1",
        title: "Spring Cut Plan",
        duration: "30 days",
        progress: 40, // percentage
        currentDay: 12,
        totalDays: 30,
        status: "Active"
      },
      {
        id: "plan-2",
        title: "Core First Plan",
        duration: "14 days",
        progress: 14,
        currentDay: 2,
        totalDays: 14,
        status: "Active"
      }
    ],
    history: [
      {
        id: "plan-3",
        title: "Starter Week",
        duration: "7 days",
        progress: 100,
        currentDay: 7,
        totalDays: 7,
        status: "Completed",
        date: "Mar 15, 2026"
      },
      {
        id: "plan-4",
        title: "Lean Strength 21",
        duration: "21 days",
        progress: 30,
        currentDay: 6,
        totalDays: 21,
        status: "Quit",
        date: "Feb 20, 2026"
      },
      {
        id: "plan-5",
        title: "Weekend Athlete",
        duration: "8 days",
        progress: 0,
        currentDay: 0,
        totalDays: 8,
        status: "Expired",
        date: "Jan 10, 2026"
      }
    ]
  };

  let activeTab = "ongoing";

  function renderList() {
    const items = myPlansData[activeTab] || [];
    
    if (items.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    listEl.innerHTML = items.map(item => {
      let statusBadge = "";
      if (item.status === "Completed") {
        statusBadge = `<span class="plan-status status-completed">Completed</span>`;
      } else if (item.status === "Quit") {
        statusBadge = `<span class="plan-status status-quit">Quit</span>`;
      } else if (item.status === "Expired") {
        statusBadge = `<span class="plan-status status-expired">Expired</span>`;
      }

      const progressBar = activeTab === "ongoing" 
        ? `<div class="plan-progress-container">
             <div class="plan-progress-info">
               <span>Day ${item.currentDay} of ${item.totalDays}</span>
               <span>${item.progress}%</span>
             </div>
             <div class="plan-progress-track">
               <div class="plan-progress-fill" style="width: ${item.progress}%"></div>
             </div>
           </div>`
        : `<div class="plan-date">${item.date || ""}</div>`;

      const cardClass = activeTab === "history" ? "my-plan-card is-history-card" : "my-plan-card";

      return `
        <div class="${cardClass}">
          <div class="plan-card-main">
            <div class="plan-header">
              <h3 class="plan-title">${item.title}</h3>
              ${statusBadge}
            </div>
            <p class="plan-duration">${item.duration}</p>
            ${progressBar}
          </div>
          <button
            class="plan-action-btn"
            type="button"
            aria-label="View plan details"
            data-tab="${activeTab}"
            data-plan-id="${item.id}"
            data-current-day="${Number(item.currentDay || 0)}"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      `;
    }).join("");
  }

  function handleTabClick(e) {
    const btn = e.currentTarget;
    const tab = btn.dataset.tab;
    if (!tab || tab === activeTab) return;

    activeTab = tab;
    tabButtons.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", String(isActive));
    });

    renderList();
  }

  tabButtons.forEach(btn => btn.addEventListener("click", handleTabClick));

  listEl.addEventListener("click", (event) => {
    const actionBtn = event.target.closest(".plan-action-btn");
    if (!actionBtn) return;

    const sourceTab = String(actionBtn.dataset.tab || "");
    if (sourceTab === "ongoing") {
      const completedDays = Math.max(0, Number(actionBtn.dataset.currentDay || 0) - 1);
      const query = new URLSearchParams({
        from: "my-training-plans",
        joined: "1",
        completedDays: String(completedDays)
      });
      const planId = String(actionBtn.dataset.planId || "").trim();
      if (planId) query.set("planId", planId);
      window.location.href = `plan-b-plan-detail.html?${query.toString()}`;
      return;
    }

    window.location.href = "plan-b-plan-detail.html?from=my-training-plans";
  });

  // Initial render
  renderList();
})();
