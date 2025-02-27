import state from './state.js';
import { TypeHelpers } from '../utils/typeHelpers.js';
import { updatePlaceholderAccordion } from './placeholderUI.js';

/**
 * Updates the variables list display in the UI
 */
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

/**
 * Updates the variables array by scanning the editor for placeholders
 */
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

/**
 * Update existing placeholder
 * @param {Object} variable - The placeholder variable to update 
 * @param {string} newInternalType - The new internal type for the placeholder
 * @param {string} newDisplayName - The new display name for the placeholder
 */
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