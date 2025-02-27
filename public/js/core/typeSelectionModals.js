import state from './state.js';
import { TypeHelpers } from '../utils/typeHelpers.js';
import { VERB_TENSES } from './placeholderDefinitions.js';
import { insertPlaceholder } from './placeholderCreation.js';
import { updateExistingPlaceholder } from './placeholderManagement.js';

/**
 * Shows a modal for selecting person type
 * @param {string} baseInternal - The base internal type
 * @param {string} baseDisplay - The base display name
 */
export const showPersonTypeSelection = (baseInternal, baseDisplay) => {
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
                    showNounNumberSelection(updatedBaseInternal, updatedBaseDisplay);
                }, 100);
            });
        }
    });
};

/**
 * Shows a modal for selecting noun number
 * @param {string} baseInternal - The base internal type
 * @param {string} baseDisplay - The base display name
 */
export const showNounNumberSelection = (baseInternal, baseDisplay) => {
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
                    await insertPlaceholder(finalInternal, finalDisplay, false);
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
 */
export const showVerbTenseSelection = (baseInternal, baseDisplay) => {
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
                    await insertPlaceholder(finalInternal, finalDisplay, false);
                    Swal.close();
                }
            });
        }
    });
}; 