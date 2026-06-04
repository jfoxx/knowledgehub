function buildModal(id, contentNodes, dismissible = true) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = `modal-${id}`;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.hidden = true;

  const container = document.createElement('div');
  container.className = 'modal-container';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close modal');

  const content = document.createElement('main');
  content.className = 'modal-content';
  content.append(...contentNodes);

  if (dismissible) {
    container.append(closeBtn, content);
  } else {
    container.append(content);
  }
  overlay.appendChild(container);

  function openModal() {
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    if (dismissible) closeBtn.focus();
  }

  function closeModal() {
    if (!dismissible) return;
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
  }

  if (dismissible) {
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hidden) closeModal();
    });
  }

  overlay.openModal = openModal;
  overlay.closeModal = closeModal;

  return overlay;
}

function wireClickTriggers(id) {
  document.querySelectorAll(`[href="#modal-${id}"], [data-opens-modal="${id}"]`).forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(`modal-${id}`)?.openModal();
    });
  });
}

export function initModals(main) {
  let index = 0;

  main.querySelectorAll('.section[data-modal="true"]').forEach((section) => {
    const openMode = (section.dataset.modalOpen || 'auto').toLowerCase().trim();
    const unsetProp = section.dataset.unsetProp?.trim() || null;
    const dismissible = section.dataset.dismissible?.toLowerCase().trim() !== 'false';
    const id = unsetProp || String(index);
    index += 1;

    // Pull all wrapper divs out of the section as modal content
    const contentNodes = [...section.children].filter((el) => !el.classList.contains('section-metadata'));

    const modal = buildModal(id, contentNodes, dismissible);
    document.body.appendChild(modal);

    // Remove the now-empty section from the page flow
    section.remove();

    if (openMode === 'auto') {
      const alreadySeen = unsetProp && localStorage.getItem(unsetProp) === 'true';
      if (!alreadySeen) {
        modal.openModal();
        if (unsetProp) localStorage.setItem(unsetProp, 'true');
      }
    } else if (openMode === 'click') {
      wireClickTriggers(id);
    }
  });
}
