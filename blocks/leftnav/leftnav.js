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

    if (!topLabel) return;

    if (!sections.has(topLabel)) {
      sections.set(topLabel, { link: topLink, children: [] });
    }

    if (childLabel) {
      const fullLink = `${topLink.replace(/\/$/, '')}/${childLink.replace(/^\//, '')}`;
      sections.get(topLabel).children.push({ label: childLabel, link: fullLink });
    }
  });

  return sections;
}

function renderSections(sections) {
  const ul = document.createElement('ul');
  ul.className = 'uk-accordion-default';
  ul.setAttribute('uk-accordion', 'multiple: false; animation: false');

  sections.forEach(({ link, children }, label) => {
    const li = document.createElement('li');

    if (children.length === 0) {
      // Direct link — no accordion
      const a = document.createElement('a');
      a.href = link;
      a.className = 'uk-accordion-title leftnav-direct-link';
      a.textContent = label;
      if (window.location.pathname === link) li.classList.add('uk-active');
      li.appendChild(a);
    } else {
      // Accordion section with children
      const isOpen = children.some((c) => window.location.pathname === c.link);
      if (isOpen) li.classList.add('uk-open');

      const toggle = document.createElement('a');
      toggle.className = 'uk-accordion-title';
      toggle.href = '#';
      toggle.innerHTML = `${label} <span uk-accordion-icon></span>`;

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
  wrapper.appendChild(renderSections(sections));
  block.appendChild(wrapper);

}
