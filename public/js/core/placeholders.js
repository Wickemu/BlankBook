// public/js/core/placeholders.js

// Import from new modules
import { categoryOrder, allPlaceholders, VERB_TENSES } from './placeholderDefinitions.js';
import { insertNodeAtCaret, ensureEditorFocus, insertPlaceholderSpan, generateLegacyText } from './placeholderDOM.js';
import { duplicatePlaceholder, insertPlaceholder, applyPlaceholderToAllOccurrences, addCustomPlaceholder, insertPlaceholderFromCustom } from './placeholderCreation.js';
import { updateVariablesList, updateVariablesFromEditor, updateExistingPlaceholder } from './placeholderManagement.js';
import { updatePlaceholderAccordion, createPlaceholderCategoryCard, createCustomPlaceholderCategoryCard, createCardHeader, createSecondaryPlaceholderWrapper, createShowMoreToggle, updateShowMoreToggleVisibility, appendPlaceholderItem } from './placeholderUI.js';
import { showPersonTypeSelection, showNounNumberSelection, showVerbTenseSelection } from './typeSelectionModals.js';
import { insertPronounPlaceholderSimple, pickPronounFormAndGroup, pickPronounGroup, choosePronounTempValue } from './pronounFunctions.js';

// Re-export all functionality
export {
    // Constants
    categoryOrder,
    allPlaceholders,
    VERB_TENSES,
    
    // DOM Utilities
    insertNodeAtCaret,
    ensureEditorFocus,
    insertPlaceholderSpan,
    generateLegacyText,
    
    // Placeholder Creation
    duplicatePlaceholder,
    insertPlaceholder,
    applyPlaceholderToAllOccurrences,
    addCustomPlaceholder,
    insertPlaceholderFromCustom,
    
    // Placeholder Management
    updateVariablesList,
    updateVariablesFromEditor,
    updateExistingPlaceholder,
    
    // UI Functions
    updatePlaceholderAccordion,
    createPlaceholderCategoryCard,
    createCustomPlaceholderCategoryCard,
    createCardHeader,
    createSecondaryPlaceholderWrapper,
    createShowMoreToggle,
    updateShowMoreToggleVisibility,
    appendPlaceholderItem,
    
    // Type Selection Modals
    showPersonTypeSelection,
    showNounNumberSelection,
    showVerbTenseSelection,
    
    // Pronoun Functions
    insertPronounPlaceholderSimple,
    pickPronounFormAndGroup,
    pickPronounGroup,
    choosePronounTempValue
};

/**
 * Initialize all placeholder-related components and events
 */
export const initPlaceholders = () => {
    // Initialize new/existing placeholder toggle
    $('#newPlaceholderToggle, #modalNewPlaceholderToggle').on('click', function() {
        const isModal = $(this).attr('id').includes('modal');
        const prefix = isModal ? 'modal' : '';
        
        // Update active state
        $(`#${prefix}NewPlaceholderToggle`).addClass('active');
        $(`#${prefix}ExistingPlaceholderToggle`).removeClass('active');
        
        // Show/hide views
        $(`#${prefix}NewPlaceholderView`).show();
        $(`#${prefix}ExistingPlaceholderView`).hide();
    });
    
    $('#existingPlaceholderToggle, #modalExistingPlaceholderToggle').on('click', function() {
        const isModal = $(this).attr('id').includes('modal');
        const prefix = isModal ? 'modal' : '';
        
        // Update active state
        $(`#${prefix}NewPlaceholderToggle`).removeClass('active');
        $(`#${prefix}ExistingPlaceholderToggle`).addClass('active');
        
        // Show/hide views
        $(`#${prefix}NewPlaceholderView`).hide();
        $(`#${prefix}ExistingPlaceholderView`).show();
        
        // Force update of existing placeholder list
        const accordionSelector = isModal ? '#modalExistingPlaceholderAccordion' : '#existingPlaceholderAccordion';
        const noResultsSelector = isModal ? '#modalNoExistingResults' : '#noExistingResults';
        const searchVal = isModal ? $('#modalExistingPlaceholderSearch').val() : $('#existingPlaceholderSearch').val();
        
        // Import and call the function from existingPlaceholderUI.js
        import('./existingPlaceholderUI.js').then(module => {
            module.updateExistingPlaceholderAccordion(accordionSelector, noResultsSelector, searchVal);
        });
    });
    
    // Initialize placeholder search
    $('#placeholderSearch, #modalPlaceholderSearch').on('input', function() {
        const isModal = $(this).attr('id').includes('modal');
        const searchVal = $(this).val();
        const accordionSelector = isModal ? '#modalPlaceholderAccordion' : '#placeholderAccordion';
        const noResultsSelector = isModal ? '#modalNoResults' : '#noResults';
        
        // Use the same function for both main view and modal
        import('./placeholderUI.js').then(module => {
            module.updatePlaceholderAccordion(accordionSelector, noResultsSelector, searchVal);
        });
    });
    
    // Initialize existing placeholder search
    $('#existingPlaceholderSearch, #modalExistingPlaceholderSearch').on('input', function() {
        const isModal = $(this).attr('id').includes('modal');
        const searchVal = $(this).val();
        const accordionSelector = isModal ? '#modalExistingPlaceholderAccordion' : '#existingPlaceholderAccordion';
        const noResultsSelector = isModal ? '#modalNoExistingResults' : '#noExistingResults';
        
        // Use the same function for both main view and modal
        import('./existingPlaceholderUI.js').then(module => {
            module.updateExistingPlaceholderAccordion(accordionSelector, noResultsSelector, searchVal);
        });
    });
}; 