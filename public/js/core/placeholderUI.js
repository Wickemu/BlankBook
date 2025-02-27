import state from './state.js';
import { categoryOrder, allPlaceholders } from './placeholderDefinitions.js';

/**
 * Updates the placeholder accordion display based on search
 * @param {string} accordionSelector - The CSS selector for the accordion
 * @param {string} noResultsSelector - The CSS selector for the no results element
 * @param {string} searchVal - The current search value
 */
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

/**
 * Creates a category card for the placeholder accordion
 * @param {string} categoryName - The name of the category
 * @param {string} accordionSelector - The CSS selector for the accordion
 * @param {Array} placeholders - The placeholders in this category
 * @param {string} searchVal - The current search value
 * @returns {jQuery} The created category card
 */
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

/**
 * Creates a category card for custom placeholders
 * @param {string} accordionSelector - The CSS selector for the accordion
 * @param {string} searchVal - The current search value
 * @returns {jQuery} The created category card
 */
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

/**
 * Creates a card header for a category
 * @param {string} categoryName - The name of the category
 * @param {string} sanitizedCategoryName - The sanitized name of the category
 * @param {string} accordionSelector - The CSS selector for the accordion
 * @returns {jQuery} The created card header
 */
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

/**
 * Creates a wrapper for secondary placeholders
 * @param {Array} secondaryItems - The secondary placeholder items
 * @param {string} searchVal - The current search value
 * @returns {jQuery} The created wrapper
 */
export const createSecondaryPlaceholderWrapper = (secondaryItems, searchVal) => {
    const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
    secondaryItems.forEach(p => appendPlaceholderItem(hiddenWrapper, p, searchVal, true));
    return hiddenWrapper;
};

/**
 * Creates a "Show More" toggle for a category
 * @param {string} sanitizedCategoryName - The sanitized name of the category
 * @returns {jQuery} The created toggle
 */
export const createShowMoreToggle = (sanitizedCategoryName) => {
    return $(`
  <div class='show-more-toggle' data-category='${sanitizedCategoryName}'>
    Show More
  </div>
`);
};

/**
 * Updates the visibility of the "Show More" toggle based on search
 * @param {jQuery} collapseDiv - The collapse div
 * @param {string} searchVal - The current search value
 * @param {jQuery} secondaryPlaceholderWrapper - The secondary placeholder wrapper
 */
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

/**
 * Appends a placeholder item to a list group
 * @param {jQuery} listGroup - The list group to append to
 * @param {Object} placeholder - The placeholder to append
 * @param {string} searchVal - The current search value
 * @param {boolean} isSecondary - Whether this is a secondary placeholder
 */
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