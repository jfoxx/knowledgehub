const ICONS = {
  info: `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
    <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1z"/>
  </svg>`,
  warning: `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
    <path d="M10 2 1 18h18L10 2zm0 3.5 6.5 11.5H3.5L10 5.5zM9 10v3a1 1 0 0 0 2 0v-3a1 1 0 0 0-2 0zm1 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
  </svg>`,
  close: `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M4 4l12 12M16 4L4 16"/>
  </svg>`,
  check: `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 10l5 5 9-9"/>
  </svg>`,
};

const CLOSE_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M1 1l12 12M13 1L1 13"/>
</svg>`;

export default function decorate(block) {
  let type = 'primary';
  if (block.classList.contains('warning') || block.dataset.type === 'warning') type = 'warning';
  else if (block.classList.contains('danger') || block.dataset.type === 'danger') type = 'danger';
  else if (block.classList.contains('success') || block.dataset.type === 'success') type = 'success';
  else if (block.classList.contains('info') || block.dataset.type === 'info') type = 'info';

  block.classList.add('notebox', 'uk-alert', 'uk-flex', `uk-alert-${type}`);

  const iconName = { primary: 'info', warning: 'warning', danger: 'close', success: 'check', info: 'info' }[type] || 'info';
  const icon = document.createElement('span');
  icon.className = 'notebox-icon uk-icon';
  icon.innerHTML = ICONS[iconName];
  block.prepend(icon);

  if (block.dataset.closable === 'true') {
    const button = document.createElement('button');
    button.className = 'uk-alert-close';
    button.type = 'button';
    button.setAttribute('aria-label', 'Close');
    button.innerHTML = CLOSE_ICON;
    button.addEventListener('click', () => block.remove());
    block.appendChild(button);
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'notebox-content';

  const firstChild = block.children[1];
  if (firstChild && /^H[1-6]$/.test(firstChild.tagName)) {
    firstChild.classList.add('notebox-title');
  }

  [...block.children].forEach((child) => {
    if (child !== icon && !child.classList.contains('uk-alert-close')) {
      contentWrapper.appendChild(child);
    }
  });

  block.appendChild(contentWrapper);
}
