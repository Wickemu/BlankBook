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
    
    // Get selected text - either from lastSelectedText (set by modal chain) or from range
    let selectedText = "";
    if (state.lastSelectedText) {
        // Use the preserved selected text from modal chains
        selectedText = state.lastSelectedText;
        console.log("Using saved selected text:", selectedText);
    } else if (rangeToUse && !rangeToUse.collapsed) {
        selectedText = rangeToUse.toString().trim();
        console.log("Using range selected text:", selectedText);
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
    
    // Check if there's selected text that might exist elsewhere in the document
    if (selectedText) {
        // Count occurrences of the selected text in the editor
        const editorContent = editor.textContent;
        const occurrences = (editorContent.match(new RegExp(`\\b${StringUtils.escapeRegExp(selectedText)}\\b`, 'g')) || []).length;
        
        console.log(`Found ${occurrences} occurrences of "${selectedText}" in the document`);
        
        // Only offer to replace all if there's more than one occurrence
        if (occurrences > 1) {
            console.log("Showing replace all confirmation dialog");
            
            // Delay showing the replace all dialog to ensure the modal is fully hidden
            setTimeout(() => {
                Swal.fire({
                    title: 'Multiple occurrences found',
                    html: `Found <strong>${occurrences}</strong> instances of "<strong>${selectedText}</strong>" in your story.<br>Would you like to replace all instances with this placeholder?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, replace all',
                    cancelButtonText: 'No, just this one',
                    footer: '<small>This is useful for replacing character names or recurring objects with placeholders</small>'
                }).then(result => {
                    if (result.isConfirmed) {
                        console.log("User confirmed replace all");
                        applyPlaceholderToAllOccurrences(selectedText, id, displayText);
                    } else {
                        console.log("User chose not to replace all");
                    }
                    
                    // Clear the saved selected text after the dialog is handled
                    console.log("Clearing lastSelectedText after replace all dialog");
                    state.lastSelectedText = '';
                });
            }, 300); // 300ms delay to ensure modal transition completes
        } else {
            // Clear the saved selected text if no replace dialog shown
            setTimeout(() => {
                console.log("Clearing lastSelectedText after placeholder insertion");
                state.lastSelectedText = '';
            }, 200);
        }
    } else {
        // Clear the saved selected text if no selected text
        setTimeout(() => {
            console.log("Clearing lastSelectedText after placeholder insertion");
            state.lastSelectedText = '';
        }, 200);
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
    
    // Track how many replacements were made
    let replacementsCount = 0;
    
    for (let i = textNodes.length - 1; i >= 0; i--) {
        const node = textNodes[i];
        const content = node.textContent;
        
        // Use word boundary regex to match exact words (not substrings of other words)
        const regex = new RegExp(`\\b${StringUtils.escapeRegExp(text)}\\b`, 'g');
        const parts = content.split(regex);
        
        if (parts.length > 1) {
            const parent = node.parentNode;
            const fragment = document.createDocumentFragment();
            
            let lastIndex = 0;
            let match;
            const testRegex = new RegExp(`\\b${StringUtils.escapeRegExp(text)}\\b`, 'g');
            
            while ((match = testRegex.exec(content)) !== null) {
                // Add text before match
                const beforeText = content.substring(lastIndex, match.index);
                if (beforeText) {
                    fragment.appendChild(document.createTextNode(beforeText));
                }
                
                // Add placeholder
                const span = document.createElement("span");
                span.className = "placeholder";
                span.setAttribute("data-id", id);
                span.setAttribute("title", id);
                span.setAttribute("contenteditable", "false");
                span.textContent = displayText;
                fragment.appendChild(span);
                fragment.appendChild(document.createTextNode(" "));
                
                // Update last index position
                lastIndex = match.index + text.length;
                replacementsCount++;
            }
            
            // Add any remaining text
            const afterText = content.substring(lastIndex);
            if (afterText) {
                fragment.appendChild(document.createTextNode(afterText));
            }
            
            parent.replaceChild(fragment, node);
        }
    }
    
    updateVariablesFromEditor();
    
    // Notify the user about the number of replacements
    if (replacementsCount > 0) {
        Swal.fire({
            title: 'Replacements Complete',
            text: `Replaced ${replacementsCount} instances of "${text}" with the placeholder`,
            icon: 'success',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }
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