import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-gallery: one row per tile; an image cell plus an optional caption cell.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-gallery-item';
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture') && cell.textContent.trim() === '') {
        cell.className = 'cards-gallery-image';
        li.append(cell);
      } else if (cell.textContent.trim() !== '') {
        cell.className = 'cards-gallery-caption';
        li.append(cell);
      }
    });
    if (li.children.length) ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
  });
  block.replaceChildren(ul);
}
