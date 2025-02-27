import state, { pronounMapping } from './state.js';
import { ensureEditorFocus } from './placeholderDOM.js';
import { insertPlaceholderSpan } from './placeholderDOM.js';
import { updateVariablesList } from './placeholderManagement.js';

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
    state.lastRange = null;
};

/**
 * Shows a modal to pick a pronoun form and group
 */
export const pickPronounFormAndGroup = () => {
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