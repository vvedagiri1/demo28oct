import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-overlay-card: background image row + content row (heading, text, CTA).
 * Tolerates image and content authored in the same row/cell or in either order.
 * @param {Element} block
 */
export default function decorate(block) {
  const pic = block.querySelector('picture');
  const media = document.createElement('div');
  media.className = 'hero-overlay-card-media';
  if (pic) {
    const img = pic.querySelector('img');
    const optimized = img
      ? createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }])
      : pic;
    const holder = pic.parentElement;
    pic.remove();
    // drop the now-empty wrapper paragraph left behind by the picture
    if (holder && holder.tagName === 'P' && !holder.textContent.trim() && !holder.children.length) holder.remove();
    media.append(optimized);
  }

  const content = document.createElement('div');
  content.className = 'hero-overlay-card-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.textContent.trim() || cell.children.length) content.append(...cell.childNodes);
    });
  });

  const ctas = [...content.querySelectorAll(':scope > p')].filter((p) => {
    const links = [...p.querySelectorAll('a')];
    return links.length && p.textContent.replace(/\s/g, '') === links.map((a) => a.textContent).join('').replace(/\s/g, '');
  });
  if (ctas.length) {
    const group = document.createElement('div');
    group.className = 'hero-overlay-card-buttons';
    ctas[0].before(group);
    ctas.forEach((p) => group.append(p));
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay-card-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  if (!pic) block.classList.add('hero-overlay-card-no-image');
  block.replaceChildren(...(pic ? [media, overlay] : []), content);
}
