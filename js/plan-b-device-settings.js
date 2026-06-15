document.addEventListener('DOMContentLoaded', () => {
  const wifiSettingsBtn = document.getElementById('wifiSettingsBtn');
  const wifiBottomSheet = document.getElementById('wifiBottomSheet');
  const wifiOverlay = document.getElementById('wifiOverlay');
  const wifiCloseBtn = document.getElementById('wifiCloseBtn');
  const wifiRefreshBtn = document.getElementById('wifiRefreshBtn');
  const wifiList = document.getElementById('wifiList');
  const wifiStatusChip = document.getElementById('wifiStatusChip');

  const wifiPasswordModal = document.getElementById('wifiPasswordModal');
  const closeWifiModalBtn = document.getElementById('closeWifiModalBtn');
  const wifiConnectBtn = document.getElementById('wifiConnectBtn');
  const wifiPasswordInput = document.getElementById('wifiPasswordInput');
  const wifiModalTitle = document.getElementById('wifiModalTitle');

  const languageBtn = document.getElementById('languageBtn');
  const languageModal = document.getElementById('languageModal');
  const closeLanguageModalBtn = document.getElementById('closeLanguageModalBtn');
  const languageConfirmBtn = document.getElementById('languageConfirmBtn');
  const ambientLightBtn = document.getElementById('ambientLightBtn');

  const privacyBtn = document.getElementById('privacyBtn');
  const privacyModal = document.getElementById('privacyModal');
  const closePrivacyModalBtn = document.getElementById('closePrivacyModalBtn');

  let currentSelectedNetwork = null;

  // i18n Data and Logic
  const i18n = {
    en: {
      title: 'DEVICE SETTINGS',
      wifi: 'WI-FI SETTINGS',
      ambient: 'AMBIENT LIGHT',
      lang: 'LANGUAGE',
      privacy: 'PRIVACY & AGREEMENT',
      langTitle: 'Language',
      confirm: 'Confirm'
    },
    zh: {
      title: '设备设置',
      wifi: '无线网络设置',
      ambient: '氛围灯设置',
      lang: '语言',
      privacy: '隐私与协议',
      langTitle: '语言',
      confirm: '确定'
    }
  };

  function updateLanguage(lang) {
    const texts = i18n[lang];
    if (!texts) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (texts[key]) {
        el.textContent = texts[key];
      }
    });
  }

  // Mock Data
  let networks = [
    { id: 1, name: 'Alyona_Home_5G', signal: 4, connected: false },
    { id: 2, name: 'Guest_Network', signal: 3, connected: false },
    { id: 3, name: 'CoffeeShop_Free_WiFi_Very_Long_Name_Exceeding_Thirty_Two_Characters', signal: 2, connected: false },
    { id: 4, name: 'Office_WLAN_1', signal: 1, connected: false },
    { id: 5, name: 'Hidden_Network_Secure', signal: 3, connected: false }
  ];

  function sortNetworks() {
    networks.sort((a, b) => {
      if (a.connected && !b.connected) return -1;
      if (!a.connected && b.connected) return 1;
      return b.signal - a.signal;
    });
  }

  function renderWifiList() {
    wifiList.innerHTML = '';
    sortNetworks();
    
    networks.forEach(network => {
      const item = document.createElement('div');
      item.className = `wifi-item ${network.connected ? 'connected' : ''}`;
      item.id = `wifi-item-${network.id}`;
      
      const info = document.createElement('div');
      info.className = 'wifi-info';
      
      // Signal bars
      const signalDiv = document.createElement('div');
      signalDiv.className = `wifi-signal level-${network.signal}`;
      signalDiv.innerHTML = `
        <span style="height: 25%"></span>
        <span style="height: 50%"></span>
        <span style="height: 75%"></span>
        <span style="height: 100%"></span>
      `;
      
      const textDiv = document.createElement('div');
      textDiv.style.flex = '1';
      textDiv.style.minWidth = '0';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'wifi-name';
      nameDiv.textContent = network.name;
      
      const statusText = document.createElement('span');
      statusText.className = 'wifi-status-text';
      statusText.id = `status-text-${network.id}`;
      if (network.connected) {
        statusText.textContent = 'Connected';
      }
      
      textDiv.appendChild(nameDiv);
      textDiv.appendChild(statusText);
      info.appendChild(signalDiv);
      info.appendChild(textDiv);
      
      item.appendChild(info);
      
      if (!network.connected) {
        const connectBtn = document.createElement('button');
        connectBtn.className = 'wifi-connect-btn';
        connectBtn.textContent = 'Connect';
        connectBtn.onclick = () => openPasswordModal(network);
        item.appendChild(connectBtn);
      }
      
      wifiList.appendChild(item);
    });
  }

  // Bottom Sheet Actions
  function openBottomSheet() {
    wifiOverlay.classList.add('active');
    wifiBottomSheet.classList.add('active');
    renderWifiList();
  }

  function closeBottomSheet() {
    wifiOverlay.classList.remove('active');
    wifiBottomSheet.classList.remove('active');
  }

  // Event Listeners for Bottom Sheet
  if (wifiSettingsBtn) wifiSettingsBtn.addEventListener('click', openBottomSheet);
  if (wifiCloseBtn) wifiCloseBtn.addEventListener('click', closeBottomSheet);
  if (wifiOverlay) wifiOverlay.addEventListener('click', closeBottomSheet);
  
  // Refresh Button
  if (wifiRefreshBtn) wifiRefreshBtn.addEventListener('click', () => {
    // Spin icon briefly
    const svg = wifiRefreshBtn.querySelector('svg');
    if (svg) {
        svg.style.transition = 'transform 0.5s ease';
        svg.style.transform = 'rotate(360deg)';
    }
    
    // Simulate refresh delay
    wifiList.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--muted); font-size: 14px;">Scanning for networks...</div>';
    
    setTimeout(() => {
      if (svg) {
          svg.style.transition = 'none';
          svg.style.transform = 'rotate(0deg)';
      }
      
      // Shuffle signal strengths a bit to simulate refresh
      networks.forEach(n => {
        if (!n.connected) {
          n.signal = Math.max(1, Math.min(4, n.signal + (Math.random() > 0.5 ? 1 : -1)));
        }
      });
      renderWifiList();
    }, 800);
  });

  // Password Modal Actions
  function openPasswordModal(network) {
    currentSelectedNetwork = network;
    if (wifiModalTitle) wifiModalTitle.textContent = network.name;
    if (wifiPasswordInput) wifiPasswordInput.value = '';
    if (wifiPasswordModal) wifiPasswordModal.classList.add('active');
  }

  function closePasswordModal() {
    if (wifiPasswordModal) wifiPasswordModal.classList.remove('active');
    currentSelectedNetwork = null;
  }

  if (closeWifiModalBtn) closeWifiModalBtn.addEventListener('click', closePasswordModal);

  // Language Modal Actions
  function openLanguageModal() {
    if (languageModal) languageModal.classList.add('active');
  }

  function closeLanguageModal() {
    if (languageModal) languageModal.classList.remove('active');
  }

  if (languageBtn) languageBtn.addEventListener('click', openLanguageModal);
  if (closeLanguageModalBtn) closeLanguageModalBtn.addEventListener('click', closeLanguageModal);
  if (ambientLightBtn) {
    ambientLightBtn.addEventListener('click', () => {
      window.location.href = 'plan-b-ambient-light-settings.html';
    });
  }

  if (languageConfirmBtn) {
    languageConfirmBtn.addEventListener('click', () => {
      const selectedLang = document.querySelector('input[name="lang"]:checked');
      if (selectedLang) {
        updateLanguage(selectedLang.value);
      }
      closeLanguageModal();
    });
  }

  // Privacy Modal Actions
  function openPrivacyModal() {
    if (privacyModal) privacyModal.classList.add('active');
  }

  function closePrivacyModal() {
    if (privacyModal) privacyModal.classList.remove('active');
  }

  if (privacyBtn) privacyBtn.addEventListener('click', openPrivacyModal);
  if (closePrivacyModalBtn) closePrivacyModalBtn.addEventListener('click', closePrivacyModal);

  // Device Self-Check
  const selfCheckBtn = document.getElementById('selfCheckBtn');
  const selfCheckScreen = document.getElementById('selfCheckScreen');
  const selfCheckCloseBtn = document.getElementById('selfCheckCloseBtn');
  const startSelfCheckBtn = document.getElementById('startSelfCheckBtn');
  const selfCheckDoneBtn = document.getElementById('selfCheckDoneBtn');
  const selfCheckRingProgress = document.getElementById('selfCheckRingProgress');
  const selfCheckPercent = document.getElementById('selfCheckPercent');
  const selfCheckStatusLabel = document.getElementById('selfCheckStatusLabel');
  const selfCheckCurrentItem = document.getElementById('selfCheckCurrentItem');
  const selfCheckItemsList = document.getElementById('selfCheckItemsList');
  const selfCheckIssueModal = document.getElementById('selfCheckIssueModal');
  const closeSelfCheckIssueBtn = document.getElementById('closeSelfCheckIssueBtn');
  const selfCheckIssueOkBtn = document.getElementById('selfCheckIssueOkBtn');
  const selfCheckIssueTitle = document.getElementById('selfCheckIssueTitle');
  const selfCheckIssueReason = document.getElementById('selfCheckIssueReason');
  const selfCheckIssueCode = document.getElementById('selfCheckIssueCode');
  const selfCheckIssueQr = document.getElementById('selfCheckIssueQr');

  const RING_RADIUS = 68;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const SELF_CHECK_LABELS = {
    waiting: 'Waiting',
    checking: 'Checking',
    done: 'Done',
    normal: 'Normal',
    abnormal: 'Abnormal',
    complete: 'Self-Check Complete',
    idleHint: 'Tap below to start self-check',
    runningHint: 'Self-check in progress…',
    checkingPrefix: 'Checking:'
  };

  // Toggle `ok: true` on all items to demo the all-normal Done path.
  const SELF_CHECK_ITEMS = [
    { id: 'camera', name: 'Camera', ok: true, code: '', reason: '' },
    { id: 'motor', name: 'Motor', ok: true, code: '', reason: '' },
    { id: 'controlBoard', name: 'Control Board', ok: false, code: 'E-1203', reason: 'Control board communication timeout' },
    { id: 'deviceVersion', name: 'Device Version', ok: true, code: '', reason: '' }
  ];

  let selfCheckTimer = null;
  let selfCheckProgress = 0;

  function setRingProgress(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    const offset = RING_CIRCUMFERENCE - (clamped / 100) * RING_CIRCUMFERENCE;
    if (selfCheckRingProgress) {
      selfCheckRingProgress.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
      selfCheckRingProgress.style.strokeDashoffset = `${offset}`;
    }
    if (selfCheckPercent) selfCheckPercent.textContent = `${Math.round(clamped)}%`;
  }

  function renderSelfCheckItems(state) {
    if (!selfCheckItemsList) return;
    selfCheckItemsList.innerHTML = '';

    SELF_CHECK_ITEMS.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'self-check-item';
      li.dataset.itemId = item.id;

      const name = document.createElement('span');
      name.className = 'self-check-item-name';
      name.textContent = item.name;

      const status = document.createElement('span');
      status.className = 'self-check-item-status';

      if (state === 'idle') {
        status.textContent = SELF_CHECK_LABELS.waiting;
      } else if (state === 'running') {
        const itemProgress = ((index + 1) / SELF_CHECK_ITEMS.length) * 100;
        if (selfCheckProgress >= itemProgress) {
          status.textContent = SELF_CHECK_LABELS.done;
        } else if (selfCheckProgress >= (index / SELF_CHECK_ITEMS.length) * 100) {
          li.classList.add('is-active');
          status.textContent = SELF_CHECK_LABELS.checking;
          status.classList.add('is-checking');
        } else {
          status.textContent = SELF_CHECK_LABELS.waiting;
        }
      } else if (state === 'done') {
        if (item.ok) {
          status.textContent = SELF_CHECK_LABELS.normal;
          status.classList.add('is-normal');
        } else {
          status.textContent = SELF_CHECK_LABELS.abnormal;
          status.classList.add('is-abnormal');
          status.setAttribute('role', 'button');
          status.setAttribute('tabindex', '0');
          status.addEventListener('click', () => openSelfCheckIssueModal(item));
          status.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openSelfCheckIssueModal(item);
            }
          });
        }
      }

      li.appendChild(name);
      li.appendChild(status);
      selfCheckItemsList.appendChild(li);
    });
  }

  function updateRunningCurrentItem() {
    const activeIndex = SELF_CHECK_ITEMS.findIndex((_, index) => {
      const start = (index / SELF_CHECK_ITEMS.length) * 100;
      const end = ((index + 1) / SELF_CHECK_ITEMS.length) * 100;
      return selfCheckProgress >= start && selfCheckProgress < end;
    });
    const current = activeIndex >= 0 ? SELF_CHECK_ITEMS[activeIndex] : SELF_CHECK_ITEMS[SELF_CHECK_ITEMS.length - 1];
    if (selfCheckCurrentItem && current) {
      selfCheckCurrentItem.textContent = `${SELF_CHECK_LABELS.checkingPrefix} ${current.name}`;
    }
  }

  function resetSelfCheck() {
    if (selfCheckTimer) {
      clearInterval(selfCheckTimer);
      selfCheckTimer = null;
    }
    selfCheckProgress = 0;
    setRingProgress(0);
    if (selfCheckScreen) {
      selfCheckScreen.dataset.state = 'idle';
    }
    if (selfCheckStatusLabel) selfCheckStatusLabel.textContent = SELF_CHECK_LABELS.idleHint;
    if (selfCheckCurrentItem) selfCheckCurrentItem.style.display = 'none';
    renderSelfCheckItems('idle');
  }

  function openSelfCheckScreen() {
    resetSelfCheck();
    if (selfCheckScreen) {
      selfCheckScreen.classList.add('active');
      selfCheckScreen.setAttribute('aria-hidden', 'false');
    }
  }

  function closeSelfCheckScreen() {
    if (selfCheckTimer) {
      clearInterval(selfCheckTimer);
      selfCheckTimer = null;
    }
    if (selfCheckScreen) {
      selfCheckScreen.classList.remove('active');
      selfCheckScreen.setAttribute('aria-hidden', 'true');
    }
    closeSelfCheckIssueModal();
    resetSelfCheck();
  }

  function finishSelfCheck() {
    if (selfCheckTimer) {
      clearInterval(selfCheckTimer);
      selfCheckTimer = null;
    }
    selfCheckProgress = 100;
    setRingProgress(100);
    if (selfCheckScreen) selfCheckScreen.dataset.state = 'done';
    if (selfCheckStatusLabel) selfCheckStatusLabel.textContent = SELF_CHECK_LABELS.complete;
    if (selfCheckCurrentItem) selfCheckCurrentItem.style.display = 'none';
    renderSelfCheckItems('done');
  }

  function startSelfCheck() {
    if (selfCheckTimer) return;

    selfCheckProgress = 0;
    setRingProgress(0);
    if (selfCheckScreen) selfCheckScreen.dataset.state = 'running';
    if (selfCheckStatusLabel) selfCheckStatusLabel.textContent = SELF_CHECK_LABELS.runningHint;
    if (selfCheckCurrentItem) selfCheckCurrentItem.style.display = 'block';
    renderSelfCheckItems('running');
    updateRunningCurrentItem();

    selfCheckTimer = setInterval(() => {
      selfCheckProgress += 1;
      setRingProgress(selfCheckProgress);
      renderSelfCheckItems('running');
      updateRunningCurrentItem();

      if (selfCheckProgress >= 100) {
        finishSelfCheck();
      }
    }, 40);
  }

  function buildSelfCheckIssueQrUrl(item) {
    const payload = JSON.stringify({
      type: 'device-self-check',
      code: item.code,
      item: item.id,
      reason: item.reason
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=12&data=${encodeURIComponent(payload)}`;
  }

  function openSelfCheckIssueModal(item) {
    if (!selfCheckIssueModal || !item) return;
    if (selfCheckIssueTitle) selfCheckIssueTitle.textContent = item.name;
    if (selfCheckIssueReason) selfCheckIssueReason.textContent = item.reason || 'Unknown issue';
    if (selfCheckIssueCode) selfCheckIssueCode.textContent = item.code || '—';
    if (selfCheckIssueQr) {
      selfCheckIssueQr.src = buildSelfCheckIssueQrUrl(item);
      selfCheckIssueQr.alt = `Error QR code for ${item.code || item.name}`;
    }
    selfCheckIssueModal.classList.add('active');
    selfCheckIssueModal.setAttribute('aria-hidden', 'false');
  }

  function closeSelfCheckIssueModal() {
    if (!selfCheckIssueModal) return;
    selfCheckIssueModal.classList.remove('active');
    selfCheckIssueModal.setAttribute('aria-hidden', 'true');
  }

  if (selfCheckBtn) selfCheckBtn.addEventListener('click', openSelfCheckScreen);
  if (selfCheckCloseBtn) selfCheckCloseBtn.addEventListener('click', closeSelfCheckScreen);
  if (startSelfCheckBtn) startSelfCheckBtn.addEventListener('click', startSelfCheck);
  if (selfCheckDoneBtn) selfCheckDoneBtn.addEventListener('click', closeSelfCheckScreen);
  if (closeSelfCheckIssueBtn) closeSelfCheckIssueBtn.addEventListener('click', closeSelfCheckIssueModal);
  if (selfCheckIssueOkBtn) selfCheckIssueOkBtn.addEventListener('click', closeSelfCheckIssueModal);

  // Connect Logic
  if (wifiConnectBtn) wifiConnectBtn.addEventListener('click', () => {
    if (!currentSelectedNetwork) return;
    
    const networkId = currentSelectedNetwork.id;
    
    // Close modal
    closePasswordModal();
    
    // Update UI to show connecting state
    const statusText = document.getElementById(`status-text-${networkId}`);
    const connectBtn = document.querySelector(`#wifi-item-${networkId} .wifi-connect-btn`);
    
    if (statusText) statusText.textContent = 'Connecting...';
    if (connectBtn) {
        connectBtn.textContent = 'Connecting';
        connectBtn.disabled = true;
        connectBtn.style.opacity = '0.5';
        connectBtn.style.pointerEvents = 'none';
    }
    
    // Simulate connection delay
    setTimeout(() => {
      // Disconnect others
      networks.forEach(n => n.connected = false);
      
      // Connect selected
      const network = networks.find(n => n.id === networkId);
      if (network) {
        network.connected = true;
      }
      
      // Show top status chip
      if (wifiStatusChip) wifiStatusChip.style.display = 'inline-flex';
      
      // Re-render list
      renderWifiList();
    }, 1500);
  });
});
