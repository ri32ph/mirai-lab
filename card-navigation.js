(() => {
  const cardSelector = [
    'a.card',
    'a.ad-card',
    'a.cm-link',
    'a.fa-card',
    'a.h-article-card',
    'a.h-entry-card',
    'a.ky-card',
    'a.medical-card',
    'a.oa-card',
    'a.v-card',
    'a.tile',
    'a.lab-card',
  ].join(', ');
  let pending;

  function reset() {
    if (!pending) return;
    clearTimeout(pending.timer);
    pending.label.remove();
    pending = undefined;
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;

    const card = event.target.closest(cardSelector);
    if (!card || card.hasAttribute('download') ||
        (card.target && card.target !== '_self')) return;

    const destination = new URL(card.href);
    if (destination.protocol !== location.protocol || destination.host !== location.host ||
        (destination.pathname === location.pathname && destination.search === location.search)) return;

    reset();
    const label = document.createElement('span');
    label.className = 'card-navigation-status';
    label.setAttribute('role', 'status');
    document.body.append(label);
    label.textContent = '開いています…';
    pending = { label, timer: setTimeout(reset, 10000) };
  });

  window.addEventListener('pageshow', reset);
})();
