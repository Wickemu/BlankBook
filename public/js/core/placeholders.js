// public/js/core/placeholders.js
import state, { pronounMapping } from './state.js';
import { Utils } from '../utils/utils.js';
import { TypeHelpers } from '../utils/typeHelpers.js';

export const categoryOrder = ["Nouns", "Verbs", "Descriptors", "Other"];

export const allPlaceholders = {
    "Nouns": [
        { internalType: "NN", display: "Noun", tooltip: "Generic noun (table, apple)", icon: "fas fa-book", isPrimary: true },
        { internalType: "NNP", display: "Proper Noun", tooltip: "Specific name (London, Sarah)", icon: "fas fa-user", isPrimary: false },
        { internalType: "PRONOUN", display: "Pronoun", tooltip: "A pronoun", icon: "fas fa-user-circle", isPrimary: true },
        { internalType: "NN_Concrete", display: "Concrete", tooltip: "Tangible object (chair, phone)", icon: "fas fa-cube", isPrimary: false },
        { internalType: "NN_Person", display: "Person", tooltip: "A person (teacher, doctor)", icon: "fas fa-user-friends", isPrimary: true },
        { internalType: "NN_Place", display: "Place", tooltip: "A location (park, school)", icon: "fas fa-map-marker-alt", isPrimary: true },
        { internalType: "NN_Abstract", display: "Abstract", tooltip: "Intangible (happiness, freedom)", icon: "fas fa-cloud", isPrimary: true },
        { internalType: "NN_Animal", display: "Animal", tooltip: "Living creature (dog, elephant)", icon: "fas fa-dog", isPrimary: false },
        { internalType: "NN_BodyPart", display: "Body Part", tooltip: "Part of body (hand, knee)", icon: "fas fa-hand-paper", isPrimary: false },
        { internalType: "NN_Clothing", display: "Clothing", tooltip: "Wearable (shirt, jacket)", icon: "fas fa-tshirt", isPrimary: false },
        { internalType: "NN_Drink", display: "Drink", tooltip: "Beverage (juice, coffee)", icon: "fas fa-cocktail", isPrimary: false },
        { internalType: "NN_Emotion", display: "Emotion", tooltip: "Feeling (joy, anger)", icon: "fas fa-heart", isPrimary: false },
        { internalType: "NN_Food", display: "Food", tooltip: "Edible item (pizza, carrot)", icon: "fas fa-utensils", isPrimary: false },
        { internalType: "NN_Vehicle", display: "Vehicle", tooltip: "Mode of transport (car, bicycle)", icon: "fas fa-car", isPrimary: false },
        { internalType: "NN_Onomatopoeia", display: "Sound/Onomatopoeia", tooltip: "Sound word (bang, buzz)", icon: "fas fa-volume-up", isPrimary: false }
    ],
    "Verbs": [
        { internalType: "VB", display: "Verb", tooltip: "Action/state (jump, write)", icon: "fas fa-pen", isPrimary: true },
        { internalType: "VB_Intransitive", display: "Intransitive", tooltip: "No object (sleep, arrive)", icon: "fas fa-bed", isPrimary: true },
        { internalType: "VB_Transitive", display: "Transitive", tooltip: "Takes object (kick, carry)", icon: "fas fa-hammer", isPrimary: true },
        { internalType: "VB_Action", display: "Action", tooltip: "Physical action (run, climb)", icon: "fas fa-bolt", isPrimary: false },
        { internalType: "VB_Stative", display: "State", tooltip: "Condition (believe, know)", icon: "fas fa-brain", isPrimary: false },
        { internalType: "VB_Communication", display: "Communication", tooltip: "Speaking (say, shout)", icon: "fas fa-comment-dots", isPrimary: false },
        { internalType: "VB_Movement", display: "Movement", tooltip: "Motion-based (walk, swim)", icon: "fas fa-walking", isPrimary: false },
        { internalType: "VB_Onomatopoeia", display: "Sound/Onomatopoeia", tooltip: "Sound verb (meow, boom)", icon: "fas fa-volume-up", isPrimary: false },
        { internalType: "MD", display: "Modal", tooltip: "Possibility (can, must)", icon: "fas fa-key", isPrimary: false },
        { internalType: "VB_Linking", display: "Linking", tooltip: "Links subject (seem, become)", icon: "fas fa-link", isPrimary: false },
        { internalType: "VB_Phrase", display: "Phrasal Verb", tooltip: "Multi-word verb (give up, look after)", icon: "fas fa-random", isPrimary: false }
    ],
    "Descriptors": [
        { internalType: "JJ", display: "Adjective", tooltip: "Describes noun (blue, tall)", icon: "fas fa-ad", isPrimary: true },
        { internalType: "RB", display: "Adverb", tooltip: "Modifies verb (quickly, often)", icon: "fas fa-feather-alt", isPrimary: true },
        { internalType: "JJR", display: "Comparative", tooltip: "Comparison (faster, smaller)", icon: "fas fa-level-up-alt", isPrimary: false },
        { internalType: "JJS", display: "Superlative", tooltip: "Highest degree (best, tallest)", icon: "fas fa-medal", isPrimary: false },
        { internalType: "JJ_Number", display: "Ordered Number", tooltip: "A ranked number (1st, seventh)", icon: "fas fa-hashtag", isPrimary: true }
    ],
    "Other": [
        { internalType: "IN", display: "Preposition", tooltip: "Shows relation (in, under)", icon: "fas fa-arrows-alt", isPrimary: false },
        { internalType: "DT", display: "Determiner", tooltip: "Specifier (a, the)", icon: "fas fa-bookmark", isPrimary: false },
        { internalType: "CC", display: "Conjunction", tooltip: "Joins clauses (and, or)", icon: "fas fa-link", isPrimary: false },
        { internalType: "FW", display: "Foreign Word", tooltip: "Non-English (bonjour, sushi)", icon: "fas fa-globe", isPrimary: false },
        { internalType: "Number", display: "Number", tooltip: "Numerical (five, twenty)", icon: "fas fa-hashtag", isPrimary: true },
        { internalType: "Exclamation", display: "Exclamation", tooltip: "Interjection (wow, oops)", icon: "fas fa-bullhorn", isPrimary: true }
    ]
};

export const VERB_TENSES = [
    { value: 'VB', text: 'Base (run)' },
    { value: 'VBP', text: 'Present (I walk)' },
    { value: 'VBZ', text: 'Present 3rd (he leaves)' },
    { value: 'VBD', text: 'Past (slept)' },
    { value: 'VBG', text: 'Gerund (crying)' },
    { value: 'VBN', text: 'Past Participle (eaten)' }
];

// Helper function to insert a node at the caret position
export const insertNodeAtCaret = (node, range) => {
    if (range) {
        range.deleteContents();
        range.insertNode(node);
        const newRange = document.createRange();
        newRange.setStartAfter(node);
        newRange.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(newRange);
    } else {
        const sel = window.getSelection();
        if (sel.rangeCount) {
            const r = sel.getRangeAt(0);
            r.deleteContents();
            r.insertNode(node);
            r.setStartAfter(node);
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
        }
    }
};

// Ensure the editor has focus
export const ensureEditorFocus = () => {
    const editor = document.getElementById("storyText");
    const sel = window.getSelection();
    if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
        editor.focus();
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
};

// Insert a placeholder span at the caret position
export const insertPlaceholderSpan = (placeholderID, displayText, range) => {
    const span = document.createElement("span");
    span.className = "placeholder";
    span.setAttribute("data-id", placeholderID);
    span.setAttribute("title", placeholderID);
    span.setAttribute("contenteditable", "false");
    span.textContent = displayText;
    insertNodeAtCaret(span, range);

    // Append extra space if needed
    if (!displayText.endsWith(" ")) {
        if (span.parentNode) {
            let nextNode = span.nextSibling;
            if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                if (!/^\s/.test(nextNode.textContent)) {
                    span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
                }
            } else if (nextNode) {
                span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
            } else {
                span.parentNode.appendChild(document.createTextNode(" "));
            }
        }
    }
};

// Duplicate an existing placeholder
export const duplicatePlaceholder = (variable) => {
    state.usageTracker[variable.id] = (state.usageTracker[variable.id] || 0) + 1;
    const newId = variable.id;
    const editor = document.getElementById("storyText");
    let rangeToUse = (state.lastRange && editor.contains(state.lastRange.commonAncestorContainer))
        ? state.lastRange
        : (() => {
            ensureEditorFocus();
            const sel = window.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
        })();
    const displayText = variable.displayOverride || variable.officialDisplay;
    insertPlaceholderSpan(newId, displayText, rangeToUse);
    state.lastRange = null;
};

// Insert a new placeholder
export const insertPlaceholder = async (internalType, displayName, isCustom) => {
    const sanitized = Utils.sanitizeString(internalType);
    const editor = document.getElementById("storyText");
    const spans = editor.querySelectorAll(".placeholder");
    let max = 0;
    spans.forEach(span => {
        const id = span.getAttribute("data-id");
        if (id.startsWith(sanitized)) {
            const match = id.match(/(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > max) max = num;
            }
        }
    });
    const newCount = max + 1;
    state.variableCounts[sanitized] = newCount;
    const id = sanitized + newCount;
    let rangeToUse = (state.lastRange && editor.contains(state.lastRange.commonAncestorContainer))
        ? state.lastRange
        : (() => {
            ensureEditorFocus();
            const sel = window.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
        })();
    let selectedText = "";
    if (rangeToUse && !rangeToUse.collapsed) {
        selectedText = rangeToUse.toString().trim();
    }
    let displayText = selectedText || displayName;
    if (!selectedText) {
        const { value: temp } = await Swal.fire({
            title: 'Enter temporary word',
            input: 'text',
            inputLabel: 'Temporary fill word for this placeholder',
            inputValue: displayName,
            showCancelButton: true
        });
        if (temp) displayText = temp;
    }
    insertPlaceholderSpan(id, displayText, rangeToUse);
    if (!state.variables.some(v => v.id === id)) {
        state.variables.push({
            id,
            internalType,
            officialDisplay: displayName,
            display: displayName,
            isCustom: !!isCustom,
            order: state.insertionCounter++,
            displayOverride: displayText
        });
    }
    updateVariablesList();
    state.lastRange = null;
    if (internalType.startsWith("NN") && selectedText) {
        Swal.fire({
            title: 'Apply placeholder to all occurrences?',
            text: `Replace all instances of "${selectedText}" with this placeholder?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, apply',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                applyPlaceholderToAllOccurrences(selectedText, id, displayText);
            }
        });
    }
};

// Apply placeholder to all occurrences of text in the story
export const applyPlaceholderToAllOccurrences = (text, id, displayText) => {
    const editor = document.getElementById("storyText");
    const textNodes = [];
    const getTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.includes(text)) {
                textNodes.push(node);
            }
        } else if (node.childNodes && node.childNodes.length > 0) {
            node.childNodes.forEach(child => {
                if (!child.classList || !child.classList.contains('placeholder')) {
                    getTextNodes(child);
                }
            });
        }
    };

    getTextNodes(editor);
    
    for (let i = textNodes.length - 1; i >= 0; i--) {
        const node = textNodes[i];
        const content = node.textContent;
        const parts = content.split(text);
        if (parts.length > 1) {
            const parent = node.parentNode;
            const fragment = document.createDocumentFragment();
            
            for (let j = 0; j < parts.length; j++) {
                if (parts[j]) {
                    fragment.appendChild(document.createTextNode(parts[j]));
                }
                if (j < parts.length - 1) {
                    const span = document.createElement("span");
                    span.className = "placeholder";
                    span.setAttribute("data-id", id);
                    span.setAttribute("title", id);
                    span.setAttribute("contenteditable", "false");
                    span.textContent = displayText;
                    fragment.appendChild(span);
                    fragment.appendChild(document.createTextNode(" "));
                }
            }
            
            parent.replaceChild(fragment, node);
        }
    }
    updateVariablesFromEditor();
};

// Custom placeholder functions
export const addNewCustomPlaceholderWithUsage = (rawText, usage) => {
    let internal;
    if (usage === "noun") {
        internal = "NN_" + Utils.pascalCase(rawText);
    } else if (usage === "verb") {
        internal = "VB_" + Utils.pascalCase(rawText);
    } else {
        internal = Utils.pascalCase(rawText);
    }
    if (!state.customPlaceholders.some(p => p.type === internal)) {
        state.customPlaceholders.push({ type: internal });
    }
};

export const addNewCustomPlaceholder = (rawText) => {
    const internal = Utils.pascalCase(rawText);
    if (!state.customPlaceholders.some(p => p.type === internal)) {
        state.customPlaceholders.push({ type: internal });
    }
};

export const insertPlaceholderFromCustom = (rawText) => {
    const internal = Utils.pascalCase(rawText);
    const display = Utils.naturalDisplay(internal);
    insertPlaceholder(internal, display, true);
};

// Update the variables list display
export const updateVariablesList = () => {
    const container = document.getElementById('existingPlaceholdersContainer');
    container.innerHTML = '';
    state.variables.sort((a, b) =>
        (state.usageTracker[b.id] || 0) - (state.usageTracker[a.id] || 0) || a.order - b.order
    );
    state.variables.forEach(v => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-secondary btn-sm m-1 placeholder-item';
        btn.setAttribute('data-id', v.id);
        btn.textContent = v.displayOverride || v.officialDisplay;
        btn.setAttribute('title', v.id);
        container.appendChild(btn);
    });
};

// Pronoun placeholder insertion
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

// Update variables from editor content
export const updateVariablesFromEditor = () => {
    state.variables = [];
    state.variableCounts = {};
    state.insertionCounter = 0;
    const editor = document.getElementById('storyText');
    const placeholderElements = editor.querySelectorAll('.placeholder');
    placeholderElements.forEach(el => {
        const id = el.getAttribute('data-id');
        const base = id.replace(/\d+$/, '');
        const numMatch = id.match(/(\d+)$/);
        const num = numMatch ? parseInt(numMatch[1], 10) : 0;
        if (!state.variableCounts[base] || num > state.variableCounts[base]) {
            state.variableCounts[base] = num;
        }
        if (!state.variables.some(v => v.id === id)) {
            let variableEntry;
            const custom = state.customPlaceholders.find(p => p.type === base);
            if (custom) {
                variableEntry = {
                    id,
                    internalType: custom.type,
                    officialDisplay: TypeHelpers.naturalizeType(custom.type),
                    display: TypeHelpers.naturalizeType(custom.type),
                    isCustom: true,
                    order: state.insertionCounter++,
                    displayOverride: el.textContent
                };
            } else {
                const guessed = TypeHelpers.guessTypeFromId(id);
                const originalDisplay = TypeHelpers.getOriginalDisplayForType(guessed) || guessed;
                variableEntry = {
                    id,
                    internalType: guessed,
                    officialDisplay: originalDisplay,
                    display: originalDisplay,
                    order: state.insertionCounter++,
                    displayOverride: el.textContent
                };
            }
            state.variables.push(variableEntry);
        }
    });

    const currentSearch = $('#placeholderSearch').val() || '';
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentSearch);

    const currentModalSearch = $('#modalPlaceholderSearch').val() || '';
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalSearch);

    updateVariablesList();
};

// Convert editor content to text format with placeholders
export const generateLegacyText = () => {
    const editor = document.getElementById("storyText");
    const traverse = (node) => {
        let result = "";
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                result += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName.toLowerCase() === "br") {
                    result += "\n";
                } else if (child.classList.contains("placeholder")) {
                    result += "{" + child.getAttribute("data-id") + "}";
                } else {
                    result += traverse(child);
                    const tag = child.tagName.toLowerCase();
                    if (tag === "div" || tag === "p") result += "\n";
                }
            }
        });
        return result;
    };
    return traverse(editor);
};

// Placeholder Accordion UI Functions
export const updatePlaceholderAccordion = (accordionSelector, noResultsSelector, searchVal = '') => {
    if (noResultsSelector === "#noResults") {
        $("#searchQuery").text(searchVal);
        $("#searchQueryBtn").text(searchVal);
    } else if (noResultsSelector === "#modalNoResults") {
        $("#modalSearchQuery").text(searchVal);
        $("#modalSearchQueryBtn").text(searchVal);
    }
    $(noResultsSelector).hide();
    const accordion = $(accordionSelector);
    accordion.empty();
    categoryOrder.forEach(categoryName => {
        const placeholders = allPlaceholders[categoryName] || [];
        if (placeholders.length > 0) {
            const categoryCard = createPlaceholderCategoryCard(categoryName, accordionSelector, placeholders, searchVal);
            accordion.append(categoryCard);
        }
    });
    if (state.customPlaceholders.length > 0) {
        const customCard = createCustomPlaceholderCategoryCard(accordionSelector, searchVal);
        accordion.append(customCard);
    }
    if (searchVal) {
        const anyShown = accordion.find('.placeholder-btn:visible').length > 0;
        $(noResultsSelector).toggle(!anyShown);
        accordion.find('.card-header, .show-more-toggle').hide();
    } else {
        accordion.find('.card-header, .show-more-toggle').show();
    }
};

export const createPlaceholderCategoryCard = (categoryName, accordionSelector, placeholders, searchVal) => {
    const sanitizedCategoryName = categoryName.replace(/\s+/g, '');
    const card = $(`<div class='card'></div>`);
    card.append(createCardHeader(categoryName, sanitizedCategoryName, accordionSelector));
    const collapseDiv = $(`
  <div id='${sanitizedCategoryName}Collapse' class='collapse show' aria-labelledby='${sanitizedCategoryName}Heading' data-parent='${accordionSelector}'>
    <div class='card-body'><div class='list-group'></div></div>
  </div>
`);
    const primaryItems = placeholders.filter(p => p.isPrimary);
    const secondaryItems = placeholders.filter(p => !p.isPrimary);
    primaryItems.forEach(p => appendPlaceholderItem(collapseDiv.find('.list-group'), p, searchVal));
    if (secondaryItems.length > 0) {
        const secondaryPlaceholderWrapper = createSecondaryPlaceholderWrapper(secondaryItems, searchVal);
        collapseDiv.find('.list-group').append(secondaryPlaceholderWrapper);
        collapseDiv.find('.list-group').append(createShowMoreToggle(sanitizedCategoryName));
        updateShowMoreToggleVisibility(collapseDiv, searchVal, secondaryPlaceholderWrapper);
    }
    card.append(collapseDiv);
    return card;
};

export const createCustomPlaceholderCategoryCard = (accordionSelector, searchVal) => {
    const card = $(`<div class='card'></div>`);
    card.append(createCardHeader('Custom Placeholders', 'CustomPlaceholders', accordionSelector));
    const collapseDiv = $(`
  <div id='CustomPlaceholdersCollapse' class='collapse show' aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
    <div class='card-body'><div class='list-group'></div></div>
  </div>
`);
    state.customPlaceholders.forEach(p => {
        const showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
        const item = $(`
    <div class='list-group-item placeholder-btn custom-placeholder'
      data-internal='${p.type}'
      data-display='${p.type}'
      style='display: ${showItem ? 'block' : 'none'};'>
      <i class='fas fa-star'></i> ${p.type}
    </div>
  `);
        collapseDiv.find('.list-group').append(item);
    });
    card.append(collapseDiv);
    return card;
};

export const createCardHeader = (categoryName, sanitizedCategoryName, accordionSelector) => {
    return $(`
  <div class='card-header' id='${sanitizedCategoryName}Heading'>
    <h2 class='mb-0'>
      <button class='btn btn-link btn-block text-left' type='button'
        data-toggle='collapse' data-target='#${sanitizedCategoryName}Collapse'
        aria-expanded='true' aria-controls='${sanitizedCategoryName}Collapse'>
        ${categoryName}
      </button>
    </h2>
  </div>
`);
};

export const createSecondaryPlaceholderWrapper = (secondaryItems, searchVal) => {
    const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
    secondaryItems.forEach(p => appendPlaceholderItem(hiddenWrapper, p, searchVal, true));
    return hiddenWrapper;
};

export const createShowMoreToggle = (sanitizedCategoryName) => {
    return $(`
  <div class='show-more-toggle' data-category='${sanitizedCategoryName}'>
    Show More
  </div>
`);
};

export const updateShowMoreToggleVisibility = (collapseDiv, searchVal, secondaryPlaceholderWrapper) => {
    const toggleLink = collapseDiv.find('.show-more-toggle');
    if (!searchVal) {
        secondaryPlaceholderWrapper.find('.secondary-placeholder').hide();
        toggleLink.text('Show More');
    } else {
        let anySecondaryVisible = secondaryPlaceholderWrapper.find('.secondary-placeholder:visible').length > 0;
        toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
    }
};

export const appendPlaceholderItem = (listGroup, placeholder, searchVal, isSecondary = false) => {
    const showItem = !searchVal || placeholder.display.toLowerCase().includes(searchVal.toLowerCase());
    const item = $(`
  <div class='list-group-item placeholder-btn${isSecondary ? ' secondary-placeholder' : ''}'
    data-internal='${placeholder.internalType}'
    data-display='${placeholder.display}'
    style='display: ${showItem ? 'block' : 'none'};'>
    <i class='${placeholder.icon}'></i> ${placeholder.display}
    <i class='fas fa-info-circle accordion-info-icon' data-tooltip="${placeholder.tooltip}" style="font-size:0.8em; margin-left:5px;"></i>
  </div>
`);
    listGroup.append(item);
};

// Type selection modals
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

// Update existing placeholder
export const updateExistingPlaceholder = (variable, newInternalType, newDisplayName) => {
    const id = variable.id;
    const editor = document.getElementById("storyText");
    const spans = editor.querySelectorAll(`.placeholder[data-id="${id}"]`);
    spans.forEach(span => {
        span.setAttribute("title", `${id} (${newInternalType})`);
    });
    variable.internalType = newInternalType;
    variable.officialDisplay = newDisplayName;
    variable.display = newDisplayName;
    updateVariablesList();
};

// Pronoun functions
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