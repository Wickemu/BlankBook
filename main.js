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

// NEW: We'll define a key for localStorage
const STORAGE_KEY = 'myStoryState';

// ===========================
// SUPPORTING DATA
// ===========================
function formatLabel(type) {
  // Handle pronoun placeholders first
  if(type.startsWith('PRONOUN|')) {
    const [, group, form] = type.split('|');
    const formMap = {
      subject: 'Subject',
      object: 'Object',
      possAdj: 'Possessive Adjective',
      possPron: 'Possessive Pronoun',
      reflexive: 'Reflexive'
    };
    return `Pronoun (${formMap[form]} - Group ${group.replace('PronounGroup','')})`;
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
  "HeHim": {
    subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself"
  },
  "SheHer": {
    subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself"
  },
  "TheyThem": {
    subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves"
  }
};

// Verb tenses
const VERB_TENSES = [
  { value: 'Present (Base Form)', text: 'Present (Base Form e.g "I run")' },
  { value: 'Present (3rd Person Singular)', text: 'Present (3rd Person Singular e.g "it runs")' },
  { value: 'Past', text: 'Past (e.g. "it ran")' },
  { value: 'Present Participle', text: 'Present Participle (e.g. "It is running")' }
];

// Nouns that should prompt for singular/plural
const NOUNS_REQUIRING_NUMBER = [
  'Common Noun',
  'Proper Noun',
  'Abstract Noun',
  'Concrete Noun',
  'Person',
  'Place',
  'Animal',
  'Body Part',
  'Clothing',
  'Drink',
  'Emotion',
  'Food',
  'Vehicle',
];

// We'll store placeholders as objects with an isPrimary flag,
// so we only show primary by default and hide secondary behind “Show More.”
const allPlaceholders = {
  'Nouns': [
    {
      type: 'Common Noun',
      tooltip: 'A generic noun (book, table)',
      icon: 'fas fa-book',
      isPrimary: true,
    },
    {
      type: 'Proper Noun',
      tooltip: 'A specific name (John, Paris)',
      icon: 'fas fa-user',
      isPrimary: false,
    },
    {
      type: 'Concrete Noun',
      tooltip: 'A tangible object (car, phone)',
      icon: 'fas fa-cube',
      isPrimary: false,
    },
    {
      type: 'Person',
      tooltip: 'A person or role (teacher, father)',
      icon: 'fas fa-user-friends',
      isPrimary: true,
    },
    {
      type: 'Place',
      tooltip: 'A location (home, city)',
      icon: 'fas fa-map-marker-alt',
      isPrimary: true,
    },
	{
		type: 'Pronoun',
		tooltip: 'A pronoun placeholder (he, they)',
		icon: 'fas fa-user-circle',
		isPrimary: true,
	  },
	  {
		type: 'Abstract Noun',
		tooltip: 'An intangible concept (freedom, happiness)',
		icon: 'fas fa-cloud',
		isPrimary: true,
	  },
    {
      type: 'Animal',
      tooltip: 'An animal (dog, lion)',
      icon: 'fas fa-dog',
      isPrimary: false,
    },
    {
      type: 'Body Part',
      tooltip: 'A part of the body (arm, head)',
      icon: 'fas fa-hand-paper',
      isPrimary: false,
    },
    {
      type: 'Clothing',
      tooltip: 'A clothing item (shirt, coat)',
      icon: 'fas fa-tshirt',
      isPrimary: false,
    },
    {
      type: 'Drink',
      tooltip: 'A beverage (coffee, juice)',
      icon: 'fas fa-cocktail',
      isPrimary: false,
    },
    {
      type: 'Emotion',
      tooltip: 'A feeling (joy, anger)',
      icon: 'fas fa-heart',
      isPrimary: false,
    },
    {
      type: 'Food',
      tooltip: 'An edible item (pizza, apple)',
      icon: 'fas fa-utensils',
      isPrimary: false,
    },
    {
      type: 'Vehicle',
      tooltip: 'A type of transport (car, train)',
      icon: 'fas fa-car',
      isPrimary: false,
    },
  ],
  'Verbs': [
    {
      type: 'Intransitive Verb',
      tooltip: 'Does not take a direct object (sleep, arrive)',
      icon: 'fas fa-bed',
      isPrimary: true,
    },
    {
      type: 'Transitive Verb',
      tooltip: 'Takes a direct object (eat, read)',
      icon: 'fas fa-hammer',
      isPrimary: true,
    },
    {
      type: 'Action Verb',
      tooltip: 'An action-based verb (run, jump)',
      icon: 'fas fa-bolt',
      isPrimary: false,
    },
    {
      type: 'Stative Verb',
      tooltip: 'Describes a state (believe, like)',
      icon: 'fas fa-brain',
      isPrimary: false,
    },
    {
      type: 'Communication Verb',
      tooltip: 'A speaking verb (say, shout)',
      icon: 'fas fa-comment-dots',
      isPrimary: false,
    },
    {
      type: 'Linking Verb',
      tooltip: 'A linking verb (is, become)',
      icon: 'fas fa-link',
      isPrimary: false,
    },
    {
      type: 'Modal Verb',
      tooltip: 'Expresses modality (can, must)',
      icon: 'fas fa-key',
      isPrimary: false,
    },
    {
      type: 'Movement Verb',
      tooltip: 'A movement-based verb (walk, swim)',
      icon: 'fas fa-walking',
      isPrimary: false,
    },
  ],
  'Adjectives and Adverbs': [
    {
      type: 'Adjective',
      tooltip: 'Describes a noun (big, happy)',
      icon: 'fas fa-ad',
      isPrimary: true,
    },
    {
      type: 'Adverb',
      tooltip: 'Modifies a verb (quickly, softly)',
      icon: 'fas fa-feather-alt',
      isPrimary: true,
    },
    {
      type: 'Comparative Adjective',
      tooltip: 'Compares two items (bigger, faster)',
      icon: 'fas fa-level-up-alt',
      isPrimary: false,
    },
    {
      type: 'Superlative Adjective',
      tooltip: 'Highest degree (biggest, fastest)',
      icon: 'fas fa-medal',
      isPrimary: false,
    },
    {
      type: 'Color Adjective',
      tooltip: 'Describes a color (red, blue)',
      icon: 'fas fa-palette',
      isPrimary: false,
    },
    {
      type: 'Emotion Adjective',
      tooltip: 'Describes an emotion (joyful, angry)',
      icon: 'fas fa-smile',
      isPrimary: false,
    },
    {
      type: 'Size Adjective',
      tooltip: 'Describes size (large, tiny)',
      icon: 'fas fa-arrows-alt',
      isPrimary: false,
    },
    {
      type: 'Ordinal Number',
      tooltip: 'Indicates position or order (first, second, 34th)',
      icon: 'fas fa-sort-numeric-down',
      isPrimary: false,
    },
  ],
  'Other Placeholders': [
    {
      type: 'Number',
      tooltip: 'Any numerical value (five, 10)',
      icon: 'fas fa-hashtag',
      isPrimary: true,
    },
    {
      type: 'Exclamation',
      tooltip: 'A short outburst (Stop!, Wow!)',
      icon: 'fas fa-bullhorn',
      isPrimary: true,
    },
    {
      type: 'Onomatopoeia',
      tooltip: 'A sound word (buzz, hiss)',
      icon: 'fas fa-volume-up',
      isPrimary: false,
    },
    {
      type: 'Preposition',
      tooltip: 'Shows a relation (on, in)',
      icon: 'fas fa-link',
      isPrimary: false,
    },
    {
      type: 'Interjection',
      tooltip: 'A short utterance (aha, ugh)',
      icon: 'fas fa-exclamation',
      isPrimary: false,
    },
  ],
};

// ===========================
// NEW: localStorage Helpers
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

function loadStateFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const appState = JSON.parse(saved);

    // Restore text fields
    $('#storyTitle').val(appState.storyTitle || '');
    $('#storyAuthor').val(appState.storyAuthor || '');
    $('#storyText').val(appState.storyText || '');

    // Restore variables/objects
    variables = appState.variables || [];
    fillValues = appState.fillValues || {};
    pronounGroups = appState.pronounGroups || {};
    variableCounts = appState.variableCounts || {};
    pronounGroupCount = appState.pronounGroupCount || 0;
    customPlaceholders = appState.customPlaceholders || [];

    // Re-run updates that depend on these values
    updateVariablesFromText();
    updateVariablesList();
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  } catch (e) {
    console.error('Failed to parse saved story state:', e);
  }
}

// ===========================
// ON DOCUMENT READY
// ===========================
$(document).ready(function() {

  // Build the placeholders
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

  // NEW: Load previous state from localStorage, if any
  loadStateFromLocalStorage();

  // NEW: Store changes when user types in title, author, story text
  $('#storyTitle, #storyAuthor, #storyText').on('input', storeStateInLocalStorage);

});

// ===========================
// PLACEHOLDER ACCORDION
// ===========================
function updatePlaceholderAccordion(accordionSelector, noResultsSelector, searchVal = '') {
	const accordion = $(accordionSelector);
	accordion.empty();
  
	for (const category in allPlaceholders) {
	  const sanitized = category.replace(/\s+/g, '');
	  const card = $(`<div class='card'></div>`);
	  const cardHeader = $(`<div class='card-header' id='${sanitized}Heading'>
		<h2 class='mb-0'>
		  <button class='btn btn-link btn-block text-left' type='button'
			data-toggle='collapse' data-target='#${sanitized}Collapse'
			aria-expanded='true' aria-controls='${sanitized}Collapse'>
			${category}
		  </button>
		</h2>
	  </div>`);
	  const collapseDiv = $(`<div id='${sanitized}Collapse' class='collapse show'
		   aria-labelledby='${sanitized}Heading' data-parent='${accordionSelector}'>
		<div class='card-body'><div class='list-group'></div></div>
	  </div>`);
  
	  // Separate primary vs. secondary placeholders
	  const primaryItems = allPlaceholders[category].filter(p => p.isPrimary);
	  const secondaryItems = allPlaceholders[category].filter(p => !p.isPrimary);
  
	  // Build the primary placeholders
	  primaryItems.forEach(p => {
		const showItem = matchesSearch(p, searchVal);
		const item = $(`<div class='list-group-item placeholder-btn'
			 data-type='${p.type}'
			 data-toggle='tooltip'
			 title='${p.tooltip}'
			 style='display: ${showItem ? 'block' : 'none'};'>
		  <i class='${p.icon}'></i> ${p.type}
		</div>`);
		collapseDiv.find('.list-group').append(item);
	  });
  
	  // Build hidden placeholders wrapper
	  if (secondaryItems.length > 0) {
		const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
		secondaryItems.forEach(p => {
		  const showItem = matchesSearch(p, searchVal);
		  const item = $(`<div class='list-group-item placeholder-btn secondary-placeholder'
			   data-type='${p.type}'
			   data-toggle='tooltip'
			   title='${p.tooltip}'
			   style='display: ${showItem ? 'block' : 'none'};'>
			<i class='${p.icon}'></i> ${p.type}
		  </div>`);
		  hiddenWrapper.append(item);
		});
  
		collapseDiv.find('.list-group').append(hiddenWrapper);
  
		// Add the show-more link
		const toggleLink = $(`<div class='show-more-toggle' data-category='${sanitized}'>
		  Show More
		</div>`);
		collapseDiv.find('.list-group').append(toggleLink);
  
		// Decide the INITIAL state for secondary placeholders + link text
		if (!searchVal) {
		  // No searching => all secondary placeholders hidden by default
		  hiddenWrapper.find('.secondary-placeholder').hide();
		  toggleLink.text('Show More');
		} else {
		  // Searching => only matched placeholders might be showing
		  // Check if ANY secondary placeholders are visible
		  let anySecondaryVisible = false;
		  hiddenWrapper.find('.secondary-placeholder').each(function() {
			if ($(this).css('display') !== 'none') {
			  anySecondaryVisible = true;
			}
		  });
		  // If none are visible, the link can stay "Show More" (they're all hidden)
		  // If some are visible, link should say "Show Less"
		  toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
		}
	  }
  
	  // Append final card
	  card.append(cardHeader).append(collapseDiv);
	  accordion.append(card);
	}
  
	// Handle custom placeholders, if any
	if (customPlaceholders.length > 0) {
	  const card = $(`<div class='card'></div>`);
	  const cardHeader = $(`<div class='card-header' id='CustomPlaceholdersHeading'>
		<h2 class='mb-0'>
		  <button class='btn btn-link btn-block text-left' type='button'
			data-toggle='collapse' data-target='#CustomPlaceholdersCollapse'
			aria-expanded='true' aria-controls='CustomPlaceholdersCollapse'>
			Custom Placeholders
		  </button>
		</h2>
	  </div>`);
	  const collapseDiv = $(`<div id='CustomPlaceholdersCollapse' class='collapse show'
		   aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
		<div class='card-body'><div class='list-group'></div></div>
	  </div>`);
  
	  customPlaceholders.forEach(p => {
		const showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
		const item = $(`<div class='list-group-item placeholder-btn custom-placeholder'
			 data-type='${p.type}'
			 style='display: ${showItem ? 'block' : 'none'};' >
		  <i class='fas fa-star'></i> ${p.type}
		</div>`);
		collapseDiv.find('.list-group').append(item);
	  });
  
	  card.append(cardHeader).append(collapseDiv);
	  accordion.append(card);
	}
  
	// Now handle search-based hide/show of card headers, plus "no results" message
	if (searchVal) {
	  let anyShown = false;
	  accordion.find('.placeholder-btn').each(function() {
		if ($(this).css('display') !== 'none') {
		  anyShown = true;
		}
	  });
  
	  // Show or hide "No Results"
	  $(noResultsSelector).toggle(!anyShown);
  
	  // Hide all card headers and "show-more-toggle" in search mode
	  accordion.find('.card-header, .show-more-toggle').hide();
	} else {
	  // When no search, hide "No Results" and show everything
	  $(noResultsSelector).hide();
	  accordion.find('.card-header, .show-more-toggle').show();
	}
  
	// Finally, re-init tooltips
	$('[data-toggle="tooltip"]').tooltip();
  }
  

function matchesSearch(placeholder, searchVal) {
  if (searchVal) {
    return placeholder.type.toLowerCase().includes(searchVal.toLowerCase());
  } else {
    return placeholder.isPrimary; // Only show primary placeholders when no search
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

  // NEW: store changes
  storeStateInLocalStorage();
});

$('#modalAddCustomPlaceholderBtn').on('click', function() {
  const raw = $('#modalSearchQuery').text();
  addNewCustomPlaceholder(raw);
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  $('#placeholderModal').modal('hide');
  insertPlaceholderFromCustom(raw);

  // NEW: store changes
  storeStateInLocalStorage();
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

// Handle clicks on the placeholder items.
$(document).on('click', '.placeholder-btn', function() {
  // If the modal is open on smaller screens, hide it.
  if ($('#placeholderModal').hasClass('show')) {
    $('#placeholderModal').modal('hide');
  }

  const type = $(this).data('type');

  // If this is a verb, prompt for tense.
  if ([
    'Action Verb',
    'Stative Verb',
    'Communication Verb',
    'Linking Verb',
    'Modal Verb',
    'Movement Verb',
    'Intransitive Verb',
    'Transitive Verb'
  ].includes(type)) {
    showVerbTenseSelection(type);
    return;
  }

  // If this is a noun that needs singular/plural selection
  if (NOUNS_REQUIRING_NUMBER.includes(type)) {
    showNounNumberSelection(type);
    return;
  }

  // If user picks a pronoun, prompt for form/group.
  if (type === 'Pronoun') {
    pickPronounFormAndGroup();
    return;
  }

  // Otherwise, just insert directly.
  insertPlaceholder(type, false);
  // NEW: store after insertion
  storeStateInLocalStorage();
});

// Display a prompt to pick singular/plural for certain nouns.
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

        // NEW: store changes
        storeStateInLocalStorage();
      });
    }
  });
}

// Display a prompt to pick verb tense.
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

        // NEW: store changes
        storeStateInLocalStorage();
      });
    }
  });
}

// Prompt user for pronoun form, then group.
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
        storeStateInLocalStorage(); // NEW
      });

      $(container).find('#createNewPronounGroupBtn').on('click', function() {
        pronounGroupCount++;
        const newGroup = `PronounGroup${pronounGroupCount}`;
        pronounGroups[newGroup] = null;
        Swal.close();
        insertPronounPlaceholder(newGroup, form);
        storeStateInLocalStorage(); // NEW
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

// Insert the final placeholder text at the cursor position.
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
  
	// 1) Save the current scroll position so we can restore it
	const savedScrollTop = textarea.scrollTop;
  
	// 2) Check if the user selected some text (e.g., double-clicked a word)
	const userIsReplacing = (startPos < endPos);
  
	if (userIsReplacing) {
	  // Grab the exact text the user highlighted
	  let selectedText = textValue.substring(startPos, endPos);
  
	  // See if it starts or ends with whitespace
	  const hasLeadingSpace = /^\s/.test(selectedText);
	  const hasTrailingSpace = /\s$/.test(selectedText);
  
	  // We'll do a simple "smart" approach:
	  // - Trim the selected text
	  // - Insert your placeholder
	  // - If the original selection had *any* leading or trailing space,
	  //   add exactly one trailing space after the placeholder.
  
	  selectedText = selectedText.trim(); // remove leading/trailing spaces
	  let insertion = placeholder;
  
	  // If the user double-clicked and caught a space (leading or trailing),
	  // we add one trailing space after the placeholder so we don't lose spacing.
	  if (hasLeadingSpace || hasTrailingSpace) {
		insertion += ' ';
	  }
  
	  // Rebuild the text value
	  textValue =
		textValue.substring(0, startPos) +
		insertion +
		textValue.substring(endPos);
  
	  // Update the textarea
	  textarea.value = textValue;
  
	  // Move the cursor right after the newly inserted placeholder
	  const newCaretPos = startPos + insertion.length;
	  textarea.selectionStart = textarea.selectionEnd = newCaretPos;
	} else {
	  // If there's NO selection (just a cursor), we simply insert the placeholder
	  textarea.value =
		textValue.substring(0, startPos) +
		placeholder +
		textValue.substring(endPos);
  
	  // Set the new cursor position
	  const newCaretPos = startPos + placeholder.length;
	  textarea.selectionStart = textarea.selectionEnd = newCaretPos;
	}
  
	// 3) Restore focus (so typing still works immediately)
	//    But do NOT let the browser auto-scroll. We restore scrollTop manually.
	textarea.focus();
  
	// 4) Restore the exact scroll position from before
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

// As user types or loads a story, parse out the placeholders.
function updateVariablesFromText() {
  const txt = $('#storyText').val();
  const regex = /\{([^}]+)\}/g;
  const foundIds = [];
  let m;
  while ((m = regex.exec(txt)) !== null) {
    foundIds.push(m[1]);
  }

  // Remove placeholders that no longer exist in the text
  variables = variables.filter(v => foundIds.includes(v.id));

  // Add new placeholders
  foundIds.forEach(id => {
    if (!variables.some(v => v.id === id)) {
      variables.push({ id, type: guessTypeFromId(id) });
    }
  });

  updateVariablesList();
  // NEW: store state whenever placeholders update
  storeStateInLocalStorage();
}

// Try to guess if a placeholder is a pronoun from its ID.
function guessTypeFromId(id) {
  // Fix the double slash: use (\d+)
  const re = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)(\d+)$/;
  const match = re.exec(id);
  if (match) {
    return `PRONOUN|${match[1]}|${match[2]}`;
  }
  return removeSpaces(id);
}

// Populate the existing placeholders dropdown.
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

// If a user selects a placeholder from the dropdown.
$('#existingPlaceholders').on('change', function() {
  const id = this.value;
  if (!id) return;
  const variable = variables.find(v => v.id === id);
  if (!variable) return;

  // Handle pronouns specially
  if (variable.type.startsWith('PRONOUN|')) {
    showPronounReuseFlow(variable);
    this.value = '';
    return;
  }

  // If it's a verb, let user pick tense again
  if (variable.type.match(/Verb/)) {
    const base = variable.type.replace(/\(.*\)/, '').trim();
    showVerbTenseSelection(base);
    this.value = '';
    return;
  }

  // If it's a noun that might need singular/plural
  if (checkIfNounWithNumber(variable.type)) {
    const base = variable.type.replace(/\(.*\)/, '').trim();
    showNounNumberSelection(base);
    this.value = '';
    return;
  }

  // Otherwise, insert the placeholder directly
  insertPlaceholderAtCursor(`{${id}}`);
  this.value = '';

  // NEW: store changes
  storeStateInLocalStorage();
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
      // NEW: store changes
      storeStateInLocalStorage();
    } else if (res.dismiss === Swal.DismissReason.cancel) {
      pickPronounFormAndGroup();
    }
  });
}

// Check if the type string indicates one of the nouns that can be singular or plural.
function checkIfNounWithNumber(t) {
  const base = t.replace(/\(.*\)/, '').trim();
  return NOUNS_REQUIRING_NUMBER.includes(base);
}

// Save the story text to a file.
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

// Upload a previously saved story.
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

// When "Start Game" is clicked, parse placeholders and go to the fill-in stage.
$('#startGame').on('click', function() {
  $('[data-toggle="tooltip"]').tooltip('dispose');
  storyText = $('#storyText').val();
  if (!storyText) {
    Swal.fire('Oops!', 'Please write a story.', 'error');
    return;
  }

  // Clear variables and re-detect.
  variables = [];
  $('[data-toggle="tooltip"]').tooltip('dispose');

  const regex = /\{([^}]+)\}/g;
  let m;
  while ((m = regex.exec(storyText)) !== null) {
    variables.push({ id: m[1], type: guessTypeFromId(m[1]) });
  }
  // Remove duplicates.
  variables = variables.filter((v, i, self) => i === self.findIndex(t => t.id === v.id));

  if (!variables.length) {
    Swal.fire('Oops!', 'No placeholders found.', 'error');
    return;
  }

  buildFillForm();
  $('#inputs').show();
  $('#editor').hide();

  // NEW: store changes
  storeStateInLocalStorage();
});

// Build the fill-in form with each placeholder.
function buildFillForm() {
  const form = $('#inputForm');
  form.empty();

  // First, handle any pronoun groups.
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
      const block = $(`<div class='form-group'><label><strong>${g}</strong></label></div>`);
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
      const groupName = $(this).attr('name').replace('-choice','');
      if ($(this).val() === 'Custom') {
        $(`#${groupName}-custom`).removeClass('d-none');
      } else {
        $(`#${groupName}-custom`).addClass('d-none');
      }
    });
  }

  // Then the rest of the placeholders.
  const sorted = [...variables].sort((a,b) => a.id.localeCompare(b.id));

  for(const variable of sorted) {
    if(variable.type.startsWith('PRONOUN|')) continue;

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

    if(fillValues[variable.id]) {
      group.find('input').val(fillValues[variable.id]);
    }
    form.append(group);
  }
}

// Generate the final story.
$('#generateStory').on('click', function() {
  // Hide all tooltips
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

  // Resolve pronoun groups.
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
      pronounGroups[g] = {
        subject:'', object:'', possAdj:'', possPron:'', reflexive:''
      };
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
        pronounGroups[g] = {
          subject:'', object:'', possAdj:'', possPron:'', reflexive:''
        };
      }
    }
  });

  // Build the final story text.
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

  // Display results. Use pre-wrap so newlines are preserved
  $('#finalStory').text(final); // you already use pre-wrap in CSS
  $('#displayTitle').text($('#storyTitle').val());
  $('#displayAuthor').text($('#storyAuthor').val());
  $('#result').show();
  $('#inputs').hide();

  // NEW: store changes
  storeStateInLocalStorage();
});

// Confirm a new story if user is on the final page.
$('#createNewStory2').on('click', function(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will discard the current story results.',
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

// Confirm a new story if user is on the fill page.
$('#createNewStory').on('click', function(e) {
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

// Reset everything to start a new story.
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
  $('#editor').show();
  $('#inputs, #result').hide();

  // NEW: Clear local storage for a fresh start
  localStorage.removeItem(STORAGE_KEY);
}

// Edit the fill-in entries again.
$('#editStoryEntries').on('click', function() {
  buildFillForm();
  $('#result').hide();
  $('#inputs').show();
});

// Go back to editor from fill or result.
$('#backToEditor, #backToEditor2').on('click', function() {
  $('[data-toggle="tooltip"]').tooltip('dispose');
  $('#result').hide();
  $('#inputs').hide();
  $('#editor').show();
});

// Save the completed story.
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
