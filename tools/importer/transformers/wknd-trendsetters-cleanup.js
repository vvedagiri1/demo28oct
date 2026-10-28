/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for wknd-trendsetters.site.
 * Removes non-authorable site chrome (global navbar, footer, skip link),
 * non-content elements and framework tracking attributes.
 * Selectors are taken from migration-work/cleaned.html.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Global header / navigation (handled by the nav fragment)
    // and global footer (handled by the footer fragment).
    WebImporter.DOMUtils.remove(element, [
      'div.navbar',
      'footer.footer.inverse-footer',
      'a.skip-link',
      'button.nav-mobile-menu-button',
    ]);
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'noscript',
      'link',
      'iframe',
      'source',
    ]);

    // Strip Astro scoping attributes (data-astro-cid-*).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-')) el.removeAttribute(attr.name);
      });
    });
    [...element.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-astro-')) element.removeAttribute(attr.name);
    });
  }
}
