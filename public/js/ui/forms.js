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

export const createInputRow = (variable) => {
    const inputRow = document.createElement("div");
    inputRow.className = "form-group mb-3";
    
    console.log(`Creating input row for variable: ${variable.id}`, variable);
    
    // Create standardized display label (remove any text within parentheses and trim)
    const displayLabel = variable.officialDisplay.replace(/\s*\([^)]*\)/g, '').trim();
    
    // Create the label element
    const label = document.createElement("label");
    label.htmlFor = variable.id;
    label.textContent = variable.officialDisplay;
    label.className = "form-label";
    
    // Create the input element
    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.id = variable.id;
    input.setAttribute("data-id", variable.id); 
    input.setAttribute("data-label", variable.officialDisplay);
    input.setAttribute("data-display", displayLabel);
    input.setAttribute("data-type", variable.internalType.split('|')[0]);
    input.setAttribute("placeholder", displayLabel);
    
    // If we have existing values, use them
    if (state.fillValues && state.fillValues[variable.id]) {
        input.value = state.fillValues[variable.id];
        console.log(`Pre-filling ${variable.id} with existing value: "${state.fillValues[variable.id]}"`);
    }
    
    // Add elements to the row
    inputRow.appendChild(label);
    inputRow.appendChild(input);
    
    return inputRow;
};

// Add the missing validateInputForm function to forms.js

export const validateInputForm = (formData) => {
  // If no formData is provided, this is being called from handleGenerateStory
  // to validate the entire form before generating the story
  if (!formData) {
    // Check if we have any filled values that need validation
    // Return valid for basic story generation
    return { valid: true };
  }
  
  // Input validation logic for placeholders/variables
  if (!formData.display || formData.display.trim() === '') {
    return { valid: false, message: 'Display name is required' };
  }
  
  if (!formData.internalType || formData.internalType.trim() === '') {
    return { valid: false, message: 'Internal type is required' };
  }
  
  return { valid: true };
};