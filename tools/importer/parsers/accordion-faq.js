/* eslint-disable */
/* global WebImporter */
/**
 * Parser: accordion-faq
 * Source: https://www.wknd-trendsetters.site/
 * Root: .faq-list
 * Authored structure: one row per item, two cells: (1) question, (2) answer.
 * The decorative plus-icon <img> inside <summary> is dropped.
 */
export default function parse(element, { document }) {
  const cells = [];
  const items = [...element.querySelectorAll(':scope > details, .faq-item')]
    .filter((el, i, arr) => arr.indexOf(el) === i);

  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const label = summary ? (summary.querySelector('span') || summary) : null;
    const questionText = label ? label.textContent.trim() : '';
    if (!questionText) return;
    const question = document.createElement('p');
    question.textContent = questionText;

    const answerEl = item.querySelector('.faq-answer');
    let answer = [];
    if (answerEl) {
      answer = [...answerEl.children];
      if (!answer.length && answerEl.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = answerEl.textContent.trim();
        answer = [p];
      }
    }

    cells.push([question, answer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
