const ACCORDION_ICON = `<svg class="uk-accordion-icon" width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
  <rect width="13" height="1" fill="currentColor" x="0" y="6" class="line-1"></rect>
  <rect width="1" height="13" fill="currentColor" x="6" y="0" class="line-2"></rect>
</svg>`;

export default function decorate(block) {
  const accordion = document.createElement('ul');
  accordion.className = 'uk-accordion-default';
  accordion.setAttribute('uk-accordion', '');

  [...block.children].forEach((row, index) => {
    const titleCell = row.children[0];
    const bodyCell = row.children[1];

    const li = document.createElement('li');
    if (index === 0) li.className = 'uk-open';

    const a = document.createElement('a');
    a.className = 'uk-accordion-title';
    a.href = '#';
    a.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    a.append(...titleCell.childNodes);
    a.insertAdjacentHTML('beforeend', ACCORDION_ICON);

    const content = document.createElement('div');
    content.className = 'uk-accordion-content';
    if (index !== 0) content.setAttribute('hidden', '');
    content.append(...bodyCell.childNodes);

    li.append(a, content);
    accordion.appendChild(li);
  });

  block.innerHTML = '';
  block.appendChild(accordion);
}
