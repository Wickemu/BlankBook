import state from './state.js';

/**
 * Inserts a DOM node at the current caret position
 * @param {Node} node - The DOM node to insert
 * @param {Range} range - Optional range to use instead of current selection
 */
export const insertNodeAtCaret = (node, range) => {
    if (range) {
        range.deleteContents();
        range.insertNode(node);
        const newRange = document.createRange();
        newRange.setStartAfter(node);
        newRange.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(newRange);
    } else {
        const sel = window.getSelection();
        if (sel.rangeCount) {
            const r = sel.getRangeAt(0);
            r.deleteContents();
            r.insertNode(node);
            r.setStartAfter(node);
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
        }
    }
};

/**
 * Ensures the editor has focus and a valid selection range
 */
export const ensureEditorFocus = () => {
    const editor = document.getElementById("storyText");
    const sel = window.getSelection();
    if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
        editor.focus();
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
};

/**
 * Creates and inserts a placeholder span element at the current caret position
 * @param {string} placeholderID - The ID of the placeholder
 * @param {string} displayText - The text to display in the placeholder
 * @param {Range} range - Optional range to use instead of current selection
 */
export const insertPlaceholderSpan = (placeholderID, displayText, range) => {
    const span = document.createElement("span");
    span.className = "placeholder";
    span.setAttribute("data-id", placeholderID);
    span.setAttribute("title", placeholderID);
    span.setAttribute("contenteditable", "false");
    span.textContent = displayText;
    insertNodeAtCaret(span, range);

    // Append extra space if needed
    if (!displayText.endsWith(" ")) {
        if (span.parentNode) {
            let nextNode = span.nextSibling;
            if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                if (!/^\s/.test(nextNode.textContent)) {
                    span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
                }
            } else if (nextNode) {
                span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
            } else {
                span.parentNode.appendChild(document.createTextNode(" "));
            }
        }
    }
};

/**
 * Converts the editor content to text format with placeholders in {id} format
 * @returns {string} The story text with placeholders in {id} format
 */
export const generateLegacyText = () => {
    const editor = document.getElementById("storyText");
    const traverse = (node) => {
        let result = "";
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                result += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName.toLowerCase() === "br") {
                    result += "\n";
                } else if (child.classList.contains("placeholder")) {
                    result += "{" + child.getAttribute("data-id") + "}";
                } else {
                    result += traverse(child);
                    const tag = child.tagName.toLowerCase();
                    if (tag === "div" || tag === "p") result += "\n";
                }
            }
        });
        return result;
    };
    return traverse(editor);
}; 