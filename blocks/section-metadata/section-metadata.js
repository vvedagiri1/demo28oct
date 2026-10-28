import { readBlockConfig, toCamelCase, toClassName } from '../../scripts/aem.js';

/**
 * section-metadata: applies its key/value rows to the enclosing section and removes itself.
 * `style` values (comma-separated) become section classes; other keys become data attributes.
 * @param {Element} block
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    const config = readBlockConfig(block);
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'style') {
        String(value).split(',')
          .map((style) => toClassName(style.trim()))
          .filter(Boolean)
          .forEach((style) => section.classList.add(style));
      } else {
        section.dataset[toCamelCase(key)] = value;
      }
    });
    section.classList.remove('section-metadata-container');
  }
  const wrapper = block.parentElement;
  block.remove();
  if (wrapper?.classList.contains('section-metadata-wrapper') && !wrapper.children.length) wrapper.remove();
}
