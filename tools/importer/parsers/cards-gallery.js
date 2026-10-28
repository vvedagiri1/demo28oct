/* eslint-disable */
/* global WebImporter */
/**
 * Parser: cards-gallery
 * Source: https://www.wknd-trendsetters.site/
 * Root: .grid-layout.desktop-4-column.grid-gap-sm
 * Authored structure: one row per tile, two cells: (1) image, (2) optional caption (empty here).
 */
export default function parse(element, { document }) {
  const cells = [];
  const tiles = [...element.querySelectorAll(':scope > div')];
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (!img) return;
    const captionEl = tile.querySelector('figcaption, p, h3, h4');
    cells.push([img, captionEl || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
