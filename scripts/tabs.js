/**
 * Lightweight tab switcher — replaces UIKit's [uk-tab] + .uk-switcher.
 * Exported initTabs(tabList, contentList) lets blocks initialize manually.
 */

export function initTabs(tabList, contentList) {
  const tabs = [...tabList.querySelectorAll(':scope > li')];
  const panels = contentList ? [...contentList.querySelectorAll(':scope > li')] : [];

  function activate(index) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle('uk-active', i === index);
    });
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  // Sync initial state
  const activeIndex = tabs.findIndex((t) => t.classList.contains('uk-active'));
  activate(activeIndex >= 0 ? activeIndex : 0);

  tabList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const index = tabs.indexOf(li);
    if (index >= 0) {
      e.preventDefault();
      activate(index);
    }
  });
}

// Auto-init all [uk-tab] elements on load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[uk-tab]').forEach((tabList) => {
    const switcher = tabList.parentElement?.querySelector('.uk-switcher')
      || tabList.nextElementSibling;
    initTabs(tabList, switcher?.tagName === 'UL' ? switcher : null);
  });
});
