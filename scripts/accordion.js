/**
 * Lightweight accordion — replaces UIKit's [uk-accordion] component.
 * Handles [uk-accordion] elements anywhere in the document.
 * Exported initAccordion(el) lets blocks initialize dynamically-created markup.
 */

function parseOptions(str) {
  const opts = { multiple: true, animation: true };
  if (!str) return opts;
  str.split(';').forEach((pair) => {
    const [k, v] = pair.split(':').map((s) => s.trim());
    if (k === 'multiple') opts.multiple = v !== 'false';
    if (k === 'animation') opts.animation = v !== 'false';
  });
  return opts;
}

function getContent(li) {
  return li.querySelector('.uk-accordion-content');
}

function openItem(li) {
  li.classList.add('uk-open');
  const content = getContent(li);
  if (content) content.removeAttribute('hidden');
  const title = li.querySelector('.uk-accordion-title');
  if (title) title.setAttribute('aria-expanded', 'true');
}

function closeItem(li) {
  li.classList.remove('uk-open');
  const content = getContent(li);
  if (content) content.setAttribute('hidden', '');
  const title = li.querySelector('.uk-accordion-title');
  if (title) title.setAttribute('aria-expanded', 'false');
}

export function initAccordion(el) {
  const opts = parseOptions(el.getAttribute('uk-accordion'));

  // Sync hidden attribute with initial uk-open state
  [...el.children].forEach((li) => {
    const content = getContent(li);
    if (!content) return;
    if (li.classList.contains('uk-open')) {
      content.removeAttribute('hidden');
      const title = li.querySelector('.uk-accordion-title');
      if (title) title.setAttribute('aria-expanded', 'true');
    } else {
      content.setAttribute('hidden', '');
      const title = li.querySelector('.uk-accordion-title');
      if (title) title.setAttribute('aria-expanded', 'false');
    }
  });

  el.addEventListener('click', (e) => {
    const title = e.target.closest('.uk-accordion-title');
    if (!title) return;
    // ignore direct-link titles (no accordion content)
    const li = title.closest('li');
    if (!li || !getContent(li)) return;
    e.preventDefault();

    const isOpen = li.classList.contains('uk-open');

    if (!opts.multiple) {
      [...el.children].forEach((sibling) => {
        if (sibling !== li) closeItem(sibling);
      });
    }

    if (isOpen) {
      closeItem(li);
    } else {
      openItem(li);
    }
  });
}

// Auto-init all [uk-accordion] elements on load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[uk-accordion]').forEach(initAccordion);
});
