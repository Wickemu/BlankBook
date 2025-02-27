// public/js/main.js

import state, { resetState, pronounMapping } from './core/state.js';
import { Utils, decodeHTMLEntities } from './utils/utils.js';
import { TypeHelpers } from './utils/typeHelpers.js';
import { Storage } from './data/storage.js';
import { 
    categoryOrder, 
    allPlaceholders,
    insertPlaceholder,
    updateVariablesList,
    updateVariablesFromEditor,
    generateLegacyText,
    showNounNumberSelection,
    showVerbTenseSelection,
    showPersonTypeSelection,
    updatePlaceholderAccordion,
    pickPronounFormAndGroup,
    insertPronounPlaceholderSimple,
    choosePronounTempValue,
    updateExistingPlaceholder,
    addCustomPlaceholder,
    insertPlaceholderFromCustom
} from './core/placeholders.js';
import { buildFillForm } from './ui/forms.js';
import { 
    positionMenu, 
    hideMenu, 
    hideAllMenus,
    initMenus,
    handleTextSelection,
    handlePlaceholderClick
} from './ui/menu.js';
import { initEvents } from './handlers/events.js';
import { 
    fillPlaceholders,
    resetStoryState,
    formatStoryForExport,
    createFilenameFromTitle
} from './core/storyProcessor.js';
import * as domUtils from './utils/domUtils.js';

(function () {
    "use strict";

    // Make Utils and decodeHTMLEntities available on window for legacy code
    window.Utils = Utils;
    window.decodeHTMLEntities = decodeHTMLEntities;

    // ====================================================
    // EVENT HANDLERS & DOCUMENT READY
    // ====================================================
    $(document).ready(() => {
        // Initialize the application
        initMenus();
        initEvents();
    });
})();