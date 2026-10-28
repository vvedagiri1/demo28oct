import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when a paragraph holds only links plus optional separator characters.
 * @param {Element} p
 */
function isBreadcrumbParagraph(p) {
  const links = [...p.querySelectorAll('a')];
  if (!links.length) return false;
  let rest = p.textContent;
  links.forEach((a) => { rest = rest.replace(a.textContent, ''); });
  return rest.replace(/[\s>/|•›»·-]/g, '') === '';
}

/**
 * columns-article-intro: image cell beside breadcrumbs, heading and byline meta.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-article-intro-row');
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && cell.textContent.trim() === '') {
        cell.classList.add('columns-article-intro-image');
        const img = pic.querySelector('img');
        if (img) {
          pic.replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '1000' }, { width: '750' }]));
        }
        return;
      }

      cell.classList.add('columns-article-intro-content');
      const children = [...cell.children];
      const heading = cell.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
      const headingIndex = heading ? children.indexOf(heading) : children.length;

      // breadcrumbs: link-only paragraphs before the heading
      children.slice(0, headingIndex)
        .filter((el) => el.tagName === 'P' && isBreadcrumbParagraph(el))
        .forEach((p) => {
          const nav = document.createElement('nav');
          nav.className = 'columns-article-intro-breadcrumbs';
          nav.setAttribute('aria-label', 'Breadcrumb');
          const ol = document.createElement('ol');
          p.querySelectorAll('a').forEach((a) => {
            const li = document.createElement('li');
            li.append(a);
            ol.append(li);
          });
          nav.append(ol);
          p.replaceWith(nav);
        });

      // byline meta: paragraphs after the heading
      if (heading) {
        const meta = children.slice(headingIndex + 1).filter((el) => el.tagName === 'P');
        if (meta.length) {
          const byline = document.createElement('div');
          byline.className = 'columns-article-intro-meta';
          meta[0].before(byline);
          meta.forEach((p) => byline.append(p));
        }
      }
    });
  });
}
