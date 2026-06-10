(function () {
  const HOME_PATH = "index-plan-b-home.html";
  const LOGIN_PATH = "plan-b-login.html";

  function getPageName() {
    return document.body?.dataset?.planBPage || "";
  }

  function showToast(message, duration) {
    const toast = document.getElementById("authToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("is-hidden");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.add("is-hidden");
    }, duration || 1800);
  }

  function goTo(path, delay) {
    if (!delay) {
      window.location.href = path;
      return;
    }
    window.setTimeout(() => {
      window.location.href = path;
    }, delay);
  }

  function bindBackButtons() {
    document.querySelectorAll("[data-auth-back]").forEach((node) => {
      node.addEventListener("click", () => {
        const target = node.getAttribute("data-auth-back");
        goTo(target || HOME_PATH);
      });
    });
  }

  function bindMethodTabs() {
    const tabs = document.querySelectorAll("[data-auth-method-tab]");
    const forms = document.querySelectorAll("[data-auth-method-panel]");
    if (!tabs.length || !forms.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const method = tab.getAttribute("data-auth-method-tab");
        tabs.forEach((item) => item.classList.toggle("active", item === tab));
        forms.forEach((panel) => {
          panel.classList.toggle("is-hidden", panel.getAttribute("data-auth-method-panel") !== method);
        });
      });
    });
  }

  function bindLoginPage() {
    const quickLoginBtn = document.getElementById("quickLoginBtn");
    const policyCheckbox = document.getElementById("loginPolicyAgree");
    const passwordLoginBtn = document.getElementById("loginPasswordBtn");
    const codeLoginBtn = document.getElementById("loginCodeBtn");
    const message = "Please confirm you have read the User Agreement and Privacy Policy";

    function submitLogin() {
      if (!policyCheckbox?.checked) {
        showToast(message);
        return;
      }
      goTo(HOME_PATH);
    }

    quickLoginBtn?.addEventListener("click", () => goTo(HOME_PATH));
    passwordLoginBtn?.addEventListener("click", submitLogin);
    codeLoginBtn?.addEventListener("click", submitLogin);
  }

  function bindRegisterPage() {
    const nextBtn = document.getElementById("registerNextBtn");
    const policyCheckbox = document.getElementById("registerPolicyAgree");
    const passwordInput = document.getElementById("registerPassword");
    const confirmInput = document.getElementById("registerConfirmPassword");

    nextBtn?.addEventListener("click", () => {
      if (!policyCheckbox?.checked) {
        showToast("Please confirm you have read the User Agreement and Privacy Policy");
        return;
      }
      if (passwordInput && confirmInput && passwordInput.value !== confirmInput.value) {
        showToast("Passwords do not match");
        return;
      }
      goTo("plan-b-profile-completion.html");
    });
  }

  function bindUnitToggles() {
    document.querySelectorAll("[data-unit-toggle]").forEach((group) => {
      const buttons = group.querySelectorAll("[data-unit-value]");
      const targetId = group.getAttribute("data-unit-target");
      const targetInput = targetId ? document.getElementById(targetId) : null;
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((other) => other.classList.toggle("active", other === button));
          if (targetInput) targetInput.placeholder = button.getAttribute("data-unit-placeholder") || "";
        });
      });
    });
  }

  function populateBirthYearOptions() {
    const sel = document.getElementById("profileBirthYear");
    if (!sel || sel.options.length > 1) return;
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100;
    const frag = document.createDocumentFragment();
    for (let y = currentYear; y >= minYear; y -= 1) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      frag.appendChild(opt);
    }
    sel.appendChild(frag);
  }

  function bindProfileCompletionPage() {
    bindUnitToggles();
    populateBirthYearOptions();
    const saveBtn = document.getElementById("profileCompletionSaveBtn");
    saveBtn?.addEventListener("click", () => {
      showToast("Registration successful");
      goTo(HOME_PATH, 900);
    });
  }

  function bindForgotPasswordPage() {
    const saveBtn = document.getElementById("forgotPasswordSaveBtn");
    const passwordInput = document.getElementById("forgotPassword");
    const confirmInput = document.getElementById("forgotConfirmPassword");
    saveBtn?.addEventListener("click", () => {
      if (passwordInput && confirmInput && passwordInput.value !== confirmInput.value) {
        showToast("Passwords do not match");
        return;
      }
      showToast("Password reset successful");
      goTo(LOGIN_PATH, 900);
    });
  }

  function init() {
    bindBackButtons();
    bindMethodTabs();
    switch (getPageName()) {
      case "login":
        bindLoginPage();
        break;
      case "register":
        bindRegisterPage();
        break;
      case "profile-completion":
        bindProfileCompletionPage();
        break;
      case "forgot-password":
        bindForgotPasswordPage();
        break;
      default:
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
