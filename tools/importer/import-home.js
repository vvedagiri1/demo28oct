/* eslint-disable */
/* global WebImporter */

import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsArticleIntroParser from './parsers/columns-article-intro.js';
import columnsHeroCollageParser from './parsers/columns-hero-collage.js';
import heroOverlayCardParser from './parsers/hero-overlay-card.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const PAGE_TEMPLATE = {
  "name": "home",
  "urls": [
    "https://www.wknd-trendsetters.site/"
  ],
  "representativeUrl": "https://www.wknd-trendsetters.site/",
  "description": "Homepage: hero collage, featured case study, image gallery, testimonial tabs, latest articles, FAQ and closing banner",
  "urlPattern": "/",
  "blocks": [
    {
      "name": "columns-hero-collage",
      "instances": [
        "header.section.secondary-section .grid-layout.grid-gap-xxl"
      ]
    },
    {
      "name": "columns-article-intro",
      "instances": [
        ".grid-layout.grid-gap-lg:has(.breadcrumbs)",
        ".grid-layout.tablet-1-column.grid-gap-lg"
      ]
    },
    {
      "name": "cards-gallery",
      "instances": [
        ".grid-layout.desktop-4-column.grid-gap-sm"
      ]
    },
    {
      "name": "tabs-testimonial",
      "instances": [
        ".tabs-wrapper"
      ]
    },
    {
      "name": "cards-article",
      "instances": [
        ".grid-layout.desktop-4-column.grid-gap-md"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        ".faq-list"
      ]
    },
    {
      "name": "hero-overlay-card",
      "instances": [
        "section.inverse-section .utility-position-relative.utility-radius-card"
      ]
    }
  ],
  "sections": [
    {
      "id": "rc1",
      "name": "Hero intro",
      "selector": [
        "header.section.secondary-section"
      ],
      "style": "light-grey",
      "blocks": [
        "columns-hero-collage"
      ],
      "defaultContent": []
    },
    {
      "id": "rc2",
      "name": "Featured case study",
      "selector": [
        "section.section:has(.breadcrumbs)",
        "#main-content > section.section:nth-of-type(1)"
      ],
      "style": null,
      "blocks": [
        "columns-article-intro"
      ],
      "defaultContent": []
    },
    {
      "id": "rc3",
      "name": "Style in every snapshot",
      "selector": [
        "section.secondary-section:has(.grid-gap-sm)",
        "#main-content > section.section.secondary-section:nth-of-type(2)"
      ],
      "style": "light-grey, centered",
      "blocks": [
        "cards-gallery"
      ],
      "defaultContent": [
        ".utility-text-align-center.utility-margin-bottom-8rem > h2",
        ".utility-text-align-center.utility-margin-bottom-8rem > p"
      ]
    },
    {
      "id": "rc4",
      "name": "Testimonials",
      "selector": [
        "section.section:has(.tabs-wrapper)",
        "#main-content > section.section:nth-of-type(3)"
      ],
      "style": null,
      "blocks": [
        "tabs-testimonial"
      ],
      "defaultContent": []
    },
    {
      "id": "rc5",
      "name": "Latest articles",
      "selector": [
        "section.secondary-section:has(.article-card)",
        "#main-content > section.section.secondary-section:nth-of-type(4)"
      ],
      "style": "light-grey, centered",
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        "section.secondary-section:has(.article-card) .utility-text-align-center > h2",
        "section.secondary-section:has(.article-card) .utility-text-align-center > p"
      ]
    },
    {
      "id": "rc6",
      "name": "FAQ",
      "selector": [
        "section.section:has(.faq-list)",
        "#main-content > section.section:nth-of-type(5)"
      ],
      "style": "split",
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": [
        ".grid-layout.grid-gap-xxl:has(.faq-list) > div:first-child > h2",
        ".grid-layout.grid-gap-xxl:has(.faq-list) > div:first-child > p"
      ]
    },
    {
      "id": "rc7",
      "name": "Closing banner",
      "selector": [
        "section.inverse-section"
      ],
      "style": null,
      "blocks": [
        "hero-overlay-card"
      ],
      "defaultContent": []
    }
  ]
};

const parsers = {
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'columns-article-intro': columnsArticleIntroParser,
  'columns-hero-collage': columnsHeroCollageParser,
  'hero-overlay-card': heroOverlayCardParser,
  'tabs-testimonial': tabsTestimonialParser,
};
const transformers = [cleanupTransformer, sectionsTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (pageBlocks.some((b) => b.element === element)) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
