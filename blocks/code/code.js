export default function decorate(block) {
  const paras = [...block.querySelectorAll('p')];
  const text = paras.length
    ? paras.map((p) => p.textContent).join('\n')
    : block.textContent.trim();

  const pre = document.createElement('pre');
  pre.textContent = text;

  const button = document.createElement('button');
  button.className = 'code-copy-btn';
  button.title = 'Copy to clipboard';
  button.setAttribute('aria-label', 'Copy to clipboard');

  button.addEventListener('click', () => {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      button.classList.add('code-copied');
      setTimeout(() => button.classList.remove('code-copied'), 1500);
    });
  });

  block.innerHTML = '';
  block.append(button, pre);
}
