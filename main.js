let variables = [];
let variableCounts = {};
let storyText = '';
let customPlaceholders = [];
let fillValues = {};

let pronounGroups = {};
let pronounGroupCount = 0;

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
{ value: 'Present (Base Form)', text: 'Present (Base Form)' },
{ value: 'Present (3rd Person Singular)', text: 'Present (3rd Person Singular)' },
{ value: 'Past', text: 'Past' },
{ value: 'Present Participle', text: 'Present Participle' }
];

// Nouns that should prompt for singular/plural
const NOUNS_REQUIRING_NUMBER = [
'Common Noun',
'Proper Noun',
'Pronoun',
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
	type: 'Concrete Noun',
	tooltip: 'A tangible object (car, phone)',
	icon: 'fas fa-cube',
	isPrimary: true,
  },
  {
	type: 'Person',
	tooltip: 'A person or role (teacher, father)',
	icon: 'fas fa-user-friends',
	isPrimary: false,
  },
  {
	type: 'Place',
	tooltip: 'A location (home, city)',
	icon: 'fas fa-map-marker-alt',
	isPrimary: false,
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
  // The user asked to consider Transitive / Intransitive as the most generic, so we show them first:
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
  // Then put everything else behind “Show More.”
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
  // Tucked behind more...
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
],
'Other Placeholders': [
  // The user removed Conjunction from the list.
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
  // The rest hidden
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

$(document).ready(function() {
updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
});

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
	</div>
  `);
  const collapseDiv = $(`
	<div id='${sanitized}Collapse' class='collapse show'
		 aria-labelledby='${sanitized}Heading' data-parent='${accordionSelector}'>
	  <div class='card-body'><div class='list-group'></div></div>
	</div>
  `);

  // Separate primary vs. secondary
  const primaryItems = allPlaceholders[category].filter(p => p.isPrimary);
  const secondaryItems = allPlaceholders[category].filter(p => !p.isPrimary);

  // Build the primary placeholders
  primaryItems.forEach(p => {
	const showItem = matchesSearch(p, searchVal);
	const item = $(`
	  <div class='list-group-item placeholder-btn'
		   data-type='${p.type}'
		   data-toggle='tooltip'
		   title='${p.tooltip}'
		   style='display: ${showItem ? 'block' : 'none'};'>
		<i class='${p.icon}'></i> ${p.type}
	  </div>
	`);
	collapseDiv.find('.list-group').append(item);
  });

  // Build hidden placeholders
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
		</div>
	  `);
	  hiddenWrapper.append(item);
	});

	collapseDiv.find('.list-group').append(hiddenWrapper);

	// Show More / Show Less link
	const toggleLink = $(`
	  <div class='show-more-toggle' data-category='${sanitized}'>
		Show More
	  </div>
	`);
	collapseDiv.find('.list-group').append(toggleLink);

	// If searchVal is present, we want to show secondary items that matched:
	if (searchVal) {
	  // If at least one secondary item is shown, we keep them expanded
	  let anySecondaryVisible = false;
	  hiddenWrapper.find('.secondary-placeholder').each(function() {
		if ($(this).css('display') !== 'none') {
		  anySecondaryVisible = true;
		}
	  });
	  if (anySecondaryVisible) {
		hiddenWrapper.find('.secondary-placeholder').show();
		toggleLink.text('Show Less');
	  }
	}
  }

  card.append(cardHeader).append(collapseDiv);
  accordion.append(card);
}

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
	</div>
  `);
  const collapseDiv = $(`
	<div id='CustomPlaceholdersCollapse' class='collapse show'
		 aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
	  <div class='card-body'><div class='list-group'></div></div>
	</div>
  `);

  customPlaceholders.forEach(p => {
	const showItem = !searchVal || p.type.toLowerCase().includes(searchVal);
	const item = $(`
	  <div class='list-group-item placeholder-btn custom-placeholder'
		   data-type='${p.type}'
		   style='display: ${showItem ? 'block' : 'none'};'>
		<i class='fas fa-star'></i> ${p.type}
	  </div>
	`);
	collapseDiv.find('.list-group').append(item);
  });

  card.append(cardHeader).append(collapseDiv);
  accordion.append(card);
}

// If searching, check if we have any visible .placeholder-btn at all:
if (searchVal) {
  let anyShown = false;
  accordion.find('.placeholder-btn').each(function() {
	if ($(this).css('display') !== 'none') {
	  anyShown = true;
	}
  });
  $(noResultsSelector).toggle(!anyShown);
} else {
  $(noResultsSelector).hide();
}

$('[data-toggle=\"tooltip\"]').tooltip();
}

// Check if item matches search:
function matchesSearch(placeholder, searchVal) {
if (searchVal) {
  return placeholder.type.toLowerCase().includes(searchVal.toLowerCase());
} else {
  return placeholder.isPrimary; // Only show primary placeholders when no search
}
}

// Toggle show/hide the secondary placeholders
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
});

$('#modalAddCustomPlaceholderBtn').on('click', function() {
const raw = $('#modalSearchQuery').text();
addNewCustomPlaceholder(raw);
updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
$('#placeholderModal').modal('hide');
insertPlaceholderFromCustom(raw);
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
	});

	$(container).find('#createNewPronounGroupBtn').on('click', function() {
	  pronounGroupCount++;
	  const newGroup = `PronounGroup${pronounGroupCount}`;
	  pronounGroups[newGroup] = null;
	  Swal.close();
	  insertPronounPlaceholder(newGroup, form);
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
const txt = textarea.value;
textarea.value = txt.substring(0, startPos) + placeholder + txt.substring(endPos);
const newPos = startPos + placeholder.length;
textarea.focus();
textarea.selectionStart = textarea.selectionEnd = newPos;
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
}

// Try to guess if a placeholder is a pronoun from its ID.
function guessTypeFromId(id) {
const re = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)(\\d+)$/;
const match = re.exec(id);
if (match) {
  return `PRONOUN|${match[1]}|${match[2]}`;
}
return removeSpaces(id);
}

// Populate the existing placeholders dropdown.
function updateVariablesList() {
const sel = document.getElementById('existingPlaceholders');
sel.innerHTML = '<option value=\"\">-- Select Placeholder --</option>';
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

  updateVariablesFromText();
};
reader.readAsText(file);
});

// When "Start Game" is clicked, parse placeholders and go to the fill-in stage.
$('#startGame').on('click', function() {
storyText = $('#storyText').val();
if (!storyText) {
  Swal.fire('Oops!', 'Please write a story.', 'error');
  return;
}

// Clear variables and re-detect.
variables = [];
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
const inputs = $('#inputForm input[type=\"text\"]:not(.d-none)');
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

// Display results.
$('#finalStory').text(final);
$('#displayTitle').text($('#storyTitle').val());
$('#displayAuthor').text($('#storyAuthor').val());
$('#result').show();
$('#inputs').hide();
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
}

// Edit the fill-in entries again.
$('#editStoryEntries').on('click', function() {
buildFillForm();
$('#result').hide();
$('#inputs').show();
});

// Go back to editor from fill or result.
$('#backToEditor, #backToEditor2').on('click', function() {
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