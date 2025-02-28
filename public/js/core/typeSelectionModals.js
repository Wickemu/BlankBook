import state from './state.js';
import { TypeHelpers } from '../utils/typeHelpers.js';
import { VERB_TENSES } from './placeholderDefinitions.js';
import { insertPlaceholder } from './placeholderCreation.js';
import { updateExistingPlaceholder } from './placeholderManagement.js';

/**
 * Gets the currently selected text from the editor
 * @returns {string} The selected text or an empty string
 */
const getSelectedText = () => {
    // If we have a saved range, use that to get the selected text
    if (state.lastRange && !state.lastRange.collapsed) {
        return state.lastRange.toString().trim();
    }
    // Otherwise try to get the current selection
    const sel = window.getSelection();
    if (sel && sel.rangeCount && !sel.isCollapsed) {
        return sel.toString().trim();
    }
    return "";
};

/**
 * Shows a modal for selecting person type
 * @param {string} baseInternal - The base internal type
 * @param {string} baseDisplay - The base display name
 */
export const showPersonTypeSelection = (baseInternal, baseDisplay) => {
    // Store selected text before modal interactions cause selection to be lost
    const selectedText = getSelectedText();
    
    let html = `<div class='list-group'>
  <button class='list-group-item list-group-item-action person-type-btn' data-type='common'>
    Common (e.g., doctor)
  </button>
  <button class='list-group-item list-group-item-action person-type-btn' data-type='proper'>
    Proper (e.g., Donald Trump)
  </button>
</div>`;
    Swal.fire({
        title: 'Select Person Type',
        html,
        showCancelButton: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            $(container).find('.person-type-btn').on('click', function () {
                const selectedType = $(this).data('type'); // "common" or "proper"
                let updatedBaseInternal, updatedBaseDisplay;
                if (selectedType === "proper") {
                    updatedBaseInternal = "NNP_Person";
                    updatedBaseDisplay = "Proper " + baseDisplay;
                } else {
                    updatedBaseInternal = "NN_Person";
                    updatedBaseDisplay = "Common " + baseDisplay;
                }
                // Close the current modal...
                Swal.close();
                // ...and use a small timeout to ensure it's fully closed before showing the next modal.
                setTimeout(() => {
                    // Pass along the selected text to the next modal
                    showNounNumberSelection(updatedBaseInternal, updatedBaseDisplay, selectedText);
                }, 100);
            });
        }
    });
};

/**
 * Shows a modal for selecting noun number
 * @param {string} baseInternal - The base internal type
 * @param {string} baseDisplay - The base display name
 * @param {string} [selectedText=''] - The selected text from the editor
 */
export const showNounNumberSelection = (baseInternal, baseDisplay, selectedText = '') => {
    // If selectedText wasn't passed, try to get it now
    if (!selectedText) {
        selectedText = getSelectedText();
    }
    
    let html = `<div class='list-group'>`;
    ['Singular', 'Plural'].forEach(f => {
        html += `<button class='list-group-item list-group-item-action noun-number-btn' data-form='${f}'>${f}</button>`;
    });
    html += `</div>`;
    Swal.fire({
        title: 'Select Number',
        html,
        showCancelButton: true,
        showConfirmButton: false,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            $(container).find('.noun-number-btn').on('click', async function () {
                const selected = $(this).data('form');
                const finalInternal = TypeHelpers.getNounFinalType(baseInternal, selected);
                const finalDisplay = `${baseDisplay} (${selected})`;
                if (state.isEditingPlaceholder && state.currentEditingVariable) {
                    updateExistingPlaceholder(state.currentEditingVariable, finalInternal, finalDisplay);
                    state.isEditingPlaceholder = false;
                    state.currentEditingVariable = null;
                    Swal.close();
                } else {
                    // Preserve the selected text by saving it to state.lastSelectedText
                    if (selectedText) {
                        state.lastSelectedText = selectedText;
                    }
                    await insertPlaceholder(finalInternal, finalDisplay, false);
                    // Clear the temporary state to avoid affecting future placeholder additions
                    state.lastSelectedText = '';
                    Swal.close();
                }
            });
        }
    });
};

/**
 * Shows a modal for selecting verb tense
 * @param {string} baseInternal - The base internal type
 * @param {string} baseDisplay - The base display name
 * @param {string} [selectedText=''] - The selected text from the editor
 */
export const showVerbTenseSelection = (baseInternal, baseDisplay, selectedText = '') => {
    // If selectedText wasn't passed, try to get it now
    if (!selectedText) {
        selectedText = getSelectedText();
    }
    
    let html = `<div class='list-group'>`;
    VERB_TENSES.forEach(t => {
        html += `<button class='list-group-item list-group-item-action verb-tense-btn' data-tense='${t.value}' data-text='${t.text}'>${t.text}</button>`;
    });
    html += `</div>`;
    Swal.fire({
        title: 'Select Verb Tense',
        html,
        showCancelButton: true,
        showConfirmButton: false,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            $(container).find('.verb-tense-btn').on('click', async function () {
                const selectedTense = $(this).data('tense');
                const tenseText = $(this).data('text');
                const finalInternal = TypeHelpers.computeFinalVerbType(baseInternal, selectedTense);
                const finalDisplay = `${baseDisplay} (${tenseText})`;
                if (state.isEditingPlaceholder && state.currentEditingVariable) {
                    updateExistingPlaceholder(state.currentEditingVariable, finalInternal, finalDisplay);
                    state.isEditingPlaceholder = false;
                    state.currentEditingVariable = null;
                    Swal.close();
                } else {
                    // Preserve the selected text by saving it to state.lastSelectedText
                    if (selectedText) {
                        state.lastSelectedText = selectedText;
                    }
                    await insertPlaceholder(finalInternal, finalDisplay, false);
                    // Clear the temporary state to avoid affecting future placeholder additions
                    state.lastSelectedText = '';
                    Swal.close();
                }
            });
        }
    });
}; 