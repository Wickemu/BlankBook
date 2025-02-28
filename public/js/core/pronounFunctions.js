import state, { pronounMapping } from './state.js';
import { ensureEditorFocus } from './placeholderDOM.js';
import { insertPlaceholderSpan } from './placeholderDOM.js';
import { updateVariablesList } from './placeholderManagement.js';
import { StringUtils } from '../utils/StringUtils.js';

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
 * Inserts a pronoun placeholder with a specified form
 * @param {string} groupId - The pronoun group ID
 * @param {string} form - The pronoun form (subject, object, etc.)
 * @param {string} tempValue - The temporary display value
 */
export const insertPronounPlaceholderSimple = (groupId, form, tempValue) => {
    const editor = document.getElementById("storyText");
    ensureEditorFocus();
    const sel = window.getSelection();
    const range = (state.lastRange && editor.contains(state.lastRange.commonAncestorContainer))
        ? state.lastRange
        : (sel.rangeCount ? sel.getRangeAt(0) : null);
    
    // Check if we already have a selected text saved
    const selectedText = state.lastSelectedText || (range && !range.collapsed ? range.toString().trim() : "");
    
    const groupNum = groupId.replace('PronounGroup', '');
    const formAbbrevMap = { subject: 'SUB', object: 'OBJ', possAdj: 'PSA', possPron: 'PSP', reflexive: 'REF' };
    const abbrev = formAbbrevMap[form] || form.toUpperCase();
    const placeholderId = `PRP${groupNum}${abbrev}`;
    if (!state.variables.some(v => v.id === placeholderId)) {
        const displayType = `Person (${form})`;
        state.variables.push({
            id: placeholderId,
            internalType: `PRONOUN|${groupId}|${form}`,
            officialDisplay: displayType,
            display: displayType,
            isCustom: false,
            order: state.insertionCounter++,
            displayOverride: tempValue
        });
        updateVariablesList();
    }
    insertPlaceholderSpan(placeholderId, tempValue, range);
    
    // After inserting, check if there are multiple instances of the selected text
    if (selectedText) {
        const editor = document.getElementById("storyText");
        const editorContent = editor.textContent;
        const occurrences = (editorContent.match(new RegExp(`\\b${StringUtils.escapeRegExp(selectedText)}\\b`, 'g')) || []).length;
        
        if (occurrences > 1) {
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
                    // We need to import this function since it's normally in placeholderCreation.js
                    import('./placeholderCreation.js').then(module => {
                        module.applyPlaceholderToAllOccurrences(selectedText, placeholderId, tempValue);
                    });
                }
            });
        }
    }
    
    state.lastSelectedText = ''; // Clear the saved text
    state.lastRange = null;
};

/**
 * Shows a modal to pick a pronoun form and group
 */
export const pickPronounFormAndGroup = () => {
    // Store the selected text before modal interactions cause selection to be lost
    state.lastSelectedText = getSelectedText();
    
    const forms = [
        { value: 'subject', text: 'Subject (he, she, they)' },
        { value: 'object', text: 'Object (him, her, them)' },
        { value: 'possAdj', text: 'Possessive Adj. (his, her, their)' },
        { value: 'possPron', text: 'Possessive Pron. (his, hers)' },
        { value: 'reflexive', text: 'Reflexive (himself, herself)' }
    ];
    let html = `<div class='list-group mb-2'>`;
    forms.forEach(f => {
        html += `<button class='list-group-item list-group-item-action pronoun-form-btn' data-form='${f.value}'>${f.text}</button>`;
    });
    html += `</div>`;
    Swal.fire({
        title: 'Pick a Pronoun Form',
        html,
        showCancelButton: true,
        showConfirmButton: false,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            $(container).find('.pronoun-form-btn').on('click', function () {
                const chosenForm = $(this).data('form');
                Swal.close();
                pickPronounGroup(chosenForm);
            });
        }
    });
};

/**
 * Shows a modal to pick a pronoun group
 * @param {string} form - The pronoun form
 */
export const pickPronounGroup = (form) => {
    const groupKeys = Object.keys(state.pronounGroups);
    let html = '';
    if (groupKeys.length > 0) {
        html += `<h5>Existing Pronoun Groups</h5><div class='list-group mb-2'>`;
        groupKeys.forEach(g => {
            html += `<button class='list-group-item list-group-item-action pronoun-group-btn' data-group='${g}'>${g}</button>`;
        });
        html += `</div><hr>`;
    }
    html += `<button class='btn btn-sm btn-outline-primary' id='createNewPronounGroupBtn'>Create New Group</button>`;
    Swal.fire({
        title: 'Pick a Pronoun Group',
        html,
        showCancelButton: true,
        showConfirmButton: false,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            $(container).find('.pronoun-group-btn').on('click', function () {
                const grp = $(this).data('group');
                Swal.close();
                if (state.pronounGroups[grp] && state.pronounGroups[grp][form]) {
                    insertPronounPlaceholderSimple(grp, form, state.pronounGroups[grp][form]);
                } else {
                    choosePronounTempValue(form, grp).then(tempValue => {
                        state.pronounGroups[grp] = pronounMapping[tempValue] || 
                            { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
                        insertPronounPlaceholderSimple(grp, form, state.pronounGroups[grp][form]);
                    });
                }
            });
            $(container).find('#createNewPronounGroupBtn').on('click', function () {
                state.pronounGroupCount++;
                const newGroup = `PronounGroup${state.pronounGroupCount}`;
                state.pronounGroups[newGroup] = {};
                Swal.close();
                choosePronounTempValue(form, newGroup).then(tempValue => {
                    state.pronounGroups[newGroup] = pronounMapping[tempValue] || 
                        { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
                    insertPronounPlaceholderSimple(newGroup, form, state.pronounGroups[newGroup][form]);
                });
            });
        }
    });
};

/**
 * Prompts the user to choose a temporary pronoun value
 * @param {string} form - The pronoun form
 * @param {string} groupId - The pronoun group ID
 * @returns {Promise<string>} A promise that resolves with the chosen pronoun
 */
export const choosePronounTempValue = (form, groupId) => {
    return Swal.fire({
        title: 'Select Temporary Pronoun',
        input: 'radio',
        inputOptions: {
            'He/Him': 'He/Him',
            'She/Her': 'She/Her',
            'They/Them': 'They/Them',
            'Custom': 'Custom'
        },
        inputValidator: (value) => {
            if (!value) return 'You need to choose an option!';
        }
    }).then(result => {
        if (result.value === 'Custom') {
            return Swal.fire({
                title: 'Enter custom temporary pronoun',
                input: 'text',
                inputLabel: 'Temporary pronoun',
                inputValue: form,
                showCancelButton: true
            }).then(res => res.value || form);
        } else {
            return result.value;
        }
    });
}; 