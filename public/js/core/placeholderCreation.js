import state from './state.js';
import { StringUtils } from '../utils/StringUtils.js';
import { insertPlaceholderSpan, ensureEditorFocus } from './placeholderDOM.js';
import { updateVariablesList, updateVariablesFromEditor } from './placeholderManagement.js';

/**
 * Duplicates an existing placeholder at the current caret position
 * @param {Object} variable - The placeholder variable to duplicate
 */
export const duplicatePlaceholder = (variable) => {
    state.usageTracker[variable.id] = (state.usageTracker[variable.id] || 0) + 1;
    const newId = variable.id;
    const editor = document.getElementById("storyText");
    let rangeToUse = (state.lastRange && editor.contains(state.lastRange.commonAncestorContainer))
        ? state.lastRange
        : (() => {
            ensureEditorFocus();
            const sel = window.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
        })();
    const displayText = variable.displayOverride || variable.officialDisplay;
    insertPlaceholderSpan(newId, displayText, rangeToUse);
    state.lastRange = null;
};

/**
 * Inserts a new placeholder into the editor
 * @param {string} internalType - The internal type of the placeholder
 * @param {string} displayName - The display name of the placeholder
 * @param {boolean} isCustom - Whether this is a custom placeholder
 * @returns {Promise<void>}
 */
export const insertPlaceholder = async (internalType, displayName, isCustom) => {
    const sanitized = StringUtils.sanitizeString(internalType);
    const editor = document.getElementById("storyText");
    const spans = editor.querySelectorAll(".placeholder");
    let max = 0;
    spans.forEach(span => {
        const id = span.getAttribute("data-id");
        if (id.startsWith(sanitized)) {
            const match = id.match(/(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > max) max = num;
            }
        }
    });
    const newCount = max + 1;
    state.variableCounts[sanitized] = newCount;
    const id = sanitized + newCount;
    let rangeToUse = (state.lastRange && editor.contains(state.lastRange.commonAncestorContainer))
        ? state.lastRange
        : (() => {
            ensureEditorFocus();
            const sel = window.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
        })();
    let selectedText = "";
    if (rangeToUse && !rangeToUse.collapsed) {
        selectedText = rangeToUse.toString().trim();
    }
    let displayText = selectedText || displayName;
    if (!selectedText) {
        const result = await Swal.fire({
            title: 'Enter temporary word',
            input: 'text',
            inputLabel: 'Temporary fill word for this placeholder',
            inputValue: displayName,
            showCancelButton: true
        });
        
        // If user clicked Cancel, exit the function without creating a placeholder
        if (result.dismiss) {
            return;
        }
        
        if (result.value) displayText = result.value;
    }
    insertPlaceholderSpan(id, displayText, rangeToUse);
    if (!state.variables.some(v => v.id === id)) {
        state.variables.push({
            id,
            internalType,
            officialDisplay: displayName,
            display: displayName,
            isCustom: !!isCustom,
            order: state.insertionCounter++,
            displayOverride: displayText
        });
    }
    updateVariablesList();
    state.lastRange = null;
    
    // Close the placeholder modal if it's open
    $('#placeholderModal').modal('hide');
    
    if (internalType.startsWith("NN") && selectedText) {
        Swal.fire({
            title: 'Apply placeholder to all occurrences?',
            text: `Replace all instances of "${selectedText}" with this placeholder?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, apply',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                applyPlaceholderToAllOccurrences(selectedText, id, displayText);
            }
        });
    }
};

/**
 * Applies a placeholder to all occurrences of a text string in the story
 * @param {string} text - The text to replace
 * @param {string} id - The ID of the placeholder
 * @param {string} displayText - The display text of the placeholder
 */
export const applyPlaceholderToAllOccurrences = (text, id, displayText) => {
    const editor = document.getElementById("storyText");
    const textNodes = [];
    const getTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.includes(text)) {
                textNodes.push(node);
            }
        } else if (node.childNodes && node.childNodes.length > 0) {
            node.childNodes.forEach(child => {
                if (!child.classList || !child.classList.contains('placeholder')) {
                    getTextNodes(child);
                }
            });
        }
    };

    getTextNodes(editor);
    
    for (let i = textNodes.length - 1; i >= 0; i--) {
        const node = textNodes[i];
        const content = node.textContent;
        const parts = content.split(text);
        if (parts.length > 1) {
            const parent = node.parentNode;
            const fragment = document.createDocumentFragment();
            
            for (let j = 0; j < parts.length; j++) {
                if (parts[j]) {
                    fragment.appendChild(document.createTextNode(parts[j]));
                }
                if (j < parts.length - 1) {
                    const span = document.createElement("span");
                    span.className = "placeholder";
                    span.setAttribute("data-id", id);
                    span.setAttribute("title", id);
                    span.setAttribute("contenteditable", "false");
                    span.textContent = displayText;
                    fragment.appendChild(span);
                    fragment.appendChild(document.createTextNode(" "));
                }
            }
            
            parent.replaceChild(fragment, node);
        }
    }
    updateVariablesFromEditor();
};

/**
 * Adds a new custom placeholder type to the system with optional type information
 * @param {string} rawText - The raw text to use as the base
 * @param {string} [usage='generic'] - The usage type ('noun', 'verb', or 'generic')
 * @returns {string} The generated internal type
 */
export const addCustomPlaceholder = (rawText, usage = 'generic') => {
    let internal;
    
    if (usage === "noun") {
        internal = "NN_" + StringUtils.pascalCase(rawText);
    } else if (usage === "verb") {
        internal = "VB_" + StringUtils.pascalCase(rawText);
    } else {
        internal = StringUtils.pascalCase(rawText);
    }
    
    if (!state.customPlaceholders.some(p => p.type === internal)) {
        state.customPlaceholders.push({ type: internal });
    }
    
    return internal;
};

/**
 * Creates and inserts a custom placeholder into the editor
 * @param {string} rawText - The raw text to use as the base
 */
export const insertPlaceholderFromCustom = (rawText) => {
    const internal = addCustomPlaceholder(rawText);
    const display = StringUtils.naturalDisplay(internal);
    insertPlaceholder(internal, display, true);
}; 