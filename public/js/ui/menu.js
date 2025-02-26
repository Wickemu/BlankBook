    // Start of Selection
    // public/js/ui/menu.js
    import state from '../core/state.js';
    import { duplicatePlaceholder, insertPlaceholder } from '../core/placeholders.js';
    
    // Menu element references
    let selectionMenu;
    let placeholderEditMenu;
    
    // Helper function to position menu near an element
    export const positionMenu = (menu, rect) => {
        menu.style.display = 'block';
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const offset = 5;
        let desiredTop = (rect.bottom + offset + menuHeight <= window.innerHeight)
            ? window.scrollY + rect.bottom + offset
            : window.scrollY + rect.top - menuHeight - offset;
        let desiredLeft = window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2);
        desiredLeft = Math.max(window.scrollX + 5, Math.min(desiredLeft, window.scrollX + window.innerWidth - menuWidth - 5));
        menu.style.top = desiredTop + 'px';
        menu.style.left = desiredLeft + 'px';
    };
    
    // Hide a menu
    export const hideMenu = (menu) => { 
        menu.style.display = 'none'; 
    };
    
    // Hide all menus
    export const hideAllMenus = () => { 
        hideMenu(selectionMenu); 
        hideMenu(placeholderEditMenu); 
    };
    
    // Reset current editing state
    const resetCurrentEditing = () => {
        state.currentEditingVariable = null;
        state.currentPlaceholderElement = null;
    };
    
    // Initialize the context menus
    export const initMenus = () => {
        // Create selection menu for text selections
        selectionMenu = document.createElement('div');
        selectionMenu.id = 'textSelectionMenu';
        Object.assign(selectionMenu.style, {
            position: 'absolute',
            display: 'none',
            zIndex: '1000',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '5px',
            borderRadius: '4px',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
        });
        selectionMenu.innerHTML = `
        <button id="newPlaceholderBtn" class="btn btn-sm btn-primary">New Placeholder</button>
        <button id="reusePlaceholderBtn" class="btn btn-sm btn-secondary">Reuse Placeholder</button>
      `;
        document.body.appendChild(selectionMenu);
    
        // Create placeholder edit menu for modifying existing placeholders
        placeholderEditMenu = document.createElement('div');
        placeholderEditMenu.id = 'placeholderEditMenu';
        Object.assign(placeholderEditMenu.style, {
            position: 'absolute',
            display: 'none',
            zIndex: '1000',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '5px',
            borderRadius: '4px',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
        });
        placeholderEditMenu.innerHTML = `
        <button id="editPlaceholderBtn" class="btn btn-sm btn-primary">Change Placeholder</button>
        <button id="editOverrideBtn" class="btn btn-sm btn-secondary">Change Override</button>
        <button id="deletePlaceholderBtn" class="btn btn-sm btn-danger">Delete</button>
      `;
        document.body.appendChild(placeholderEditMenu);
    
        // Attach event listeners
        attachMenuEventListeners();
    };
    
    // Handle text selection to show the selection menu
    export const handleTextSelection = () => {
        setTimeout(() => {
            const sel = window.getSelection();
            if (sel && sel.toString().trim().length > 0) {
                if (sel.anchorNode && sel.anchorNode.parentNode &&
                    !sel.anchorNode.parentNode.classList.contains('placeholder')) {
                    state.lastRange = sel.getRangeAt(0);
                    const rect = state.lastRange.getBoundingClientRect();
                    positionMenu(selectionMenu, rect);
                }
            } else {
                hideMenu(selectionMenu);
            }
        }, 0);
    };
    
    // Show the placeholder edit menu when a placeholder is clicked
    export const handlePlaceholderClick = (e) => {
        if (e.target.classList.contains('placeholder')) {
            // Stop propagation so that other handlers (e.g. selection menu) do not interfere
            e.stopPropagation();
            // Find the corresponding variable using the data-id attribute
            state.currentEditingVariable = state.variables.find(v => v.id === e.target.getAttribute('data-id'));
            state.currentPlaceholderElement = e.target;
            // Position the placeholder edit menu near the clicked element
            positionMenu(placeholderEditMenu, e.target.getBoundingClientRect());
        }
    };
    
    // Handle delete button click in placeholder edit menu
    export const handleDeletePlaceholder = () => {
        hideMenu(placeholderEditMenu);
        if (state.currentPlaceholderElement) {
            state.currentPlaceholderElement.remove();
        }
        // Update the variables in the editor after deletion
        if (typeof updateVariablesFromEditor === 'function') {
            updateVariablesFromEditor();
        }
        resetCurrentEditing();
    };
    
    // Handle edit placeholder button click
    export const handleEditPlaceholder = () => {
        hideMenu(placeholderEditMenu);
        state.isEditingPlaceholder = true;
        // Open the modal so the user can select a new placeholder type
        $('#placeholderModal').modal('show');
        resetCurrentEditing();
    };
    
    // Handle edit override button click
    export const handleEditOverride = async () => {
        hideMenu(placeholderEditMenu);
        const { value: newOverride } = await Swal.fire({
            title: 'Change Override',
            input: 'text',
            inputLabel: 'Enter new override text',
            inputValue: state.currentPlaceholderElement ? state.currentPlaceholderElement.textContent : ''
        });
        if (newOverride !== undefined) {
            if (state.currentPlaceholderElement) {
                state.currentPlaceholderElement.textContent = newOverride;
            }
            if (state.currentEditingVariable) {
                state.currentEditingVariable.displayOverride = newOverride;
            }
            if (typeof updateVariablesList === 'function') {
                updateVariablesList();
            }
        }
        resetCurrentEditing();
    };
    
    // Handle "New Placeholder" button click
    export const handleNewPlaceholder = () => {
        hideMenu(selectionMenu);
        $('#placeholderModal').modal('show');
    };
    
    // Handle "Reuse Placeholder" button click
    export const handleReusePlaceholder = () => {
        hideMenu(selectionMenu);
        if (state.variables.length === 0) {
            Swal.fire('No existing placeholders', 'There are no placeholders to reuse yet.', 'info');
            return;
        }
        const sortedVariables = [...state.variables].sort((a, b) =>
            (state.usageTracker[b.id] || 0) - (state.usageTracker[a.id] || 0) || a.order - b.order
        );
        let html = `<div id="reusePlaceholderContainer" style="display: flex; flex-wrap: wrap;">`;
        sortedVariables.forEach(v => {
            const displayText = v.displayOverride || v.officialDisplay;
            html += `<button type="button" 
                       class="btn btn-outline-secondary btn-sm m-1 reuse-placeholder-btn" 
                       data-id="${v.id}" 
                       title="${v.id}">
                 ${displayText}
               </button>`;
        });
        html += `</div>`;
        Swal.fire({
            title: 'Select a placeholder to reuse',
            html,
            showCancelButton: true,
            showConfirmButton: false,
            didOpen: () => {
                const container = Swal.getHtmlContainer();
                const btns = container.querySelectorAll('.reuse-placeholder-btn');
                btns.forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        const variable = state.variables.find(v => v.id === id);
                        if (variable) duplicatePlaceholder(variable);
                        Swal.close();
                    });
                });
            }
        });
    };
    
    // Attach event listeners to the menu elements
    const attachMenuEventListeners = () => {
        // Click outside menus to close them
        document.addEventListener('click', (e) => {
            if (!selectionMenu.contains(e.target) && !placeholderEditMenu.contains(e.target)) {
                hideAllMenus();
            }
        });
    
        // Text selection events
        document.getElementById('storyText').addEventListener('mouseup', handleTextSelection);
    
        // Placeholder click events
        document.getElementById('storyText').addEventListener('click', handlePlaceholderClick);
    
        // Menu button event handlers
        document.getElementById('newPlaceholderBtn').addEventListener('click', handleNewPlaceholder);
        document.getElementById('reusePlaceholderBtn').addEventListener('click', handleReusePlaceholder);
        document.getElementById('editPlaceholderBtn').addEventListener('click', handleEditPlaceholder);
        document.getElementById('editOverrideBtn').addEventListener('click', handleEditOverride);
        document.getElementById('deletePlaceholderBtn').addEventListener('click', handleDeletePlaceholder);
    };
    
    // Export menu elements for external access if needed
    export const getSelectionMenu = () => selectionMenu;
    export const getPlaceholderEditMenu = () => placeholderEditMenu;
    
    // Export the initialization of menus to be called from main.js
    export const initMenuSystem = () => {
        // Create menus if they don't exist yet
        if (!selectionMenu || !placeholderEditMenu) {
          initMenus();
        }
    };