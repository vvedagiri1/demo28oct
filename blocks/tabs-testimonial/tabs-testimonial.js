import { createOptimizedPicture } from '../../scripts/aem.js';

let instance = 0;

function optimizeImages(root, eager, width) {
  root.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, eager, [{ width }]));
  });
}

/**
 * Split a panel cell into a media column (pictures) and a text column.
 * @param {Element} cell
 */
function buildPanelBody(cell) {
  const media = document.createElement('div');
  media.className = 'tabs-testimonial-media';
  const text = document.createElement('div');
  text.className = 'tabs-testimonial-text';
  [...cell.childNodes].forEach((node) => {
    const isPictureOnly = node.nodeType === Node.ELEMENT_NODE
      && node.querySelector('picture') && node.textContent.trim() === '';
    if (node.nodeName === 'PICTURE' || isPictureOnly) media.append(node);
    else if (node.nodeType === Node.ELEMENT_NODE || node.textContent.trim()) text.append(node);
  });
  const quote = [...text.querySelectorAll('p')].pop();
  if (quote && text.querySelectorAll('p').length > 1) quote.classList.add('tabs-testimonial-quote');
  const body = document.createElement('div');
  body.className = 'tabs-testimonial-body';
  if (media.children.length) body.append(media);
  body.append(text);
  return body;
}

/**
 * tabs-testimonial: one row per tab.
 * Cell 1: tab label (avatar, name, role). Cell 2: panel (image, name, role, quote).
 * @param {Element} block
 */
export default function decorate(block) {
  instance += 1;
  const id = `tabs-testimonial-${instance}`;
  const rows = [...block.children].filter((row) => row.children.length);
  if (!rows.length) return;

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panels';
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [];
  rows.forEach((row, i) => {
    const [labelCell, panelCell] = [...row.children];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-testimonial-tab';
    button.id = `${id}-tab-${i}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${id}-panel-${i}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.tabIndex = i === 0 ? 0 : -1;
    if (labelCell) {
      // unwrap paragraphs so the button contains phrasing-friendly blocks
      const label = document.createElement('span');
      label.className = 'tabs-testimonial-tab-label';
      const avatar = labelCell.querySelector('picture');
      if (avatar) {
        const avatarWrap = document.createElement('span');
        avatarWrap.className = 'tabs-testimonial-avatar';
        avatarWrap.append(avatar);
        button.append(avatarWrap);
      }
      [...labelCell.children].forEach((el) => {
        if (!el.textContent.trim()) return;
        const line = document.createElement('span');
        line.className = 'tabs-testimonial-tab-line';
        line.innerHTML = el.innerHTML;
        label.append(line);
      });
      if (!label.children.length && labelCell.textContent.trim()) {
        label.textContent = labelCell.textContent.trim();
      }
      button.append(label);
    }
    if (!button.textContent.trim()) button.textContent = `Tab ${i + 1}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `${id}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.tabIndex = 0;
    if (i !== 0) panel.hidden = true;
    if (panelCell) panel.append(buildPanelBody(panelCell));

    tabs.push(button);
    tablist.append(button);
    panels.append(panel);
  });

  const select = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      panels.children[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== -1) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  optimizeImages(panels, false, '900');
  optimizeImages(tablist, false, '96');
  block.replaceChildren(panels, tablist);
}
