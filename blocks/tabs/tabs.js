import { toClassName } from '../../scripts/aem.js';
import { initTabs } from '../../scripts/tabs.js';

export default function decorate(block) {
  const tabNav = document.createElement('ul');
  tabNav.className = 'uk-tab';

  const switcher = document.createElement('ul');
  switcher.className = 'uk-switcher uk-margin';

  [...block.children].forEach((row, i) => {
    const heading = row.firstElementChild;

    const li = document.createElement('li');
    if (i === 0) li.classList.add('uk-active');

    const a = document.createElement('a');
    a.textContent = heading.textContent;
    a.href = '#';

    li.appendChild(a);
    tabNav.appendChild(li);

    const panel = document.createElement('li');
    heading.remove();
    panel.append(...row.children);
    switcher.appendChild(panel);
  });

  block.textContent = '';
  block.append(tabNav, switcher);

  initTabs(tabNav, switcher);
}
