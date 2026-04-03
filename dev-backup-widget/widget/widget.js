(function () {
  'use strict';

  if (window.__DEV_BACKUP_WIDGET_MOUNTED__) return;
  window.__DEV_BACKUP_WIDGET_MOUNTED__ = true;

  var cfg = window.__DEV_BACKUP__ || {};
  var apiOrigin = String(cfg.apiOrigin || 'http://127.0.0.1:37547').replace(/\/$/, '');

  var root = document.createElement('div');
  root.setAttribute('data-dev-backup-widget', '');
  root.style.cssText = [
    'position:fixed',
    'z-index:2147483646',
    'font-family:system-ui,-apple-system,sans-serif',
    'font-size:13px',
    '-webkit-user-select:none',
    'user-select:none',
  ].join(';');

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.title = 'Backup project to GitHub (dev-backup-widget)';
  btn.textContent = '☁';
  btn.style.cssText = [
    'width:44px',
    'height:44px',
    'border-radius:50%',
    'border:none',
    'cursor:grab',
    'background:#1e293b',
    'color:#f8fafc',
    'font-size:20px',
    'line-height:1',
    'box-shadow:0 4px 14px rgba(0,0,0,.35)',
    'display:flex',
    'align-items:center',
    'justify-content:center',
  ].join(';');

  var status = document.createElement('div');
  status.style.cssText = [
    'margin-top:8px',
    'max-width:240px',
    'padding:8px 10px',
    'border-radius:8px',
    'background:#0f172a',
    'color:#e2e8f0',
    'font-size:12px',
    'line-height:1.35',
    'box-shadow:0 4px 14px rgba(0,0,0,.35)',
    'display:none',
    'word-break:break-word',
  ].join(';');

  root.appendChild(btn);
  root.appendChild(status);
  document.body.appendChild(root);

  var pos = loadPos();
  applyPos(pos);

  function loadPos() {
    try {
      var raw = localStorage.getItem('__dev_backup_widget_pos__');
      if (raw) {
        var p = JSON.parse(raw);
        if (typeof p.x === 'number' && typeof p.y === 'number') return p;
      }
    } catch (_) {}
    return { x: null, y: null };
  }

  function savePos(p) {
    try {
      localStorage.setItem('__dev_backup_widget_pos__', JSON.stringify(p));
    } catch (_) {}
  }

  function applyPos(p) {
    if (p.x != null && p.y != null) {
      root.style.left = p.x + 'px';
      root.style.top = p.y + 'px';
      root.style.right = 'auto';
      root.style.bottom = 'auto';
    } else {
      root.style.right = '16px';
      root.style.bottom = '16px';
      root.style.left = 'auto';
      root.style.top = 'auto';
    }
  }

  var dragging = false;
  var dragMoved = false;
  var dragOff = { x: 0, y: 0 };

  btn.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    btn.style.cursor = 'grabbing';
    var r = root.getBoundingClientRect();
    dragOff.x = e.clientX - r.left;
    dragOff.y = e.clientY - r.top;
    e.preventDefault();
  });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    dragMoved = true;
    var x = e.clientX - dragOff.x;
    var y = e.clientY - dragOff.y;
    var maxX = window.innerWidth - root.offsetWidth;
    var maxY = window.innerHeight - root.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    root.style.left = x + 'px';
    root.style.top = y + 'px';
    root.style.right = 'auto';
    root.style.bottom = 'auto';
  });

  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    btn.style.cursor = 'grab';
    var r = root.getBoundingClientRect();
    savePos({ x: r.left, y: r.top });
  });

  var state = 'idle';

  function setState(s, msg) {
    state = s;
    if (s === 'idle') {
      status.style.display = 'none';
      btn.disabled = false;
      btn.style.opacity = '1';
      return;
    }
    status.style.display = 'block';
    btn.disabled = s === 'loading';
    btn.style.opacity = s === 'loading' ? '0.65' : '1';
    if (s === 'loading') {
      status.textContent = msg || '备份中…';
      status.style.borderLeft = '3px solid #38bdf8';
    } else if (s === 'ok') {
      status.textContent = msg || '备份完成';
      status.style.borderLeft = '3px solid #22c55e';
      window.setTimeout(function () {
        if (state === 'ok') setState('idle');
      }, 5000);
    } else {
      status.textContent = msg || '备份失败';
      status.style.borderLeft = '3px solid #f87171';
    }
  }

  btn.addEventListener('click', function (e) {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    if (state === 'loading') return;
    runBackup();
  });

  function runBackup() {
    setState('loading', '备份中…');
    fetch(apiOrigin + '/backup', { method: 'POST' })
      .then(function (r) {
        return r.json().then(function (body) {
          return { ok: r.ok, body: body };
        });
      })
      .then(function (res) {
        if (res.ok && res.body && res.body.ok) {
          var m =
            '备份完成（' +
            (res.body.fileCount != null ? res.body.fileCount + ' 个文件' : '已推送') +
            '）';
          if (res.body.commitSha) m += '\n' + String(res.body.commitSha).slice(0, 7);
          setState('ok', m);
        } else {
          var err = (res.body && res.body.error) || '请求失败';
          setState('error', err);
        }
      })
      .catch(function (err) {
        setState(
          'error',
          '无法连接备份服务（' +
            err.message +
            '）。请确认已在本机运行 npx dev-backup serve 且 apiOrigin 正确。'
        );
      });
  }
})();
