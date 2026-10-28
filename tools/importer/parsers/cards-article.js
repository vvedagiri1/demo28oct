/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-article
 * Source: https://www.wknd-trendsetters.site/
 * Root: .grid-layout.desktop-4-column.grid-gap-md
 * Authored structure: one row per article, two cells:
 *   (1) image
 *   (2) tag paragraph, date paragraph, H3 title linked to the article
 * The source card is a wrapping <a>; its href is rebuilt on the title.
 */
export default function parse(element, { document }) {
  const cells = [];
  const cards = [...element.querySelectorAll('.article-card')];

  cards.forEach((card) => {
    const href = card.getAttribute('href')
      || (card.querySelector('a[href]') && card.querySelector('a[href]').getAttribute('href'));

    // Cell 1: image
    const img = card.querySelector('.article-card-image img, img');

    // Cell 2: tag, date, linked title
    const body = [];
    const tag = card.querySelector('.article-card-meta .tag');
    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      body.push(p);
    }
    const date = card.querySelector('.article-card-meta span:not(.tag)');
    if (date && date.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      body.push(p);
    }
    const title = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title.textContent.trim();
        h3.append(a);
      } else {
        h3.textContent = title.textContent.trim();
      }
      body.push(h3);
    }

    if (!img && !body.length) return;
    cells.push([img || '', body]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
