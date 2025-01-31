"use strict";

// ===========================
// GLOBAL VARIABLES
// ===========================
let variables = [];
let variableCounts = {};
let storyText = '';
let customPlaceholders = [];
let fillValues = {};

let pronounGroups = {};
let pronounGroupCount = 0;

// NEW: Key for localStorage
const STORAGE_KEY = 'myStoryState';

// ===========================
// DEBOUNCE HELPER
// ===========================
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// ===========================
// SUPPORTING DATA
// ===========================
function formatLabel(type) {
  // Handle pronoun placeholders first
  if (type.startsWith('PRONOUN|')) {
    const [, group, form] = type.split('|');
    const formMap = {
      subject: 'Subject',
      object: 'Object',
      possAdj: 'Possessive Adjective',
      possPron: 'Possessive Pronoun',
      reflexive: 'Reflexive'
    };
    return `Pronoun (${formMap[form]} - Group ${group.replace('PronounGroup', '')})`;
  }

  // Remove any trailing numbers
  let cleaned = type.replace(/\d+$/, '');
  // Split camelCase and add spaces
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Handle parentheses formatting
  cleaned = cleaned.replace(/([a-z])(\()/gi, '$1 $2');
  // Special cases
  cleaned = cleaned
    .replace(/(Noun|Noun\b.*?)\s*(Singular)$/i, '$1 (Singular)')
    .replace(/(Noun|Noun\b.*?)\s*(Plural)$/i, '$1 (Plural)')
    .replace('Present Participle', '(Present Participle)')
    .replace('Past', '(Past Tense)')
    .replace('3rd Person Singular', '(3rd Person Singular)');

  return cleaned.replace(/(\w+)/g, match => {
    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
  });
}

// Predefined pronoun sets
const PREDEFINED_SETS = {
  "HeHim": { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
  "SheHer": { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
  "TheyThem": { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
};

// Verb tenses
const VERB_TENSES = [
  { value: 'Present (Base Form)', text: 'Present (Base Form e.g "I run")' },
  { value: 'Present (3rd Person Singular)', text: 'Present (3rd Person Singular e.g "it runs")' },
  { value: 'Past', text: 'Past (e.g. "it ran")' },
  { value: 'Present Participle', text: 'Present Participle (e.g. "It is running")' }
];

// Nouns that require singular/plural selection
const NOUNS_REQUIRING_NUMBER = [
  'Common Noun', 'Proper Noun', 'Abstract Noun', 'Concrete Noun',
  'Person', 'Place', 'Animal', 'Body Part', 'Clothing', 'Drink',
  'Emotion', 'Food', 'Vehicle',
];

// Placeholders grouped into categories
const allPlaceholders = {
  'Nouns': [
    { type: 'Common Noun', tooltip: 'A generic noun (book, table)', icon: 'fas fa-book', isPrimary: true },
    { type: 'Proper Noun', tooltip: 'A specific name (John, Paris)', icon: 'fas fa-user', isPrimary: false },
    { type: 'Concrete Noun', tooltip: 'A tangible object (car, phone)', icon: 'fas fa-cube', isPrimary: false },
    { type: 'Person', tooltip: 'A person or role (teacher, father)', icon: 'fas fa-user-friends', isPrimary: true },
    { type: 'Place', tooltip: 'A location (home, city)', icon: 'fas fa-map-marker-alt', isPrimary: true },
    { type: 'Pronoun', tooltip: 'A pronoun placeholder (he, they)', icon: 'fas fa-user-circle', isPrimary: true },
    { type: 'Abstract Noun', tooltip: 'An intangible concept (freedom, happiness)', icon: 'fas fa-cloud', isPrimary: true },
    { type: 'Animal', tooltip: 'An animal (dog, lion)', icon: 'fas fa-dog', isPrimary: false },
    { type: 'Body Part', tooltip: 'A part of the body (arm, head)', icon: 'fas fa-hand-paper', isPrimary: false },
    { type: 'Clothing', tooltip: 'A clothing item (shirt, coat)', icon: 'fas fa-tshirt', isPrimary: false },
    { type: 'Drink', tooltip: 'A beverage (coffee, juice)', icon: 'fas fa-cocktail', isPrimary: false },
    { type: 'Emotion', tooltip: 'A feeling (joy, anger)', icon: 'fas fa-heart', isPrimary: false },
    { type: 'Food', tooltip: 'An edible item (pizza, apple)', icon: 'fas fa-utensils', isPrimary: false },
    { type: 'Vehicle', tooltip: 'A type of transport (car, train)', icon: 'fas fa-car', isPrimary: false },
  ],
  'Verbs': [
    { type: 'Intransitive Verb', tooltip: 'Does not take a direct object (sleep, arrive)', icon: 'fas fa-bed', isPrimary: true },
    { type: 'Transitive Verb', tooltip: 'Takes a direct object (eat, read)', icon: 'fas fa-hammer', isPrimary: true },
    { type: 'Action Verb', tooltip: 'An action-based verb (run, jump)', icon: 'fas fa-bolt', isPrimary: false },
    { type: 'Stative Verb', tooltip: 'Describes a state (believe, like)', icon: 'fas fa-brain', isPrimary: false },
    { type: 'Communication Verb', tooltip: 'A speaking verb (say, shout)', icon: 'fas fa-comment-dots', isPrimary: false },
    { type: 'Linking Verb', tooltip: 'A linking verb (is, become)', icon: 'fas fa-link', isPrimary: false },
    { type: 'Modal Verb', tooltip: 'Expresses modality (can, must)', icon: 'fas fa-key', isPrimary: false },
    { type: 'Movement Verb', tooltip: 'A movement-based verb (walk, swim)', icon: 'fas fa-walking', isPrimary: false },
  ],
  'Adjectives and Adverbs': [
    { type: 'Adjective', tooltip: 'Describes a noun (big, happy)', icon: 'fas fa-ad', isPrimary: true },
    { type: 'Adverb', tooltip: 'Modifies a verb (quickly, softly)', icon: 'fas fa-feather-alt', isPrimary: true },
    { type: 'Comparative Adjective', tooltip: 'Compares two items (bigger, faster)', icon: 'fas fa-level-up-alt', isPrimary: false },
    { type: 'Superlative Adjective', tooltip: 'Highest degree (biggest, fastest)', icon: 'fas fa-medal', isPrimary: false },
    { type: 'Color Adjective', tooltip: 'Describes a color (red, blue)', icon: 'fas fa-palette', isPrimary: false },
    { type: 'Emotion Adjective', tooltip: 'Describes an emotion (joyful, angry)', icon: 'fas fa-smile', isPrimary: false },
    { type: 'Size Adjective', tooltip: 'Describes size (large, tiny)', icon: 'fas fa-arrows-alt', isPrimary: false },
    { type: 'Ordinal Number', tooltip: 'Indicates position or order (first, second, 34th)', icon: 'fas fa-sort-numeric-down', isPrimary: false },
  ],
  'Other Placeholders': [
    { type: 'Number', tooltip: 'Any numerical value (five, 10)', icon: 'fas fa-hashtag', isPrimary: true },
    { type: 'Exclamation', tooltip: 'A short outburst (Stop!, Wow!)', icon: 'fas fa-bullhorn', isPrimary: true },
    { type: 'Onomatopoeia', tooltip: 'A sound word (buzz, hiss)', icon: 'fas fa-volume-up', isPrimary: false },
    { type: 'Preposition', tooltip: 'Shows a relation (on, in)', icon: 'fas fa-link', isPrimary: false },
    { type: 'Interjection', tooltip: 'A short utterance (aha, ugh)', icon: 'fas fa-exclamation', isPrimary: false },
  ],
};

// ===========================
// LOCAL STORAGE HELPERS
// ===========================
function storeStateInLocalStorage() {
  const appState = {
    storyTitle: $('#storyTitle').val(),
    storyAuthor: $('#storyAuthor').val(),
    storyText: $('#storyText').val(),
    variables,
    fillValues,
    pronounGroups,
    variableCounts,
    pronounGroupCount,
    customPlaceholders
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}
const debouncedStoreState = debounce(storeStateInLocalStorage, 300);

function loadStateFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const appState = JSON.parse(saved);
    $('#storyTitle').val(appState.storyTitle || '');
    $('#storyAuthor').val(appState.storyAuthor || '');
    $('#storyText').val(appState.storyText || '');
    variables = appState.variables || [];
    fillValues = appState.fillValues || {};
    pronounGroups = appState.pronounGroups || {};
    variableCounts = appState.variableCounts || {};
    pronounGroupCount = appState.pronounGroupCount || 0;
    customPlaceholders = appState.customPlaceholders || [];
    updateVariablesFromText();
    updateVariablesList();
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  } catch (e) {
    console.error('Failed to parse saved story state:', e);
  }
}

// ===========================
// DOCUMENT READY
// ===========================
$(document).ready(function() {
  // Initialize placeholder accordions
  updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');

  // Initialize autocomplete for the story text area
  $('#storyText').autocomplete({
    source: function(request, response) {
      const term = request.term;
      const match = term.match(/\{([^\}]+)$/);
      if (match) {
        const searchTerm = match[1].toLowerCase();
        const suggestions = variables
          .map(v => `{${v.id}}`)
          .filter(placeholder => placeholder.toLowerCase().includes(searchTerm));
        response(suggestions);
      } else {
        response([]);
      }
    },
    focus: function(event, ui) {
      return false;
    },
    select: function(event, ui) {
      const textarea = $('#storyText')[0];
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const text = textarea.value;
      const match = text.substring(0, startPos).match(/\{([^\}]+)$/);
      if (match) {
        const prefix = text.substring(0, startPos - match[1].length);
        const suffix = text.substring(endPos);
        textarea.value = prefix + ui.item.value + suffix;
        textarea.selectionStart = textarea.selectionEnd = prefix.length + ui.item.value.length;
      }
      return false;
    },
    minLength: 1
  });

  loadStateFromLocalStorage();

  $('#storyTitle, #storyAuthor, #storyText').on('input', debouncedStoreState);
});

// ===========================
// PLACEHOLDER ACCORDION FUNCTIONS
// ===========================
function updatePlaceholderAccordion(accordionSelector, noResultsSelector, searchVal = '') {
  const accordion = $(accordionSelector);
  accordion.empty();
  
  for (const category in allPlaceholders) {
    const sanitized = category.replace(/\s+/g, '');
    const card = $(`<div class='card'></div>`);
    const cardHeader = $(`
      <div class='card-header' id='${sanitized}Heading'>
        <h2 class='mb-0'>
          <button class='btn btn-link btn-block text-left' type='button'
            data-toggle='collapse' data-target='#${sanitized}Collapse'
            aria-expanded='true' aria-controls='${sanitized}Collapse'>
            ${category}
          </button>
        </h2>
      </div>`);
    const collapseDiv = $(`
      <div id='${sanitized}Collapse' class='collapse show'
        aria-labelledby='${sanitized}Heading' data-parent='${accordionSelector}'>
        <div class='card-body'><div class='list-group'></div></div>
      </div>`);
    
    const primaryItems = allPlaceholders[category].filter(p => p.isPrimary);
    const secondaryItems = allPlaceholders[category].filter(p => !p.isPrimary);

    primaryItems.forEach(p => {
      const showItem = matchesSearch(p, searchVal);
      const item = $(`
        <div class='list-group-item placeholder-btn'
          data-type='${p.type}'
          data-toggle='tooltip'
          title='${p.tooltip}'
          style='display: ${showItem ? 'block' : 'none'};'>
          <i class='${p.icon}'></i> ${p.type}
        </div>`);
      collapseDiv.find('.list-group').append(item);
    });

    if (secondaryItems.length > 0) {
      const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
      secondaryItems.forEach(p => {
        const showItem = matchesSearch(p, searchVal);
        const item = $(`
          <div class='list-group-item placeholder-btn secondary-placeholder'
            data-type='${p.type}'
            data-toggle='tooltip'
            title='${p.tooltip}'
            style='display: ${showItem ? 'block' : 'none'};'>
            <i class='${p.icon}'></i> ${p.type}
          </div>`);
        hiddenWrapper.append(item);
      });
      collapseDiv.find('.list-group').append(hiddenWrapper);
      const toggleLink = $(`
        <div class='show-more-toggle' data-category='${sanitized}'>
          Show More
        </div>`);
      collapseDiv.find('.list-group').append(toggleLink);

      if (!searchVal) {
        hiddenWrapper.find('.secondary-placeholder').hide();
        toggleLink.text('Show More');
      } else {
        let anySecondaryVisible = false;
        hiddenWrapper.find('.secondary-placeholder').each(function() {
          if ($(this).css('display') !== 'none') {
            anySecondaryVisible = true;
          }
        });
        toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
      }
    }
    card.append(cardHeader).append(collapseDiv);
    accordion.append(card);
  }

  // Custom placeholders card
  if (customPlaceholders.length > 0) {
    const card = $(`<div class='card'></div>`);
    const cardHeader = $(`
      <div class='card-header' id='CustomPlaceholdersHeading'>
        <h2 class='mb-0'>
          <button class='btn btn-link btn-block text-left' type='button'
            data-toggle='collapse' data-target='#CustomPlaceholdersCollapse'
            aria-expanded='true' aria-controls='CustomPlaceholdersCollapse'>
            Custom Placeholders
          </button>
        </h2>
      </div>`);
    const collapseDiv = $(`
      <div id='CustomPlaceholdersCollapse' class='collapse show'
        aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
        <div class='card-body'><div class='list-group'></div></div>
      </div>`);
    
    customPlaceholders.forEach(p => {
      const showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
      const item = $(`
        <div class='list-group-item placeholder-btn custom-placeholder'
          data-type='${p.type}'
          style='display: ${showItem ? 'block' : 'none'};'>
          <i class='fas fa-star'></i> ${p.type}
        </div>`);
      collapseDiv.find('.list-group').append(item);
    });
    card.append(cardHeader).append(collapseDiv);
    accordion.append(card);
  }

  if (searchVal) {
    let anyShown = false;
    accordion.find('.placeholder-btn').each(function() {
      if ($(this).css('display') !== 'none') {
        anyShown = true;
      }
    });
    $(noResultsSelector).toggle(!anyShown);
    accordion.find('.card-header, .show-more-toggle').hide();
  } else {
    $(noResultsSelector).hide();
    accordion.find('.card-header, .show-more-toggle').show();
  }
  $('[data-toggle="tooltip"]').tooltip();
}

function matchesSearch(placeholder, searchVal) {
  if (searchVal) {
    return placeholder.type.toLowerCase().includes(searchVal.toLowerCase());
  } else {
    return placeholder.isPrimary;
  }
}

$(document).on('click', '.show-more-toggle', function() {
  const parentList = $(this).closest('.list-group');
  const hiddenItems = parentList.find('.secondary-placeholder-wrapper .secondary-placeholder');
  const link = $(this);
  if (link.text() === 'Show More') {
    hiddenItems.show();
    link.text('Show Less');
  } else {
    hiddenItems.hide();
    link.text('Show More');
  }
});

$('#placeholderSearch').on('input', function() {
  const q = $(this).val();
  updatePlaceholderAccordion('#placeholderAccordion', '#noResults', q);
  $('#searchQuery').text(q);
  $('#searchQueryBtn').text(q);
});

$('#modalPlaceholderSearch').on('input', function() {
  const q = $(this).val();
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', q);
  $('#modalSearchQuery').text(q);
  $('#modalSearchQueryBtn').text(q);
});

$('#addCustomPlaceholderBtn').on('click', function() {
  const raw = $('#searchQuery').text();
  addNewCustomPlaceholder(raw);
  updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
  insertPlaceholderFromCustom(raw);
  debouncedStoreState();
});

$('#modalAddCustomPlaceholderBtn').on('click', function() {
  const raw = $('#modalSearchQuery').text();
  addNewCustomPlaceholder(raw);
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  $('#placeholderModal').modal('hide');
  insertPlaceholderFromCustom(raw);
  debouncedStoreState();
});

function addNewCustomPlaceholder(rawText) {
  const spaced = toTitleCase(rawText);
  if (!customPlaceholders.some(p => p.type === spaced)) {
    customPlaceholders.push({ type: spaced });
  }
}

function insertPlaceholderFromCustom(rawText) {
  const spaced = toTitleCase(rawText);
  insertPlaceholder(spaced, true);
}

$('#addPlaceholderBtn').on('click', function() {
  $('#modalPlaceholderSearch').val('');
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  $('#placeholderModal').modal('show');
});

$(document).on('click', '.placeholder-btn', function() {
  if ($('#placeholderModal').hasClass('show')) {
    $('#placeholderModal').modal('hide');
  }
  const type = $(this).data('type');
  if ([
    'Action Verb', 'Stative Verb', 'Communication Verb',
    'Linking Verb', 'Modal Verb', 'Movement Verb',
    'Intransitive Verb', 'Transitive Verb'
  ].includes(type)) {
    showVerbTenseSelection(type);
    return;
  }
  if (NOUNS_REQUIRING_NUMBER.includes(type)) {
    showNounNumberSelection(type);
    return;
  }
  if (type === 'Pronoun') {
    pickPronounFormAndGroup();
    return;
  }
  insertPlaceholder(type, false);
  debouncedStoreState();
});

function showNounNumberSelection(baseType) {
  let html = `<div class='list-group'>`;
  const forms = [ 'Singular', 'Plural' ];
  forms.forEach(f => {
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
      $(container).find('.noun-number-btn').on('click', function() {
        const selected = $(this).data('form');
        const finalType = `${baseType} (${selected})`;
        insertPlaceholder(finalType, false);
        Swal.close();
        debouncedStoreState();
      });
    }
  });
}

function showVerbTenseSelection(baseType) {
  let html = `<div class='list-group'>`;
  VERB_TENSES.forEach(t => {
    html += `<button class='list-group-item list-group-item-action verb-tense-btn' data-tense='${t.value}'>${t.text}</button>`;
  });
  html += `</div>`;
  Swal.fire({
    title: 'Select Verb Tense',
    html,
    showCancelButton: true,
    showConfirmButton: false,
    didOpen: () => {
      const container = Swal.getHtmlContainer();
      $(container).find('.verb-tense-btn').on('click', function() {
        const selected = $(this).data('tense');
        const finalType = `${baseType} (${selected})`;
        insertPlaceholder(finalType, false);
        Swal.close();
        debouncedStoreState();
      });
    }
  });
}

function pickPronounFormAndGroup() {
  const forms = [
    { value:'subject', text:'Subject (he, she, they)' },
    { value:'object', text:'Object (him, her, them)' },
    { value:'possAdj', text:'Possessive Adj. (his, her, their)' },
    { value:'possPron', text:'Possessive Pron. (his, hers)' },
    { value:'reflexive', text:'Reflexive (himself, herself)' },
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
      $(container).find('.pronoun-form-btn').on('click', function() {
        const chosenForm = $(this).data('form');
        Swal.close();
        pickPronounGroup(chosenForm);
      });
    }
  });
}

function pickPronounGroup(form) {
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
      $(container).find('.pronoun-group-btn').on('click', function() {
        const grp = $(this).data('group');
        Swal.close();
        insertPronounPlaceholder(grp, form);
        debouncedStoreState();
      });
      $(container).find('#createNewPronounGroupBtn').on('click', function() {
        pronounGroupCount++;
        const newGroup = `PronounGroup${pronounGroupCount}`;
        pronounGroups[newGroup] = null;
        Swal.close();
        insertPronounPlaceholder(newGroup, form);
        debouncedStoreState();
      });
    }
  });
}

function insertPronounPlaceholder(groupId, form) {
  const baseFormKey = groupId + '_' + form;
  variableCounts[baseFormKey] = (variableCounts[baseFormKey] || 0) + 1;
  const usageCount = variableCounts[baseFormKey];
  const placeholderId = baseFormKey + usageCount;
  const displayType = `PRONOUN|${groupId}|${form}`;
  const ph = `{${placeholderId}}`;
  insertPlaceholderAtCursor(ph);
  if (!variables.some(v => v.id === placeholderId)) {
    variables.push({ id: placeholderId, type: displayType });
    updateVariablesList();
  }
}

function insertPlaceholder(displayType, isCustom) {
  const sanitized = removeSpaces(displayType);
  variableCounts[sanitized] = (variableCounts[sanitized] || 0) + 1;
  const id = sanitized + variableCounts[sanitized];
  const ph = `{${id}}`;
  insertPlaceholderAtCursor(ph);
  if (!variables.some(v => v.id === id)) {
    variables.push({ id, type: displayType });
    updateVariablesList();
  }
}

function insertPlaceholderAtCursor(placeholder) {
  const textarea = document.getElementById('storyText');
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  let textValue = textarea.value;
  const savedScrollTop = textarea.scrollTop;
  const userIsReplacing = (startPos < endPos);
  if (userIsReplacing) {
    let selectedText = textValue.substring(startPos, endPos);
    const hasLeadingSpace = /^\s/.test(selectedText);
    const hasTrailingSpace = /\s$/.test(selectedText);
    selectedText = selectedText.trim();
    let insertion = placeholder;
    if (hasLeadingSpace || hasTrailingSpace) {
      insertion += ' ';
    }
    textValue = textValue.substring(0, startPos) + insertion + textValue.substring(endPos);
    textarea.value = textValue;
    const newCaretPos = startPos + insertion.length;
    textarea.selectionStart = textarea.selectionEnd = newCaretPos;
  } else {
    textarea.value = textValue.substring(0, startPos) + placeholder + textValue.substring(endPos);
    const newCaretPos = startPos + placeholder.length;
    textarea.selectionStart = textarea.selectionEnd = newCaretPos;
  }
  textarea.focus();
  textarea.scrollTop = savedScrollTop;
}

function removeSpaces(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

$('#storyText').on('input', updateVariablesFromText);

function updateVariablesFromText() {
  const txt = $('#storyText').val();
  const regex = /\{([^}]+)\}/g;
  const foundIds = [];
  let m;
  while ((m = regex.exec(txt)) !== null) {
    foundIds.push(m[1]);
  }
  variables = variables.filter(v => foundIds.includes(v.id));
  foundIds.forEach(id => {
    if (!variables.some(v => v.id === id)) {
      variables.push({ id, type: guessTypeFromId(id) });
    }
  });
  updateVariablesList();
  debouncedStoreState();
}

function guessTypeFromId(id) {
  const re = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)(\d+)$/;
  const match = re.exec(id);
  if (match) {
    return `PRONOUN|${match[1]}|${match[2]}`;
  }
  return removeSpaces(id);
}

function updateVariablesList() {
  const sel = document.getElementById('existingPlaceholders');
  sel.innerHTML = '<option value="">-- Select Placeholder --</option>';
  variables.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.type} ({${v.id}})`;
    sel.appendChild(opt);
  });
}

$('#existingPlaceholders').on('change', function() {
  const id = this.value;
  if (!id) return;
  const variable = variables.find(v => v.id === id);
  if (!variable) return;
  if (variable.type.startsWith('PRONOUN|')) {
    showPronounReuseFlow(variable);
    this.value = '';
    return;
  }
  if (variable.type.match(/Verb/)) {
    const base = variable.type.replace(/\(.*\)/, '').trim();
    showVerbTenseSelection(base);
    this.value = '';
    return;
  }
  if (checkIfNounWithNumber(variable.type)) {
    const base = variable.type.replace(/\(.*\)/, '').trim();
    showNounNumberSelection(base);
    this.value = '';
    return;
  }
  insertPlaceholderAtCursor(`{${id}}`);
  this.value = '';
  debouncedStoreState();
});

function showPronounReuseFlow(variable) {
  const parts = variable.type.split('|');
  const groupId = parts[1];
  const form = parts[2];
  Swal.fire({
    title: 'Pronoun Placeholder',
    html: `Group: ${groupId}, Form: ${form}<br>Insert again or pick a new form?`,
    showCancelButton: true,
    confirmButtonText: 'Insert Again',
    cancelButtonText: 'New Form'
  }).then(res => {
    if (res.isConfirmed) {
      insertPlaceholderAtCursor(`{${variable.id}}`);
      debouncedStoreState();
    } else if (res.dismiss === Swal.DismissReason.cancel) {
      pickPronounFormAndGroup();
    }
  });
}

function checkIfNounWithNumber(t) {
  const base = t.replace(/\(.*\)/, '').trim();
  return NOUNS_REQUIRING_NUMBER.includes(base);
}

$('#saveStory').on('click', function() {
  const text = $('#storyText').val().trim();
  const title = $('#storyTitle').val().trim();
  const author = $('#storyAuthor').val().trim();
  if (!title || !author || !text) {
    Swal.fire('Oops!', 'Please fill out title, author, and story.', 'error');
    return;
  }
  const content = `Title: ${title}\nAuthor: ${author}\n\n${text}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.download = `${title.replace(/\s+/g, '_')}.txt`;
  anchor.href = URL.createObjectURL(blob);
  anchor.target = '_blank';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  Swal.fire('Success!', 'Story saved!', 'success');
});

$('#uploadStoryBtn').on('click', function() {
  $('#uploadStory').click();
});

$('#uploadStory').on('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const titleMatch = content.match(/^Title:\s*(.*)$/m);
    const authorMatch = content.match(/^Author:\s*(.*)$/m);
    const storyStartIndex = content.indexOf('\n\n');
    let storyContent = '';
    if (storyStartIndex !== -1) {
      storyContent = content.substring(storyStartIndex + 2);
    } else {
      storyContent = content;
    }
    $('#storyTitle').val(titleMatch ? titleMatch[1] : '');
    $('#storyAuthor').val(authorMatch ? authorMatch[1] : '');
    $('#storyText').val(storyContent);
    variables = [];
    variableCounts = {};
    pronounGroupCount = 0;
    pronounGroups = {};
    fillValues = {};
    customPlaceholders = [];
    updateVariablesFromText();
  };
  reader.readAsText(file);
});

$('#startGame').on('click', function() {
  $('[data-toggle="tooltip"]').tooltip('dispose');
  storyText = $('#storyText').val();
  if (!storyText) {
    Swal.fire('Oops!', 'Please write a story.', 'error');
    return;
  }
  variables = [];
  $('[data-toggle="tooltip"]').tooltip('dispose');
  const regex = /\{([^}]+)\}/g;
  let m;
  while ((m = regex.exec(storyText)) !== null) {
    variables.push({ id: m[1], type: guessTypeFromId(m[1]) });
  }
  variables = variables.filter((v, i, self) => i === self.findIndex(t => t.id === v.id));
  if (!variables.length) {
    Swal.fire('Oops!', 'No placeholders found.', 'error');
    return;
  }
  buildFillForm();
  $('#inputs').removeClass('d-none');
  $('#editor').addClass('d-none');
  debouncedStoreState();
});

function buildFillForm() {
  const form = $('#inputForm');
  form.empty();
  const groupSet = new Set();
  for (const v of variables) {
    if (v.type.startsWith('PRONOUN|')) {
      const parts = v.type.split('|');
      groupSet.add(parts[1]);
    }
  }
  if (groupSet.size > 0) {
    form.append(`<h4>Pronouns</h4>`);
    groupSet.forEach(g => {
      const block = $(`
        <div class='form-group'>
          <label><strong>${g}</strong></label>
        </div>
      `);
      const radios = `
        <div class='form-check'>
          <input type='radio' class='form-check-input' name='${g}-choice' value='HeHim'>
          <label class='form-check-label'>He/Him</label>
        </div>
        <div class='form-check'>
          <input type='radio' class='form-check-input' name='${g}-choice' value='SheHer'>
          <label class='form-check-label'>She/Her</label>
        </div>
        <div class='form-check'>
          <input type='radio' class='form-check-input' name='${g}-choice' value='TheyThem'>
          <label class='form-check-label'>They/Them</label>
        </div>
        <div class='form-check mb-2'>
          <input type='radio' class='form-check-input' name='${g}-choice' value='Custom'>
          <label class='form-check-label'>Custom</label>
        </div>
        <input type='text' class='form-control form-control-sm d-none' id='${g}-custom'
          placeholder='comma-separated: subject, object, possAdj, possPron, reflexive'>
      `;
      block.append(radios);
      form.append(block);
    });
    form.on('change', "input[type='radio']", function() {
      const groupName = $(this).attr('name').replace('-choice', '');
      if ($(this).val() === 'Custom') {
        $(`#${groupName}-custom`).removeClass('d-none');
      } else {
        $(`#${groupName}-custom`).addClass('d-none');
      }
    });
  }
  const sorted = [...variables].sort((a, b) => a.id.localeCompare(b.id));
  for (const variable of sorted) {
    if (variable.type.startsWith('PRONOUN|')) continue;
    const group = $(`
      <div class="form-group input-row">
        <div class="row">
          <div class="col-sm-4">
            <label class="input-label">${formatLabel(variable.type)}:</label>
          </div>
          <div class="col-sm-8">
            <input type="text"
              class="form-control form-control-sm compact-input"
              name="${variable.id}"
              data-label="${variable.type}">
          </div>
        </div>
      </div>
    `);
    if (fillValues[variable.id]) {
      group.find('input').val(fillValues[variable.id]);
    }
    form.append(group);
  }
}

$('#generateStory').on('click', function() {
  $('[data-toggle="tooltip"]').tooltip('dispose');
  const inputs = $('#inputForm input[type="text"]:not(.d-none)');
  let valid = true;
  inputs.each(function() {
    const pid = $(this).attr('name');
    if (!pid) return;
    const val = $(this).val().trim();
    const label = $(this).attr('data-label');
    if (!val && pid) {
      Swal.fire('Oops!', `Please enter a value for ${label}.`, 'error');
      valid = false;
      return false;
    }
    fillValues[pid] = val;
  });
  if (!valid) return;
  const groupSet = new Set();
  for (const v of variables) {
    if (v.type.startsWith('PRONOUN|')) {
      const parts = v.type.split('|');
      groupSet.add(parts[1]);
    }
  }
  groupSet.forEach(g => {
    const choice = $(`input[name='${g}-choice']:checked`).val();
    if (!choice) {
      pronounGroups[g] = { subject:'', object:'', possAdj:'', possPron:'', reflexive:'' };
      return;
    }
    if (choice === 'HeHim' || choice === 'SheHer' || choice === 'TheyThem') {
      pronounGroups[g] = { ...PREDEFINED_SETS[choice] };
    } else {
      const raw = $(`#${g}-custom`).val().trim();
      const splitted = raw.split(',').map(s => s.trim());
      if (splitted.length === 5) {
        pronounGroups[g] = {
          subject: splitted[0],
          object: splitted[1],
          possAdj: splitted[2],
          possPron: splitted[3],
          reflexive: splitted[4],
        };
      } else {
        pronounGroups[g] = { subject:'', object:'', possAdj:'', possPron:'', reflexive:'' };
      }
    }
  });
  let final = storyText;
  for (const v of variables) {
    const phRegex = new RegExp(`\\{${v.id}\\}`, 'g');
    if (v.type.startsWith('PRONOUN|')) {
      const parts = v.type.split('|');
      const groupId = parts[1];
      const form = parts[2];
      const groupObj = pronounGroups[groupId];
      if (!groupObj) {
        final = final.replace(phRegex, '');
      } else {
        const finalWord = groupObj[form] || '';
        final = final.replace(phRegex, finalWord);
      }
    } else {
      const userVal = fillValues[v.id] || '';
      final = final.replace(phRegex, userVal);
    }
  }
  $('#finalStory').text(final);
  $('#displayTitle').text($('#storyTitle').val());
  $('#displayAuthor').text($('#storyAuthor').val());
  $('#result').removeClass('d-none');
  $('#inputs').addClass('d-none');
  debouncedStoreState();
});

$('#createNewStory2, #createNewStory').on('click', function(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will discard your current story.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, start new',
    cancelButtonText: 'Cancel'
  }).then((res) => {
    if (res.isConfirmed) {
      createNewStory();
    }
  });
});

function createNewStory() {
  $('#storyTitle').val('');
  $('#storyAuthor').val('');
  $('#storyText').val('');
  variables = [];
  variableCounts = {};
  customPlaceholders = [];
  fillValues = {};
  pronounGroups = {};
  pronounGroupCount = 0;
  updateVariablesList();
  updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  $('#editor').removeClass('d-none');
  $('#inputs, #result').addClass('d-none');
  localStorage.removeItem(STORAGE_KEY);
}

$('#editStoryEntries').on('click', function() {
  buildFillForm();
  $('#result').addClass('d-none');
  $('#inputs').removeClass('d-none');
});

$('#backToEditor, #backToEditor2').on('click', function() {
  $('[data-toggle="tooltip"]').tooltip('dispose');
  $('#result, #inputs').addClass('d-none');
  $('#editor').removeClass('d-none');
});

$('#saveCompletedStory').on('click', function() {
  const finalText = $('#finalStory').text();
  const title = $('#displayTitle').text().trim();
  const author = $('#displayAuthor').text().trim();
  if (!finalText) {
    Swal.fire('Oops!', 'No completed story.', 'error');
    return;
  }
  const content = `Title: ${title}\nAuthor: ${author}\n\n${finalText}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.download = `${title.replace(/\s+/g, '_')}_completed.txt`;
  anchor.href = URL.createObjectURL(blob);
  anchor.target = '_blank';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  Swal.fire('Success!', 'Completed story saved!', 'success');
});
