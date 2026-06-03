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

function initLeftnavAccordion(el) {
  [...el.children].forEach((li) => {
    const content = getContent(li);
    if (!content) return;
    if (li.classList.contains('uk-open')) {
      content.removeAttribute('hidden');
      li.querySelector('.uk-accordion-title')?.setAttribute('aria-expanded', 'true');
    } else {
      content.setAttribute('hidden', '');
      li.querySelector('.uk-accordion-title')?.setAttribute('aria-expanded', 'false');
    }
  });

  el.addEventListener('click', (e) => {
    const title = e.target.closest('.uk-accordion-title');
    if (!title) return;
    const li = title.closest('li');
    if (!li || !getContent(li)) return;
    e.preventDefault();

    const isOpen = li.classList.contains('uk-open');
    [...el.children].forEach((sibling) => { if (sibling !== li) closeItem(sibling); });
    if (isOpen) closeItem(li); else openItem(li);
  });
}

const ICON_MAP = {
  lab: '/icons/Smock_Beaker_18_N.svg',
};

function buildIconSpan(iconName) {
  const src = ICON_MAP[iconName?.toLowerCase()];
  if (!src) return null;
  const span = document.createElement('span');
  span.className = `leftnav-icon leftnav-icon-${iconName.toLowerCase()}`;
  span.setAttribute('aria-hidden', 'true');
  span.style.setProperty('--leftnav-icon-src', `url('${src}')`);
  return span;
}

async function getNavTitle() {
  try {
    const resp = await fetch('/placeholders.json');
    if (!resp.ok) throw new Error();
    const json = await resp.json();
    const row = (json?.data || []).find((r) => r.key === 'navTitle');
    return row?.value || 'Knowledge Hub';
  } catch {
    return 'Knowledge Hub';
  }
}

function buildSections(rows) {
  // Map<topLabel, { link, children: [{label, link}] }>
  const sections = new Map();

  rows.forEach((row) => {
    const topLabel = row['Top Level Label']?.trim();
    const topLink = row['Top Level Link']?.trim();
    const childLabel = row['Second Level Label']?.trim();
    const childLink = row['Second Level Link']?.trim();
    const icon = row['Icon']?.trim() || null;

    if (!topLabel) return;

    if (!sections.has(topLabel)) {
      sections.set(topLabel, { link: topLink, icon: childLabel ? null : icon, children: [] });
    }

    if (childLabel) {
      const fullLink = `${topLink.replace(/\/$/, '')}/${childLink.replace(/^\//, '')}`;
      sections.get(topLabel).children.push({ label: childLabel, link: fullLink, icon });
    }
  });

  return sections;
}

function renderSections(sections) {
  const ul = document.createElement('ul');
  ul.className = 'uk-accordion-default';
  ul.setAttribute('uk-accordion', 'multiple: false; animation: false');

  sections.forEach(({ link, icon, children }, label) => {
    const li = document.createElement('li');

    if (children.length === 0) {
      // Direct link — no accordion
      const a = document.createElement('a');
      a.href = link;
      a.className = 'uk-accordion-title leftnav-direct-link';
      a.textContent = label;
      const iconSpan = buildIconSpan(icon);
      if (iconSpan) a.prepend(iconSpan);
      if (window.location.pathname === link) li.classList.add('uk-active');
      li.appendChild(a);
    } else {
      // Accordion section with children
      const isOpen = children.some((c) => window.location.pathname === c.link);
      if (isOpen) li.classList.add('uk-open');

      const toggle = document.createElement('a');
      toggle.className = 'uk-accordion-title';
      toggle.href = '#';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'uk-accordion-label';
      labelSpan.textContent = label;
      const iconSpan = buildIconSpan(icon);
      if (iconSpan) labelSpan.prepend(iconSpan);
      toggle.appendChild(labelSpan);
      toggle.insertAdjacentHTML('beforeend', '<svg class="uk-accordion-icon" width="13" height="13" viewBox="0 0 13 13" aria-hidden="true"><rect width="13" height="1" fill="currentColor" x="0" y="6" class="line-1"></rect><rect width="1" height="13" fill="currentColor" x="6" y="0" class="line-2"></rect></svg>');

      const content = document.createElement('div');
      content.className = 'uk-accordion-content';

      const childList = document.createElement('ul');
      childList.className = 'uk-nav uk-nav-default';

      children.forEach((child) => {
        const childLi = document.createElement('li');
        if (window.location.pathname === child.link) childLi.classList.add('uk-active');

        const a = document.createElement('a');
        a.href = child.link;
        a.textContent = child.label;
        const childIconSpan = buildIconSpan(child.icon);
        if (childIconSpan) a.prepend(childIconSpan);
        childLi.appendChild(a);
        childList.appendChild(childLi);
      });

      content.appendChild(childList);
      li.append(toggle, content);
    }

    ul.appendChild(li);
  });

  return ul;
}

export default async function decorate(block) {
  const titleDiv = document.createElement('div');
  titleDiv.className = 'nav-title';
  titleDiv.innerHTML = `<h3>${await getNavTitle()}</h3>`;
  block.append(titleDiv);

  let sections = new Map();

  try {
    const resp = await fetch('/leftnav.json');
    if (!resp.ok) throw new Error('Failed to load leftnav.json');
    const json = await resp.json();
    sections = buildSections(json?.data || []);
  } catch (e) {
    console.error('Left nav failed to load', e);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'aem-parent';
  const ul = renderSections(sections);
  wrapper.appendChild(ul);
  block.appendChild(wrapper);
  initLeftnavAccordion(ul);

}
