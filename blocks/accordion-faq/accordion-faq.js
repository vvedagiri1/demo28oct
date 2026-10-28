/**
 * accordion-faq: one row per item. Cell 1 question, cell 2 answer.
 * Each row becomes a native <details>/<summary> disclosure.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [questionCell, ...rest] = [...row.children];
    if (!questionCell || !questionCell.textContent.trim()) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-question';
    const label = document.createElement('span');
    label.className = 'accordion-faq-question-text';
    // flatten a single wrapping paragraph/heading into the summary label
    const only = questionCell.children.length === 1 ? questionCell.firstElementChild : null;
    label.append(...(only && /^(P|H[1-6])$/.test(only.tagName) ? only.childNodes : questionCell.childNodes));
    summary.append(label);

    const answer = document.createElement('div');
    answer.className = 'accordion-faq-answer';
    rest.forEach((cell) => answer.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, answer);
    row.replaceWith(details);
  });
}
