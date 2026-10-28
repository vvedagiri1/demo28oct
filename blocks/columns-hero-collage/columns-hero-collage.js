import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when a paragraph holds nothing but links (a CTA/button paragraph).
 * @param {Element} p
 */
function isLinkOnly(p) {
  const links = [...p.querySelectorAll('a')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s/g, '');
  return p.textContent.replace(/\s/g, '') === linkText;
}

/**
 * columns-hero-collage: one row with a text/CTA cell beside an image collage cell.
 * A cell holding only pictures becomes the collage; any other cell is text.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-hero-collage-row');
    [...row.children].forEach((cell) => {
      const pictures = [...cell.querySelectorAll('picture')];
      if (pictures.length && cell.textContent.trim() === '') {
        cell.classList.add('columns-hero-collage-images');
        const grid = document.createElement('div');
        grid.className = `columns-hero-collage-grid columns-hero-collage-grid-${Math.min(pictures.length, 4)}`;
        pictures.forEach((pic) => {
          const img = pic.querySelector('img');
          const item = document.createElement('div');
          item.className = 'columns-hero-collage-image';
          item.append(img
            ? createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '750' }, { width: '600' }])
            : pic);
          grid.append(item);
        });
        cell.replaceChildren(grid);
        return;
      }

      cell.classList.add('columns-hero-collage-text');
      const ctas = [...cell.querySelectorAll(':scope > p')].filter(isLinkOnly);
      if (ctas.length) {
        const group = document.createElement('div');
        group.className = 'columns-hero-collage-buttons';
        ctas[0].before(group);
        ctas.forEach((p) => group.append(p));
      }
    });
  });
}
