/* eslint-disable */
/* global WebImporter */
/**
 * Parser: tabs-testimonial
 * Source: https://www.wknd-trendsetters.site/
 * Root: .tabs-wrapper
 * Authored structure: one row per tab, two cells:
 *   (1) tab label: avatar image, name (bold), role
 *   (2) panel: image, name (bold), role, quotation paragraph
 * Tab buttons (.tab-menu-link) and panes (.tab-pane) are paired by document order.
 */
export default function parse(element, { document }) {
  const buttons = [...element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu > button')]
    .filter((el, i, arr) => arr.indexOf(el) === i);
  const panes = [...element.querySelectorAll('.tabs-content > .tab-pane')];

  const boldParagraph = (text) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text;
    p.append(strong);
    return p;
  };
  const textParagraph = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
  };

  const cells = [];
  const count = Math.max(buttons.length, panes.length);
  for (let i = 0; i < count; i += 1) {
    const button = buttons[i];
    const pane = panes[i];

    // Cell 1: tab label
    const labelCell = [];
    if (button) {
      const avatar = button.querySelector('img');
      const name = button.querySelector('strong');
      if (avatar) {
        if (!avatar.getAttribute('alt') && name) avatar.setAttribute('alt', name.textContent.trim());
        labelCell.push(avatar);
      }
      if (name && name.textContent.trim()) labelCell.push(boldParagraph(name.textContent.trim()));
      const lines = [...button.querySelectorAll('.paragraph-sm')]
        .filter((el) => !el.querySelector('strong') && el.textContent.trim());
      lines.forEach((el) => labelCell.push(textParagraph(el.textContent.trim())));
    }

    // Cell 2: panel content
    const panelCell = [];
    if (pane) {
      const img = pane.querySelector('img');
      if (img) panelCell.push(img);
      const name = pane.querySelector('strong');
      if (name && name.textContent.trim()) panelCell.push(boldParagraph(name.textContent.trim()));
      const nameBlock = name ? name.closest('div') : null;
      const metaWrap = nameBlock ? nameBlock.parentElement : null;
      if (metaWrap) {
        [...metaWrap.children]
          .filter((el) => el !== nameBlock && !el.querySelector('strong') && el.textContent.trim())
          .forEach((el) => panelCell.push(textParagraph(el.textContent.trim())));
      }
      pane.querySelectorAll('p').forEach((p) => panelCell.push(p));
    }

    if (!labelCell.length && !panelCell.length) continue;
    cells.push([labelCell, panelCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
