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