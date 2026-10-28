import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Mark the meta paragraphs (tag, date) that precede the title heading.
 * @param {Element} body
 */
function decorateBody(body) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  const children = [...body.children];
  const headingIndex = heading ? children.indexOf(heading) : children.length;
  const metaParas = children.slice(0, headingIndex).filter((el) => el.tagName === 'P');
  if (metaParas.length) {
    const meta = document.createElement('div');
    meta.className = 'cards-article-meta';
    metaParas[0].before(meta);
    metaParas.forEach((p, i) => {
      p.classList.add(i === 0 && metaParas.length > 1 ? 'cards-article-tag' : 'cards-article-date');
      meta.append(p);
    });
    if (metaParas.length === 1) metaParas[0].className = 'cards-article-tag';
  }
  if (heading) heading.classList.add('cards-article-title');
}

/**
 * cards-article: one row per article. Cell 1 image, cell 2 tag, date, title (linked).
 * The whole card becomes clickable via the first link in the card.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture') && cell.textContent.trim() === '') {
        cell.className = 'cards-article-image';
        li.append(cell);
      } else if (cell.textContent.trim() !== '') {
        cell.className = 'cards-article-body';
        decorateBody(cell);
        li.append(cell);
      }
    });
    if (!li.children.length) return;

    const link = li.querySelector('.cards-article-title a') || li.querySelector('a');
    if (link) {
      li.classList.add('cards-article-linked');
      link.classList.add('cards-article-link');
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
  });
  block.replaceChildren(ul);
}
