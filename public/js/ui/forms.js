// public/js/ui/forms.js
import state from '../core/state.js';
import { TypeHelpers } from '../utils/typeHelpers.js';

// ====================================================
// BUILD THE FILL-IN-THE-BLANK FORM
// ====================================================
export const buildFillForm = () => {
    const form = $('#inputForm').empty();
    appendPronounGroupsToForm(form);
    appendNonPronounVariablesToForm(form);
};

const appendPronounGroupsToForm = (form) => {
    const groupSet = getPronounGroups();
    const sortedGroups = Array.from(groupSet).sort((a, b) => a.localeCompare(b));
    if (sortedGroups.length > 0) {
        form.append(`<h4>Pronouns</h4>`);
        sortedGroups.forEach(g => {
            const block = createPronounGroupBlock(g);
            form.append(block);
        });
        form.on('change', "input[type='radio']", handlePronounChoiceChange);
    }
};

const getPronounGroups = () => {
    const groupSet = new Set();
    for (const v of state.variables) {
        if (v.internalType.startsWith('PRONOUN|')) {
            const parts = v.internalType.split('|');
            groupSet.add(parts[1]);
        }
    }
    return groupSet;
};

const createPronounGroupBlock = (groupName) => {
    const block = $(`
      <div class='form-group'>
        <label id='${groupName}-label' title="Hover to see internal ID">
          ${groupName} - Person (select pronoun)
          <i class="fas fa-info-circle fill-info-icon" data-type="${groupName}" style="font-size:0.8em; margin-left:5px;"></i>
        </label>
      </div>
    `);
    const radios = `
      <div class='form-check'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='HeHim'>
        <label class='form-check-label'>He/Him</label>
      </div>
      <div class='form-check'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='SheHer'>
        <label class='form-check-label'>She/Her</label>
      </div>
      <div class='form-check'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='TheyThem'>
        <label class='form-check-label'>They/Them</label>
      </div>
      <div class='form-check mb-2'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='Custom'>
        <label class='form-check-label'>Custom</label>
      </div>
      <input type='text' class='form-control form-control-sm d-none' id='${groupName}-custom'
        placeholder='comma-separated: subject, object, possAdj, possPron, reflexive'>
    `;
    block.append(radios);
    return block;
};

const handlePronounChoiceChange = function () {
    const groupName = $(this).attr('name').replace('-choice', '');
    if ($(this).val() === 'Custom') {
        $(`#${groupName}-custom`).removeClass('d-none');
    } else {
        $(`#${groupName}-custom`).addClass('d-none');
    }
};

const appendNonPronounVariablesToForm = (form) => {
    let nonPronounVars = state.variables.filter(v => !v.internalType.startsWith('PRONOUN|'));
    if (state.fillOrder === 'alphabetical') {
        nonPronounVars.sort((a, b) => a.officialDisplay.localeCompare(b.officialDisplay));
    } else if (state.fillOrder === 'random') {
        nonPronounVars.sort(() => Math.random() - 0.5);
    }
    nonPronounVars.forEach(variable => {
        const groupRow = createInputRow(variable);
        form.append(groupRow);
    });
};

const createInputRow = (variable) => {
    const groupRow = $(`
      <div class="form-group input-row">
        <div class="row">
          <div class="col-sm-4">
            <label class="input-label" title="Internal ID: ${variable.id}">
              ${variable.officialDisplay}
            </label>
          </div>
          <div class="col-sm-8">
            <input type="text"
              class="form-control form-control-sm compact-input"
              name="${variable.id}"
              data-label="${variable.officialDisplay}">
          </div>
        </div>
      </div>
    `);
    if (state.fillValues[variable.id]) {
        groupRow.find('input').val(state.fillValues[variable.id]);
    }
    return groupRow;
};

// Add the missing validateInputForm function to forms.js

export const validateInputForm = (formData) => {
  // Input validation logic
  if (!formData.display || formData.display.trim() === '') {
    return { valid: false, message: 'Display name is required' };
  }
  
  if (!formData.internalType || formData.internalType.trim() === '') {
    return { valid: false, message: 'Internal type is required' };
  }
  
  return { valid: true };
};