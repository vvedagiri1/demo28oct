/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document }) {
    const cells = [];
    const items = [...element.querySelectorAll(":scope > details, .faq-item")].filter((el, i, arr) => arr.indexOf(el) === i);
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const label = summary ? summary.querySelector("span") || summary : null;
      const questionText = label ? label.textContent.trim() : "";
      if (!questionText) return;
      const question = document.createElement("p");
      question.textContent = questionText;
      const answerEl = item.querySelector(".faq-answer");
      let answer = [];
      if (answerEl) {
        answer = [...answerEl.children];
        if (!answer.length && answerEl.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = answerEl.textContent.trim();
          answer = [p];
        }
      }
      cells.push([question, answer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document }) {
    const cells = [];
    const cards = [...element.querySelectorAll(".article-card")];
    cards.forEach((card) => {
      const href = card.getAttribute("href") || card.querySelector("a[href]") && card.querySelector("a[href]").getAttribute("href");
      const img = card.querySelector(".article-card-image img, img");
      const body = [];
      const tag = card.querySelector(".article-card-meta .tag");
      if (tag && tag.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = tag.textContent.trim();
        body.push(p);
      }
      const date = card.querySelector(".article-card-meta span:not(.tag)");
      if (date && date.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = date.textContent.trim();
        body.push(p);
      }
      const title = card.querySelector("h1, h2, h3, h4, h5, h6");
      if (title) {
        const h3 = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = title.textContent.trim();
          h3.append(a);
        } else {
          h3.textContent = title.textContent.trim();
        }
        body.push(h3);
      }
      if (!img && !body.length) return;
      cells.push([img || "", body]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const cells = [];
    const tiles = [...element.querySelectorAll(":scope > div")];
    tiles.forEach((tile) => {
      const img = tile.querySelector("img");
      if (!img) return;
      const captionEl = tile.querySelector("figcaption, p, h3, h4");
      cells.push([img, captionEl || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article-intro.js
  function parse4(element, { document }) {
    const columns = [...element.querySelectorAll(":scope > div")];
    const contentCol = columns.find((col) => col.querySelector(".breadcrumbs, h1, h2, h3"));
    const imageCol = columns.find((col) => col !== contentCol && col.querySelector("img")) || null;
    const imageCell = [];
    if (imageCol) {
      const img = imageCol.querySelector("img");
      if (img) imageCell.push(img);
    }
    const contentCell = [];
    if (contentCol) {
      const crumbLinks = [...contentCol.querySelectorAll(".breadcrumbs a")];
      if (crumbLinks.length) {
        const p = document.createElement("p");
        crumbLinks.forEach((a, i) => {
          if (i > 0) p.append(document.createTextNode(" \u203A "));
          p.append(a);
        });
        contentCell.push(p);
      }
      const heading = contentCol.querySelector("h1, h2, h3, h4");
      if (heading) contentCell.push(heading);
      const metaRows = [...contentCol.querySelectorAll(".flex-horizontal")];
      metaRows.forEach((row) => {
        const parts = [...row.querySelectorAll("span")].map((s) => s.textContent.trim()).filter(Boolean);
        if (!parts.length) return;
        const p = document.createElement("p");
        p.textContent = parts.join(" ");
        contentCell.push(p);
      });
    }
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-hero-collage.js
  function parse5(element, { document }) {
    const columns = [...element.querySelectorAll(":scope > div")];
    const textCol = columns.find((col) => col.querySelector("h1, h2, h3, p, a")) || columns[0];
    const imageCol = columns.find((col) => col !== textCol && col.querySelector("img"));
    const textCell = [];
    if (textCol) {
      const heading = textCol.querySelector("h1, h2, h3");
      if (heading) textCell.push(heading);
      textCol.querySelectorAll("p").forEach((p) => {
        if (!p.closest(".button-group")) textCell.push(p);
      });
      textCol.querySelectorAll(".button-group a, a.button").forEach((a) => {
        if (textCell.some((n) => n.contains && n.contains(a))) return;
        const p = document.createElement("p");
        p.append(a);
        textCell.push(p);
      });
    }
    const imageCell = imageCol ? [...imageCol.querySelectorAll("img")] : [];
    const cells = [[textCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-hero-collage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay-card.js
  function parse6(element, { document }) {
    const cells = [];
    const bgImg = element.querySelector(":scope > img") || element.querySelector("img.cover-image, img");
    cells.push([bgImg ? [bgImg] : ""]);
    const body = element.querySelector(".card-body") || element;
    const content = [];
    const heading = body.querySelector("h1, h2, h3, h4");
    if (heading) content.push(heading);
    body.querySelectorAll("p").forEach((p) => {
      if (!p.closest(".button-group")) content.push(p);
    });
    body.querySelectorAll(".button-group a, a.button").forEach((a) => {
      if (content.some((n) => n.contains(a))) return;
      const p = document.createElement("p");
      p.append(a);
      content.push(p);
    });
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse7(element, { document }) {
    const buttons = [...element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu > button")].filter((el, i, arr) => arr.indexOf(el) === i);
    const panes = [...element.querySelectorAll(".tabs-content > .tab-pane")];
    const boldParagraph = (text) => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = text;
      p.append(strong);
      return p;
    };
    const textParagraph = (text) => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    };
    const cells = [];
    const count = Math.max(buttons.length, panes.length);
    for (let i = 0; i < count; i += 1) {
      const button = buttons[i];
      const pane = panes[i];
      const labelCell = [];
      if (button) {
        const avatar = button.querySelector("img");
        const name = button.querySelector("strong");
        if (avatar) {
          if (!avatar.getAttribute("alt") && name) avatar.setAttribute("alt", name.textContent.trim());
          labelCell.push(avatar);
        }
        if (name && name.textContent.trim()) labelCell.push(boldParagraph(name.textContent.trim()));
        const lines = [...button.querySelectorAll(".paragraph-sm")].filter((el) => !el.querySelector("strong") && el.textContent.trim());
        lines.forEach((el) => labelCell.push(textParagraph(el.textContent.trim())));
      }
      const panelCell = [];
      if (pane) {
        const img = pane.querySelector("img");
        if (img) panelCell.push(img);
        const name = pane.querySelector("strong");
        if (name && name.textContent.trim()) panelCell.push(boldParagraph(name.textContent.trim()));
        const nameBlock = name ? name.closest("div") : null;
        const metaWrap = nameBlock ? nameBlock.parentElement : null;
        if (metaWrap) {
          [...metaWrap.children].filter((el) => el !== nameBlock && !el.querySelector("strong") && el.textContent.trim()).forEach((el) => panelCell.push(textParagraph(el.textContent.trim())));
        }
        pane.querySelectorAll("p").forEach((p) => panelCell.push(p));
      }
      if (!labelCell.length && !panelCell.length) continue;
      cells.push([labelCell, panelCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "div.navbar",
        "footer.footer.inverse-footer",
        "a.skip-link",
        "button.nav-mobile-menu-button"
      ]);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "noscript",
        "link",
        "iframe",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-")) el.removeAttribute(attr.name);
        });
      });
      [...element.attributes].forEach((attr) => {
        if (attr.name.startsWith("data-astro-")) element.removeAttribute(attr.name);
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var MARKER = "data-excat-section-id";
  function findSection(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section);
        if (!el) continue;
        if (i > 0 || section.style) {
          const hr = document.createElement("hr");
          if (section.style) hr.setAttribute(MARKER, section.id);
          el.before(hr);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        if (section.style) {
          const meta = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          const el = findSection(element, section);
          if (el) {
            el.after(meta);
          } else if (marker) {
            let next = marker.nextElementSibling;
            while (next && next.tagName !== "HR") next = next.nextElementSibling;
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

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "accordion-faq": parse,
    "cards-article": parse2,
    "cards-gallery": parse3,
    "columns-article-intro": parse4,
    "columns-hero-collage": parse5,
    "hero-overlay-card": parse6,
    "tabs-testimonial": parse7
  };
  var transformers = [transform, transform2];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
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
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
