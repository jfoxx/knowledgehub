export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const [frontCell, backCell] = [...row.children];
    if (!frontCell) return;

    const li = document.createElement('li');
    li.className = 'flip-card';

    const inner = document.createElement('div');
    inner.className = 'flip-card-inner';

    const front = document.createElement('div');
    front.className = 'flip-card-front';
    while (frontCell.firstChild) front.append(frontCell.firstChild);

    const back = document.createElement('div');
    back.className = 'flip-card-back';
    if (backCell) while (backCell.firstChild) back.append(backCell.firstChild);

    inner.append(front, back);
    li.append(inner);

    li.addEventListener('click', () => li.classList.toggle('is-flipped'));

    ul.append(li);
  });

  block.replaceChildren(ul);
}
