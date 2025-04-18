import state from './state.js';
import { duplicatePlaceholder } from './placeholderCreation.js';
import { allPlaceholders } from './placeholderDefinitions.js';

/**
 * Gets the icon for a placeholder based on its internal type
 * @param {string} internalType - The internal placeholder type
 * @returns {string} The Font Awesome icon class
 */
const getIconForType = (internalType) => {
    // First try a direct match
    for (const category in allPlaceholders) {
        const match = allPlaceholders[category].find(p => p.internalType === internalType);
        if (match && match.icon) {
            return match.icon;
        }
    }
    
    // Handle special cases for types without prefixes
    // These need explicit matching as they don't follow the prefix pattern
    const specialTypes = {
        'Number': 'fas fa-hashtag',
        'Exclamation': 'fas fa-bullhorn',
        'FW': 'fas fa-globe',
        'DT': 'fas fa-bookmark',
        'CC': 'fas fa-link',
        'IN': 'fas fa-arrows-alt',
        'DT_Quantifier': 'fas fa-calculator'
    };
    
    if (specialTypes[internalType]) {
        return specialTypes[internalType];
    }
    
    // If no direct match, try to match based on prefix
    // Most internal types follow patterns like NN_Animal, VB_Action, etc.
    if (internalType.includes('_')) {
        const prefix = internalType.split('_')[0];
        for (const category in allPlaceholders) {
            // Try to find a base type that matches the prefix
            const baseMatch = allPlaceholders[category].find(p => p.internalType === prefix);
            if (baseMatch && baseMatch.icon) {
                return baseMatch.icon;
            }
        }
    }
    
    // Try to match common prefixes to general categories
    if (internalType.startsWith('NN')) {
        return 'fas fa-book'; // Default noun icon
    } else if (internalType.startsWith('VB')) {
        return 'fas fa-pen'; // Default verb icon
    } else if (internalType.startsWith('JJ')) {
        return 'fas fa-ad'; // Default adjective icon
    } else if (internalType.startsWith('RB')) {
        return 'fas fa-feather-alt'; // Default adverb icon
    }
    
    // Default icon if not found
    return 'fas fa-tag';
};

/**
 * Updates the existing placeholder accordion display based on search
 * @param {string} accordionSelector - The CSS selector for the accordion
 * @param {string} noResultsSelector - The CSS selector for the no results element
 * @param {string} searchVal - The current search value
 */
export const updateExistingPlaceholderAccordion = (accordionSelector, noResultsSelector, searchVal = '') => {
    // Update search query display
    if (noResultsSelector === "#noExistingResults") {
        $("#existingSearchQuery").text(searchVal);
    } else if (noResultsSelector === "#modalNoExistingResults") {
        $("#modalExistingSearchQuery").text(searchVal);
    }
    
    $(noResultsSelector).hide();
    const accordion = $(accordionSelector);
    accordion.empty();
    
    // If no variables exist, show no results
    if (!state.variables || state.variables.length === 0) {
        $(noResultsSelector).show();
        return;
    }

    // Create a single card to contain all placeholders
    const card = $(`<div class='card'></div>`);
    
    // Add a card header for consistency with the new placeholders UI
    const cardHeader = $(`
        <div class='card-header'>
            <button class='btn btn-link collapsed' type='button' data-bs-toggle='collapse' 
                data-bs-target='#existingPlaceholdersCollapse'>
                <i class='fas fa-history me-2'></i> All Used Placeholders
                <i class='fas fa-chevron-down float-end mt-1'></i>
            </button>
        </div>
    `);
    
    // Add the card header to the card
    card.append(cardHeader);
    
    // We need a collapse div for consistency
    const collapseDiv = $(`
        <div id='existingPlaceholdersCollapse' class='collapse show'>
            <div class='card-body'>
                <div class='list-group'></div>
            </div>
        </div>
    `);
    
    // Add the collapse div to the card
    card.append(collapseDiv);
    
    // Sort all placeholders directly by usage count
    const allExistingPlaceholders = [...state.variables].sort((a, b) => 
        (state.usageTracker[b.id] || 0) - (state.usageTracker[a.id] || 0) || a.order - b.order
    );
    
    // Add all placeholders to the list
    allExistingPlaceholders.forEach(placeholder => {
        const showItem = !searchVal || 
            (placeholder.displayOverride && placeholder.displayOverride.toLowerCase().includes(searchVal.toLowerCase())) || 
            placeholder.officialDisplay.toLowerCase().includes(searchVal.toLowerCase());
        
        if (showItem) {
            const usageCount = state.usageTracker[placeholder.id] || 0;
            const iconClass = getIconForType(placeholder.internalType);
            
            const item = $(`
                <div class='list-group-item placeholder-btn existing-placeholder-btn'
                    data-id='${placeholder.id}'
                    data-bs-toggle="tooltip" 
                    title="ID: ${placeholder.id}">
                    <div class="d-flex align-items-center">
                        <i class="${iconClass} me-2" aria-hidden="true"></i>
                        <span class="placeholder-text">${placeholder.displayOverride || placeholder.officialDisplay}</span>
                    </div>
                    <div class="usage-count badge bg-primary">${usageCount} ${usageCount === 1 ? 'use' : 'uses'}</div>
                </div>
            `);
            collapseDiv.find('.list-group').append(item);
        }
    });
    
    // Add the card to the accordion
    accordion.append(card);
    
    // If searching, update visibility of headers
    if (searchVal) {
        const anyShown = accordion.find('.placeholder-btn:visible').length > 0;
        $(noResultsSelector).toggle(!anyShown);
        accordion.find('.card-header').hide();
    } else {
        accordion.find('.card-header').show();
    }
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
};

/**
 * Force an update of both existing placeholder accordions
 */
export const forceUpdateExistingPlaceholders = () => {
    const existingSearch = $('#existingPlaceholderSearch').val() || '';
    updateExistingPlaceholderAccordion('#existingPlaceholderAccordion', '#noExistingResults', existingSearch);
    
    const modalExistingSearch = $('#modalExistingPlaceholderSearch').val() || '';
    updateExistingPlaceholderAccordion('#modalExistingPlaceholderAccordion', '#modalNoExistingResults', modalExistingSearch);
};

/**
 * Initializes event handlers for existing placeholder buttons
 */
export const initExistingPlaceholderEvents = () => {
    // Attach click handlers for existing placeholder buttons
    $(document).on('click', '.existing-placeholder-btn', function() {
        const id = $(this).data('id');
        const variable = state.variables.find(v => v.id === id);
        if (variable) {
            duplicatePlaceholder(variable);
            // Close modal if it's open
            if ($('#placeholderModal').hasClass('show')) {
                $('#placeholderModal').modal('hide');
            }
        }
    });
    
    // Add search functionality for existing placeholders
    $('#existingPlaceholderSearch').on('input', function() {
        const searchVal = $(this).val().trim();
        updateExistingPlaceholderAccordion('#existingPlaceholderAccordion', '#noExistingResults', searchVal);
    });
    
    $('#modalExistingPlaceholderSearch').on('input', function() {
        const searchVal = $(this).val().trim();
        updateExistingPlaceholderAccordion('#modalExistingPlaceholderAccordion', '#modalNoExistingResults', searchVal);
    });
}; 