/* eslint-disable */
/* global WebImporter */
/**
 * Parser: hero-overlay-card
 * Source: https://www.wknd-trendsetters.site/
 * Root: section.inverse-section .utility-position-relative.utility-radius-card
 * Authored structure (1 column):
 *   row 1: background image
 *   row 2: heading, paragraph, CTA link(s) each in its own paragraph
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background image (direct child cover image, not inside the card body)
  const bgImg = element.querySelector(':scope > img') || element.querySelector('img.cover-image, img');
  cells.push([bgImg ? [bgImg] : '']);

  // Row 2: content
  const body = element.querySelector('.card-body') || element;
  const content = [];
  const heading = body.querySelector('h1, h2, h3, h4');
  if (heading) content.push(heading);
  body.querySelectorAll('p').forEach((p) => {
    if (!p.closest('.button-group')) content.push(p);
  });
  body.querySelectorAll('.button-group a, a.button').forEach((a) => {
    if (content.some((n) => n.contains(a))) return;
    const p = document.createElement('p');
    p.append(a);
    content.push(p);
  });
  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay-card', cells });
  element.replaceWith(block);
}
