(() => {
  let overlay, timer;
  const content = document.querySelector('[data-loading-content]');
  let waitingForContent = Boolean(content && content.dataset.contentReady !== 'true');

  function reset() {
    clearTimeout(timer);
    overlay?.remove();
    overlay = undefined;
  }

  function show() {
    reset();
    overlay = document.createElement('div');
    overlay.className = 'page-loading';
    const panel = document.createElement('div');
    panel.className = 'page-loading-panel';
    const spinner = document.createElement('span');
    spinner.className = 'page-loading-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.textContent = '読み込み中…';
    const note = document.createElement('p');
    note.className = 'page-loading-note';
    note.textContent = 'ページを開いています。';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '表示を閉じる';
    close.addEventListener('click', reset);
    panel.append(spinner, status, note, close);
    overlay.append(panel);
    document.body.append(overlay);
    // Never leave the page covered if navigation or application startup fails.
    timer = setTimeout(reset, 10000);
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')) return;
    const destination = new URL(anchor.href);
    if (!['http:', 'https:'].includes(destination.protocol) ||
        destination.origin !== location.origin ||
        (destination.pathname === location.pathname && destination.search === location.search)) return;
    show();
  });

  window.addEventListener('mirai:content-ready', () => {
    waitingForContent = false;
    content?.setAttribute('aria-busy', 'false');
    reset();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted || !waitingForContent) reset();
  });
  if (waitingForContent) show();
})();
