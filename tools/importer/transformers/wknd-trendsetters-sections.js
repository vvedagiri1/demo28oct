/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for wknd-trendsetters.site.
 * beforeTransform: inserts <hr> section breaks (while parser targets still exist)
 *   and marks breaks of styled sections with data-excat-section-id.
 * afterTransform: adds Section Metadata blocks for styled sections and removes
 *   temporary markers.
 */
const MARKER = 'data-excat-section-id';

function findSection(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector in this environment, try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;
  const document = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSection(element, section);
      if (!el) continue;
      if (i > 0 || section.style) {
        const hr = document.createElement('hr');
        if (section.style) hr.setAttribute(MARKER, section.id);
        el.before(hr);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);

      if (section.style) {
        const meta = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        const el = findSection(element, section);
        if (el) {
          el.after(meta);
        } else if (marker) {
          // place at the end of the section: before the next section break
          let next = marker.nextElementSibling;
          while (next && next.tagName !== 'HR') next = next.nextElementSibling;
          if (next) next.before(meta);
          else marker.parentElement.append(meta);
        }
      }

      if (marker) {
        if (i === 0) marker.remove();
        else marker.removeAttribute(MARKER);
      }
    }
  }
}
