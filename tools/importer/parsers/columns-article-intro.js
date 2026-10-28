/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-article-intro
 * Source: https://www.wknd-trendsetters.site/
 * Root: .grid-layout.grid-gap-lg:has(.breadcrumbs)
 * Authored structure: one row, two cells:
 *   (1) image
 *   (2) breadcrumb links in one paragraph, heading, byline paragraphs
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll(':scope > div')];
  const contentCol = columns.find((col) => col.querySelector('.breadcrumbs, h1, h2, h3'));
  const imageCol = columns.find((col) => col !== contentCol && col.querySelector('img')) || null;

  // Cell 1: image
  const imageCell = [];
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) imageCell.push(img);
  }

  // Cell 2: breadcrumbs, heading, byline
  const contentCell = [];
  if (contentCol) {
    const crumbLinks = [...contentCol.querySelectorAll('.breadcrumbs a')];
    if (crumbLinks.length) {
      const p = document.createElement('p');
      crumbLinks.forEach((a, i) => {
        if (i > 0) p.append(document.createTextNode(' › '));
        p.append(a);
      });
      contentCell.push(p);
    }

    const heading = contentCol.querySelector('h1, h2, h3, h4');
    if (heading) contentCell.push(heading);

    // Byline rows: each flex row of spans becomes one paragraph
    const metaRows = [...contentCol.querySelectorAll('.flex-horizontal')];
    metaRows.forEach((row) => {
      const parts = [...row.querySelectorAll('span')]
        .map((s) => s.textContent.trim())
        .filter(Boolean);
      if (!parts.length) return;
      const p = document.createElement('p');
      p.textContent = parts.join(' ');
      contentCell.push(p);
    });
  }

  const cells = [[imageCell, contentCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article-intro', cells });
  element.replaceWith(block);
}
