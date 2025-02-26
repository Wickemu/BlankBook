// modals.js
"use strict";
import { TypeHelpers } from './typeHelpers.js';
import { insertPlaceholder } from './placeholders.js';

export   const VERB_TENSES = [
    { value: 'VB', text: 'Base (run)' },
    { value: 'VBP', text: 'Present (I walk)' },
    { value: 'VBZ', text: 'Present 3rd (he leaves)' },
    { value: 'VBD', text: 'Past (slept)' },
    { value: 'VBG', text: 'Gerund (crying)' },
    { value: 'VBN', text: 'Past Participle (eaten)' }
  ];

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
          // ...and use a small timeout to ensure it’s fully closed before showing the next modal.
          setTimeout(() => {
            showNounNumberSelection(updatedBaseInternal, updatedBaseDisplay);
          }, 100);
        });
      }
    });
  };

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
          if (window.isEditingPlaceholder && currentEditingVariable) {
            updateExistingPlaceholder(currentEditingVariable, finalInternal, finalDisplay);
            window.isEditingPlaceholder = false;
            currentEditingVariable = null;
            Swal.close();
          } else {
            await insertPlaceholder(finalInternal, finalDisplay, false);
            Swal.close();
          }
        });
      }
    });
  };

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
          if (window.isEditingPlaceholder && currentEditingVariable) {
            updateExistingPlaceholder(currentEditingVariable, finalInternal, finalDisplay);
            window.isEditingPlaceholder = false;
            currentEditingVariable = null;
            Swal.close();
          } else {
            await insertPlaceholder(finalInternal, finalDisplay, false);
            Swal.close();
          }
        });
      }
    });
  };

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

export const pickPronounGroup = (form) => {
    const groupKeys = Object.keys(pronounGroups);
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
          if (pronounGroups[grp] && pronounGroups[grp][form]) {
            insertPronounPlaceholderSimple(grp, form, pronounGroups[grp][form]);
          } else {
            choosePronounTempValue(form, grp).then(tempValue => {
              pronounGroups[grp] = pronounMapping[tempValue] || { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
              insertPronounPlaceholderSimple(grp, form, pronounGroups[grp][form]);
            });
          }
        });
        $(container).find('#createNewPronounGroupBtn').on('click', function () {
          pronounGroupCount++;
          const newGroup = `PronounGroup${pronounGroupCount}`;
          pronounGroups[newGroup] = {};
          Swal.close();
          choosePronounTempValue(form, newGroup).then(tempValue => {
            pronounGroups[newGroup] = pronounMapping[tempValue] || { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
            insertPronounPlaceholderSimple(newGroup, form, pronounGroups[newGroup][form]);
          });
        });
      }
    });
  };