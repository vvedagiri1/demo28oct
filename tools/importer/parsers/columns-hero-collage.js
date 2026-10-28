/* eslint-disable */
/* global WebImporter */
/**
 * Parser: columns-hero-collage
 * Source: https://www.wknd-trendsetters.site/
 * Root: header.section.secondary-section .grid-layout.grid-gap-xxl
 * Authored structure: one row, two cells:
 *   (1) H1, subheading paragraph, CTA links (each in its own paragraph)
 *   (2) collage images
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll(':scope > div')];
  const textCol = columns.find((col) => col.querySelector('h1, h2, h3, p, a')) || columns[0];
  const imageCol = columns.find((col) => col !== textCol && col.querySelector('img'));

  // Cell 1: heading, subheading, CTA links
  const textCell = [];
  if (textCol) {
    const heading = textCol.querySelector('h1, h2, h3');
    if (heading) textCell.push(heading);
    textCol.querySelectorAll('p').forEach((p) => {
      if (!p.closest('.button-group')) textCell.push(p);
    });
    textCol.querySelectorAll('.button-group a, a.button').forEach((a) => {
      if (textCell.some((n) => n.contains && n.contains(a))) return;
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    });
  }

  // Cell 2: collage images
  const imageCell = imageCol ? [...imageCol.querySelectorAll('img')] : [];

  const cells = [[textCell, imageCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero-collage', cells });
  element.replaceWith(block);
}
