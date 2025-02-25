"use strict";
import { Utils, decodeHTMLEntities } from './utils.js';
import { variables, variableCounts, insertionCounter, lastRange } from './state.js';



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

export const duplicatePlaceholder = (variable) => {
    usageTracker[variable.id] = (usageTracker[variable.id] || 0) + 1;
    const newId = variable.id;
    const editor = document.getElementById("storyText");
    let rangeToUse = (lastRange && editor.contains(lastRange.commonAncestorContainer))
        ? lastRange
        : (() => {
            ensureEditorFocus();
            const sel = window.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
        })();
    const displayText = variable.displayOverride || variable.officialDisplay;
    insertPlaceholderSpan(newId, displayText, rangeToUse);
    lastRange = null;
};

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
    variableCounts[sanitized] = newCount;
    const id = sanitized + newCount;
    let rangeToUse = (lastRange && editor.contains(lastRange.commonAncestorContainer))
        ? lastRange
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
    if (!variables.some(v => v.id === id)) {
        variables.push({
            id,
            internalType,
            officialDisplay: displayName,
            display: displayName,
            isCustom: !!isCustom,
            order: insertionCounter++,
            displayOverride: displayText
        });
    }
    updateVariablesList();
    lastRange = null;
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

export const insertPronounPlaceholderSimple = (groupId, form, tempValue) => {
    const editor = document.getElementById("storyText");
    ensureEditorFocus();
    const sel = window.getSelection();
    const range = (lastRange && editor.contains(lastRange.commonAncestorContainer))
        ? lastRange
        : (sel.rangeCount ? sel.getRangeAt(0) : null);
    const groupNum = groupId.replace('PronounGroup', '');
    const formAbbrevMap = { subject: 'SUB', object: 'OBJ', possAdj: 'PSA', possPron: 'PSP', reflexive: 'REF' };
    const abbrev = formAbbrevMap[form] || form.toUpperCase();
    const placeholderId = `PRP${groupNum}${abbrev}`;
    if (!variables.some(v => v.id === placeholderId)) {
        const displayType = `Person (${form})`;
        variables.push({
            id: placeholderId,
            internalType: `PRONOUN|${groupId}|${form}`,
            officialDisplay: displayType,
            display: displayType,
            isCustom: false,
            order: insertionCounter++,
            displayOverride: tempValue
        });
        updateVariablesList();
    }
    insertPlaceholderSpan(placeholderId, tempValue, range);
    lastRange = null;
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

export const formatLabel = (variable) =>
    variable.displayOverride && variable.displayOverride !== variable.officialDisplay
        ? `${variable.displayOverride} (${variable.officialDisplay})`
        : variable.officialDisplay;

export const updateVariablesList = () => {
    const container = document.getElementById('existingPlaceholdersContainer');
    container.innerHTML = '';
    variables.sort((a, b) =>
        (usageTracker[b.id] || 0) - (usageTracker[a.id] || 0) || a.order - b.order
    );
    variables.forEach(v => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-secondary btn-sm m-1 placeholder-item';
        btn.setAttribute('data-id', v.id);
        btn.textContent = v.displayOverride || v.officialDisplay;
        btn.setAttribute('title', v.id);
        container.appendChild(btn);
    });
};

export const updateVariablesFromEditor = () => {
    variables = [];
    variableCounts = {};
    insertionCounter = 0;
    const editor = document.getElementById('storyText');
    const placeholderElements = editor.querySelectorAll('.placeholder');
    placeholderElements.forEach(el => {
        const id = el.getAttribute('data-id');
        const base = id.replace(/\d+$/, '');
        const numMatch = id.match(/(\d+)$/);
        const num = numMatch ? parseInt(numMatch[1], 10) : 0;
        if (!variableCounts[base] || num > variableCounts[base]) {
            variableCounts[base] = num;
        }
        if (!variables.some(v => v.id === id)) {
            let variableEntry;
            const custom = customPlaceholders.find(p => p.type === base);
            if (custom) {
                variableEntry = {
                    id,
                    internalType: custom.type,
                    officialDisplay: TypeHelpers.naturalizeType(custom.type),
                    display: TypeHelpers.naturalizeType(custom.type),
                    isCustom: true,
                    order: insertionCounter++,
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
                    order: insertionCounter++,
                    displayOverride: el.textContent
                };
            }
            variables.push(variableEntry);
        }
    });

    const currentSearch = $('#placeholderSearch').val() || '';
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentSearch);

    const currentModalSearch = $('#modalPlaceholderSearch').val() || '';
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalSearch);

    updateVariablesList();

};

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
    if (customPlaceholders.length > 0) {
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
    customPlaceholders.forEach(p => {
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


export const createShowMoreToggle = (sanitizedCategoryName) => {
    return $(`
      <div class="show-more-toggle" data-category="${sanitizedCategoryName}">
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
        const anySecondaryVisible = secondaryPlaceholderWrapper.find('.secondary-placeholder:visible').length > 0;
        toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
    }
};


export const appendPlaceholderItem = (listGroup, placeholder, searchVal, isSecondary = false) => {
    const showItem = !searchVal || placeholder.display.toLowerCase().includes(searchVal.toLowerCase());
    const item = $(`
      <div class="list-group-item placeholder-btn${isSecondary ? ' secondary-placeholder' : ''}"
        data-internal="${placeholder.internalType}"
        data-display="${placeholder.display}"
        style="display: ${showItem ? 'block' : 'none'};">
        <i class="${placeholder.icon}"></i> ${placeholder.display}
        <i class="fas fa-info-circle accordion-info-icon" data-tooltip="${placeholder.tooltip}" style="font-size:0.8em; margin-left:5px;"></i>
      </div>
    `);
    listGroup.append(item);
};


export const createSecondaryPlaceholderWrapper = (secondaryItems, searchVal) => {
    const hiddenWrapper = $('<div class="secondary-placeholder-wrapper"></div>');
    secondaryItems.forEach(p => {
        appendPlaceholderItem(hiddenWrapper, p, searchVal, true);
    });
    return hiddenWrapper;
};

export const addNewCustomPlaceholderWithUsage = (rawText, usage) => {
    let internal;
    if (usage === "noun") {
      internal = "NN_" + Utils.pascalCase(rawText);
    } else if (usage === "verb") {
      internal = "VB_" + Utils.pascalCase(rawText);
    } else {
      internal = Utils.pascalCase(rawText);
    }
    if (!customPlaceholders.some(p => p.type === internal)) {
      customPlaceholders.push({ type: internal });
    }
  };
  
  export const addNewCustomPlaceholder = (rawText) => {
    const internal = Utils.pascalCase(rawText);
    if (!customPlaceholders.some(p => p.type === internal)) {
      customPlaceholders.push({ type: internal });
    }
  };
  
  export const insertPlaceholderFromCustom = (rawText) => {
    const internal = Utils.pascalCase(rawText);
    const display = Utils.naturalDisplay(internal);
    insertPlaceholder(internal, display, true);
  };
  