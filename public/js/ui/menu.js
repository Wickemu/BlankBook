    // Start of Selection
    // public/js/ui/menu.js
    import state from '../core/state.js';
    import { StringUtils } from '../utils/StringUtils.js';
    import { duplicatePlaceholder, insertPlaceholder, updateVariablesList, updateVariablesFromEditor, applyPlaceholderToAllOccurrences } from '../core/placeholders.js';
    
    // Menu element references
    let selectionMenu;
    let placeholderEditMenu;
    
    // Helper function to position menu near an element
    export const positionMenu = (menu, rect) => {
        menu.style.display = 'block';
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const offset = 10;
        
        // Calculate position - center horizontally over the placeholder
        let desiredLeft = window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2);
        desiredLeft = Math.max(window.scrollX + 5, Math.min(desiredLeft, window.scrollX + window.innerWidth - menuWidth - 5));
        
        // Position below element by default (to avoid mobile device system menus)
        // Only position above if there's no room below
        let desiredTop;
        const spaceBelow = window.innerHeight - (rect.bottom - window.scrollY);
        
        if (spaceBelow >= menuHeight + offset) {
            // Position below the element - preferred
            desiredTop = window.scrollY + rect.bottom + offset;
            menu.classList.add('menu-position-bottom');
            menu.classList.remove('menu-position-top');
        } else {
            // If no space below, position above
            desiredTop = window.scrollY + rect.top - menuHeight - offset;
            menu.classList.add('menu-position-top');
            menu.classList.remove('menu-position-bottom');
        }
        
        menu.style.top = desiredTop + 'px';
        menu.style.left = desiredLeft + 'px';
    };
    
    // Hide a menu
    export const hideMenu = (menu) => { 
        if (menu) menu.style.display = 'none'; 
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
        selectionMenu.className = 'floating-menu';
        selectionMenu.innerHTML = `
        <div class="placeholder-menu-row">
          <button id="newPlaceholderBtn" class="btn btn-sm btn-primary fixed-size-btn">New Placeholder</button>
          <button id="reusePlaceholderBtn" class="btn btn-sm btn-secondary fixed-size-btn">Reuse Placeholder</button>
        </div>
      `;
        document.body.appendChild(selectionMenu);
    
        // Create placeholder edit menu for modifying existing placeholders
        placeholderEditMenu = document.createElement('div');
        placeholderEditMenu.id = 'placeholderEditMenu';
        placeholderEditMenu.className = 'floating-menu';
        placeholderEditMenu.innerHTML = `
        <div class="placeholder-menu-row">
          <button id="editPlaceholderBtn" class="btn btn-sm btn-primary fixed-size-btn">Change</button>
          <button id="editOverrideBtn" class="btn btn-sm btn-secondary fixed-size-btn">Rename</button>
        </div>
        <div class="placeholder-menu-row">
          <button id="replaceAllBtn" class="btn btn-sm btn-warning fixed-size-btn">Find All</button>
          <button id="deletePlaceholderBtn" class="btn btn-sm btn-danger fixed-size-btn">Delete</button>
        </div>
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
        // Reset any previously saved selection data
        state.lastSelectedText = '';
        
        // Save the current selected text to state before hiding the selection menu
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
            state.lastSelectedText = sel.toString().trim();
            console.log("Selection menu: Saved selected text:", state.lastSelectedText);
        } else {
            console.log("Selection menu: No text selected");
        }
        
        hideMenu(selectionMenu);
        $('#placeholderModal').modal('show');
    };
    
    // Handle "Reuse Placeholder" button click
    export const handleReusePlaceholder = () => {
        // Reset any previously saved selection data
        state.lastSelectedText = '';
        
        // Save the current selected text to state before hiding the selection menu
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
            state.lastSelectedText = sel.toString().trim();
            console.log("Reuse placeholder menu: Saved selected text:", state.lastSelectedText);
        } else {
            console.log("Reuse placeholder menu: No text selected");
        }
        
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
    
    // Handle "Replace All" button click in placeholder edit menu
    export const handleReplaceAll = () => {
        hideMenu(placeholderEditMenu);
        
        // Make sure we have the current placeholder element and variable
        if (!state.currentPlaceholderElement || !state.currentEditingVariable) {
            console.error("Missing placeholder element or variable for replace all");
            resetCurrentEditing();
            return;
        }
        
        // Get the text from the placeholder
        const placeholderText = state.currentPlaceholderElement.textContent.trim();
        if (!placeholderText) {
            console.error("Placeholder has no text to search for");
            resetCurrentEditing();
            return;
        }
        
        const placeholderId = state.currentEditingVariable.id;
        if (!placeholderId) {
            console.error("Placeholder has no ID");
            resetCurrentEditing();
            return;
        }
        
        // Count occurrences of the text in the editor
        const editor = document.getElementById("storyText");
        const editorContent = editor.textContent;
        const occurrences = (editorContent.match(new RegExp(`\\b${StringUtils.escapeRegExp(placeholderText)}\\b`, 'g')) || []).length;
        
        // If there's only one occurrence (the placeholder itself), notify the user
        if (occurrences <= 1) {
            Swal.fire({
                title: 'No other occurrences found',
                text: `No other instances of "${placeholderText}" were found in your story.`,
                icon: 'info'
            });
            resetCurrentEditing();
            return;
        }
        
        // Ask user to confirm replacing all occurrences
        Swal.fire({
            title: 'Multiple occurrences found',
            html: `Found <strong>${occurrences-1}</strong> other instance(s) of "<strong>${placeholderText}</strong>" in your story.<br>Would you like to replace all these instances with this placeholder?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, replace all',
            cancelButtonText: 'No, cancel'
        }).then(result => {
            if (result.isConfirmed) {
                console.log(`Replacing all occurrences of "${placeholderText}" with placeholder ${placeholderId}`);
                
                // Use the existing function to perform the replacement
                applyPlaceholderToAllOccurrences(placeholderText, placeholderId, placeholderText);
            }
        });
        
        resetCurrentEditing();
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
        document.getElementById('replaceAllBtn').addEventListener('click', handleReplaceAll);
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