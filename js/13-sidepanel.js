(function () {
  const state = {
    shell: null,
    panel: null,
    title: null,
    subtitle: null,
    body: null,
    footer: null,
    previousFocus: null,
    onClose: null
  };

  function ensureShell() {
    if (state.shell && document.body.contains(state.shell)) return;

    const shell = document.createElement('div');
    shell.id = 'appSidePanel';
    shell.className = 'side-panel-shell hidden';
    shell.setAttribute('aria-hidden', 'true');
    shell.innerHTML = `
      <div class="side-panel-backdrop" data-side-panel-close></div>
      <aside class="side-panel" role="dialog" aria-modal="true" aria-labelledby="sidePanelTitle" tabindex="-1">
        <header class="side-panel-header">
          <div class="side-panel-heading">
            <p class="eyebrow">Shine Sales Workspace</p>
            <h2 id="sidePanelTitle"></h2>
            <p id="sidePanelSubtitle" class="side-panel-subtitle"></p>
          </div>
          <button type="button" class="side-panel-close" data-side-panel-close aria-label="Cerrar panel">×</button>
        </header>
        <div class="side-panel-body"></div>
        <footer class="side-panel-footer"></footer>
      </aside>`;

    document.body.appendChild(shell);
    state.shell = shell;
    state.panel = shell.querySelector('.side-panel');
    state.title = shell.querySelector('#sidePanelTitle');
    state.subtitle = shell.querySelector('#sidePanelSubtitle');
    state.body = shell.querySelector('.side-panel-body');
    state.footer = shell.querySelector('.side-panel-footer');

    shell.querySelectorAll('[data-side-panel-close]').forEach(element => {
      element.addEventListener('click', () => close());
    });
  }

  function open(options = {}) {
    ensureShell();
    state.previousFocus = document.activeElement;
    state.onClose = typeof options.onClose === 'function' ? options.onClose : null;
    state.title.textContent = options.title || '';
    state.subtitle.textContent = options.subtitle || '';
    state.subtitle.classList.toggle('hidden', !options.subtitle);
    state.body.innerHTML = '';
    state.footer.innerHTML = '';

    if (options.content instanceof Node) state.body.appendChild(options.content);
    else state.body.innerHTML = options.content || '';

    if (options.footer instanceof Node) state.footer.appendChild(options.footer);
    else state.footer.innerHTML = options.footer || '';
    state.footer.classList.toggle('hidden', !state.footer.childNodes.length);

    state.shell.classList.remove('hidden');
    state.shell.setAttribute('aria-hidden', 'false');
    document.body.classList.add('side-panel-open');
    requestAnimationFrame(() => state.shell.classList.add('is-open'));
    setTimeout(() => state.panel.focus(), 30);
  }

  function close() {
    if (!state.shell || state.shell.classList.contains('hidden')) return;
    state.shell.classList.remove('is-open');
    state.shell.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('side-panel-open');
    const callback = state.onClose;
    state.onClose = null;
    setTimeout(() => {
      state.shell.classList.add('hidden');
      state.body.innerHTML = '';
      state.footer.innerHTML = '';
      if (state.previousFocus && typeof state.previousFocus.focus === 'function') state.previousFocus.focus();
      if (callback) callback();
    }, 220);
  }

  function isOpen() {
    return Boolean(state.shell && !state.shell.classList.contains('hidden'));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) close();
  });

  window.SidePanel = { open, close, isOpen };
})();
