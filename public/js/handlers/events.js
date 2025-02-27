// public/js/handlers/events.js
import state from '../core/state.js';
import { Storage } from '../data/storage.js';
import { Utils } from '../utils/utils.js';
import { StringUtils } from '../utils/StringUtils.js';
import { TypeHelpers } from '../utils/typeHelpers.js';
import { 
    updatePlaceholderAccordion, 
    updateVariablesFromEditor, 
    generateLegacyText,
    addCustomPlaceholder,
    showNounNumberSelection,
    showVerbTenseSelection,
    insertPlaceholderFromCustom,
    pickPronounFormAndGroup,
    updateVariablesList,
    duplicatePlaceholder,
    updateExistingPlaceholder,
    insertPlaceholder,
    showPersonTypeSelection
} from '../core/placeholders.js';
import { buildFillForm, validateInputForm } from '../ui/forms.js';
import { 
    fillPlaceholders, 
    parseStoryFile, 
    formatStoryForExport, 
    createFilenameFromTitle,
    resetStoryState
} from '../core/storyProcessor.js';
import * as domUtils from '../utils/domUtils.js';
import Swal from 'sweetalert2'; // Ensure Swal is imported if used
import { showToast } from '../ui/notifications.js';

// Handle placeholder button click
const handlePlaceholderClick = (internalType, displayName) => {
    if (state.isEditingPlaceholder && state.currentEditingVariable) {
        updateExistingPlaceholder(state.currentEditingVariable, internalType, displayName);
        state.isEditingPlaceholder = false;
        state.currentEditingVariable = null;
        $('#placeholderModal').modal('hide');
    } else {
        if (internalType === "PRONOUN") {
            pickPronounFormAndGroup();
            $('#placeholderSearch').val('');
            updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
            return;
        }
        if (internalType.startsWith("NN")) {
            if (internalType === "NN_Person") {
                showPersonTypeSelection(internalType, displayName);
                $('#placeholderSearch').val('');
                updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
                return;
            }
            showNounNumberSelection(internalType, displayName);
            $('#placeholderSearch').val('');
            updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
            return;
        }

        if (internalType.startsWith("VB") || internalType === "MD") {
            showVerbTenseSelection(internalType, displayName);
            $('#placeholderSearch').val('');
            updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
            return;
        }
        insertPlaceholder(internalType, displayName, false);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
    }
};

// Handle create new story button click
const handleCreateNewStory = (e) => {
    e.preventDefault();
    if (state.storyHasUnsavedChanges) {
        domUtils.confirmDialog({
            title: 'Unsaved changes',
            text: 'Your story has unsaved changes. Would you like to save it to the site before starting a new one?',
            showDenyButton: true,
            confirmButtonText: 'Save and start new',
            denyButtonText: 'Discard changes'
        }).then((result) => {
            if (result.isConfirmed) {
                Storage.addCurrentStoryToSavedStories();
                setTimeout(resetStoryState, 1000);
            } else if (result.isDenied) {
                domUtils.confirmDialog({
                    title: 'Are you sure?',
                    text: 'This will discard your current unsaved story.',
                    confirmButtonText: 'Yes, start new'
                }).then((res) => {
                    if (res.isConfirmed) resetStoryState();
                });
            }
        });
    } else {
        domUtils.confirmDialog({
            title: 'Are you sure?',
            text: 'This will discard your current story.',
            confirmButtonText: 'Yes, start new'
        }).then((res) => {
            if (res.isConfirmed) resetStoryState();
        });
    }
};

// Handle generate story button click
const handleGenerateStory = () => {
    // Use the form validation function from forms.js
    if (!validateInputForm()) {
        return; // Validation failed
    }
    
    // Collect values from the input form
    const inputForm = document.getElementById('inputForm');
    const inputs = inputForm.querySelectorAll('input[type="text"]');
    
    // Reset fillValues
    state.fillValues = {};
    
    // Populate fillValues with the values from the input fields
    inputs.forEach(input => {
        const id = input.getAttribute('data-id');
        if (id && input.value.trim() !== '') {
            state.fillValues[id] = input.value.trim();
            console.log(`Collected input value for ${id}: "${input.value.trim()}"`);
        }
    });
    
    // Generate the final story with replacements
    let final = generateLegacyText();
    final = fillPlaceholders(final, state.variables, state.fillValues, state.pronounGroups);
    
    // Update the result display
    $('#finalStory').text(final);
    $('#displayTitle').text($('#storyTitle').val());
    $('#displayAuthor').text($('#storyAuthor').val());
    $('#displayTags').text($('#storyTags').val());
    $('#result').removeClass('d-none');
    $('#inputs').addClass('d-none');
};

// Handle save story to site button
const handleSaveStoryToSite = () => {
    Swal.fire({
        title: 'Save Story',
        html: `
          <input type="text" id="swalTitle" class="swal2-input" placeholder="Story Title" value="${$('#storyTitle').val()}">
          <input type="text" id="swalAuthor" class="swal2-input" placeholder="Author" value="${$('#storyAuthor').val()}">
          <input type="text" id="swalTags" class="swal2-input" placeholder="Tags (comma separated)" value="${$('#storyTags').val()}">
          <input type="password" id="swalPassword" class="swal2-input" placeholder="Password (optional)">
          <div id="preexistingTagsContainer" style="text-align:left; margin-top:10px;"></div>
        `,
        didOpen: () => {
          loadPreexistingTags();
        },
        showCancelButton: true,
        confirmButtonText: 'Save',
        preConfirm: () => {
          return {
            title: document.getElementById('swalTitle').value,
            author: document.getElementById('swalAuthor').value,
            tags: document.getElementById('swalTags').value,
            password: document.getElementById('swalPassword').value
          };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const data = result.value;
            // Update fields in the editor
            $('#storyTitle').val(data.title);
            $('#storyAuthor').val(data.author);
            $('#storyTags').val(data.tags);
            
            let story = {
                storyTitle: data.title,
                storyAuthor: data.author,
                storyText: $('#storyText').html(),
                variables: state.variables,
                pronounGroups: state.pronounGroups,
                variableCounts: state.variableCounts,
                pronounGroupCount: state.pronounGroupCount,
                customPlaceholders: state.customPlaceholders,
                tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
                savedAt: new Date().toISOString(),
                password: data.password && data.password.trim() !== '' ? data.password : null
            };
            
            $.ajax({
                url: '/api/savestory',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(story),
                success: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Story saved to site!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                error: (xhr, statusText, errorThrown) => {
                    if (xhr.status === 409) {
                        Swal.fire({
                            title: 'Story exists',
                            text: 'A story with this title already exists. Overwrite?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Yes, overwrite',
                            cancelButtonText: 'No'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                story.overwrite = true;
                                $.ajax({
                                    url: '/api/savestory',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify(story),
                                    success: () => {
                                        Swal.fire({
                                            toast: true,
                                            position: 'top-end',
                                            icon: 'success',
                                            title: 'Story overwritten!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                    },
                                    error: (xhrOverwrite, statusTextOverwrite, errorThrownOverwrite) => {
                                        Storage.handleAjaxError(xhrOverwrite, statusTextOverwrite, errorThrownOverwrite, 'Failed to overwrite story');
                                    }
                                });
                            }
                        });
                    } else {
                        Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save story');
                    }
                }
            });
        }
    });
};

// Load preexisting tags for tag selector
const loadPreexistingTags = () => {
    $.ajax({
        url: '/api/gettags',
        method: 'GET',
        success: (tags) => {
            let container = $('#preexistingTagsContainer');
            container.empty();
            if (tags.length > 0) {
                container.append('<p>Select a tag:</p>');
                tags.forEach(tag => {
                    const btn = $('<button type="button" class="btn btn-sm btn-outline-secondary m-1 preexisting-tag-btn"></button>');
                    btn.text(tag);
                    btn.on('click', () => {
                        let current = $('#swalTags').val();
                        let tagsArr = current ? current.split(',').map(t => t.trim()).filter(Boolean) : [];
                        if (!tagsArr.includes(tag)) {
                            tagsArr.push(tag);
                            $('#swalTags').val(tagsArr.join(', '));
                        }
                    });
                    container.append(btn);
                });
            }
        },
        error: (err) => {
            console.error('Failed to load preexisting tags', err);
        }
    });
};

// Attach all event handlers
export const initEvents = () => {
    // Placeholder button click handler
    $(document).on('click', '.placeholder-btn', function() {
        const internalType = $(this).data('internal');
        const displayName = $(this).data('display');
        handlePlaceholderClick(internalType, displayName);
    });
    
    // Fill info icon click handler
    $(document).on('click', '.fill-info-icon', (e) => {
        e.stopPropagation();
        const type = $(e.currentTarget).data('type');
        const tooltip = TypeHelpers.getTooltipForType(type);
        domUtils.showToast(tooltip, 'info');
    });
    
    // Add accordion info icon click handler
    $(document).on('click', '.accordion-info-icon', (e) => {
        e.stopPropagation();
        const tooltip = $(e.currentTarget).data('tooltip');
        domUtils.showToast(tooltip, 'info');
    });
    
    // Show more toggle event handler
    $(document).on('click', '.show-more-toggle', function () {
        const parentList = $(this).closest('.list-group');
        const hiddenItems = parentList.find('.secondary-placeholder-wrapper .secondary-placeholder');
        const link = $(this);
        link.text(link.text() === 'Show More' ? 'Show Less' : 'Show More');
        hiddenItems.toggle();
    });
    
    // Add copy to clipboard handler
    $('#copyStory').on('click', () => {
        const finalText = $('#finalStory').text();
        domUtils.copyToClipboard(finalText);
    });

    // Selection changes
    document.addEventListener('selectionchange', () => {
        const editor = document.getElementById("storyText");
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
            state.lastRange = sel.getRangeAt(0);
        }
    });

    // Attach search handlers with a reduced debounce delay (50ms)
    $('#placeholderSearch').on('input', Utils.debounce(function () {
        const searchVal = $(this).val();
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', searchVal);
        $('#addCustomPlaceholderBtn').text('Add "' + searchVal + '"');
    }, 50));

    $('#modalPlaceholderSearch').on('input', Utils.debounce(function () {
        const searchVal = $(this).val();
        updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', searchVal);
        $('#modalAddCustomPlaceholderBtn').text('Add "' + searchVal + '"');
    }, 50));

    // Init accordions
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', state.currentModalPlaceholderSearch);
    
    // Filter tag input handler
    $('#filterTag').on('input', Utils.debounce(() => {
        Storage.loadSavedStoriesList();
    }, 300));

    // Sort option change handler
    $('#sortOption').on('change', () => {
        Storage.loadSavedStoriesList();
    });

    // Alphabetical order button
    $('#alphabeticalOrderBtn').on('click', function () {
        state.fillOrder = 'alphabetical';
        $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
        $('#randomOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
        buildFillForm();
    });

    // Random order button
    $('#randomOrderBtn').on('click', function () {
        state.fillOrder = 'random';
        $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
        $('#alphabeticalOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
        buildFillForm();
    });

    // Tag autocomplete
    $("#filterTag").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: '/api/gettags',
                method: 'GET',
                dataType: 'json',
                success: (tags) => {
                    const filteredTags = $.ui.autocomplete.filter(tags, request.term);
                    response(filteredTags);
                },
                error: (err) => {
                    console.error('Failed to load tags for autocomplete', err);
                    response([]);
                }
            });
        },
        minLength: 1,
        select: (event, ui) => {
            $("#filterTag").val(ui.item.value);
            $("#applyFilters").click();
            return false;
        }
    });

    // Apply filters button
    $('#applyFilters').on('click', () => {
        Storage.loadSavedStoriesList();
    });

    // Share story button
    $('#shareStory').on('click', () => {
        const finalText = $('#finalStory').text();
        const title = $('#displayTitle').text();
        const author = $('#displayAuthor').text();
        const content = formatStoryForExport(title, author, finalText);
        
        domUtils.copyToClipboard(content)
            .then(success => {
                if (success) {
                    domUtils.showToast('Story copied to clipboard!');
                } else {
                    domUtils.showError('Copy Failed', 'Failed to copy story. Please copy manually.');
                }
            });
    });

    // Story editor input event
    $('#storyText').on('input', () => {
        updateVariablesFromEditor();
        state.storyHasUnsavedChanges = true;
    });

    // Upload story button
    $('#uploadStoryBtn').on('click', () => { 
        $('#uploadStory').click(); 
    });
    
    $('#uploadStory').on('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const storyData = parseStoryFile(content);
            
            $('#storyTitle').val(storyData.title);
            $('#storyAuthor').val(storyData.author);
            $('#storyText').html(storyData.content);
            
            // Reset state
            state.variables = [];
            state.variableCounts = {};
            state.insertionCounter = 0;
            state.pronounGroupCount = 0;
            state.pronounGroups = {};
            state.fillValues = {};
            state.customPlaceholders = [];
            
            updateVariablesFromEditor();
        };
        reader.readAsText(file);
    });

    // Start game button
    $('#startGame').on('click', () => {
        const content = $('#storyText').html();
        if (!content.trim()) {
            domUtils.showError('Empty Story', 'Please write a story before continuing.');
            return;
        }
        updateVariablesFromEditor();
        state.storyText = generateLegacyText();
        if (!state.variables.length) {
            domUtils.showError('No Placeholders', 'No placeholders found in the story.');
            return;
        }
        buildFillForm();
        $('#inputs').removeClass('d-none');
        $('#editor').addClass('d-none');
    });

    // Generate story button
    $('#generateStory').on('click', handleGenerateStory);

    // Create new story buttons
    $('#createNewStory2, #createNewStory').on('click', handleCreateNewStory);

    // Story editing flow buttons
    $('#editStoryEntries').on('click', () => {
        buildFillForm();
        $('#result').addClass('d-none');
        $('#inputs').removeClass('d-none');
    });
    
    $('#backToEditor, #backToEditor2').on('click', () => {
        $('#result, #inputs').addClass('d-none');
        $('#editor').removeClass('d-none');
    });

    // Save story to site button
    $('#saveStoryToSite').on('click', handleSaveStoryToSite);

    // Download story button
    $('#downloadStory').on('click', () => {
        const finalText = $('#finalStory').text();
        const title = $('#displayTitle').text();
        const author = $('#displayAuthor').text();
        const content = formatStoryForExport(title, author, finalText);
        const fileName = createFilenameFromTitle(title);
        
        domUtils.downloadTextFile(content, fileName);
    });

    // Save completed story button
    $('#saveCompletedStory').on('click', () => {
        Storage.addCompletedStoryToSavedStories();
    });

    // Saved stories buttons
    $('#mySavedStoriesBtn').on('click', () => {
        Storage.loadSavedStoriesList();
        $('#savedStoriesModal').modal('show');
    });
    
    $(document).on('click', '.loadSavedStoryBtn', function () {
        const index = $(this).data('index');
        $('#savedStoriesModal').modal('hide');
        Storage.loadSavedStory(index, "play");
    });
    
    $(document).on('click', '.editSavedStoryBtn', function () {
        const index = $(this).data('index');
        $('#savedStoriesModal').modal('hide');
        Storage.loadSavedStory(index, "edit");
    });
    
    $(document).on('click', '.deleteSavedStoryBtn', function () {
        const title = $(this).data('title');
        domUtils.confirmDialog({
            title: 'Delete Story?',
            text: 'Are you sure you want to delete this saved story?',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) Storage.deleteSavedStory(title);
        });
    });

    // Rating submission
    $('#submitRating').on('click', () => {
        const rating = parseInt($('#storyRating').val(), 10);
        if (!state.currentStoryId) {
            domUtils.showError('Error', 'Story ID not found.');
            return;
        }
        $.ajax({
            url: '/api/rateStory',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ storyId: state.currentStoryId, rating }),
            success: (data) => {
                domUtils.showToast(`Thank you for rating! New average: ${data.rating.toFixed(1)} (${data.ratingCount} votes)`);
            },
            error: (xhr, statusText, errorThrown) => {
                Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to rate story');
            }
        });
    });

    // Editor key handling for placeholders
    $('#storyText').on('keydown', (e) => {
        const sel = window.getSelection();
        if (sel.rangeCount) {
            let range = sel.getRangeAt(0);
            if (e.key === "ArrowRight") {
                let node = sel.anchorNode;
                if (node.nodeType === Node.TEXT_NODE && node.parentNode.classList.contains('placeholder')) {
                    if (sel.anchorOffset >= node.nodeValue.length) {
                        e.preventDefault();
                        let placeholder = node.parentNode;
                        let newRange = document.createRange();
                        newRange.setStartAfter(placeholder);
                        newRange.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(newRange);
                    }
                }
            }
            if (e.key === "Backspace") {
                let node = sel.anchorNode;
                if (node.nodeType === Node.TEXT_NODE && node.parentNode.classList.contains('placeholder') && sel.anchorOffset === 0) {
                    e.preventDefault();
                    let placeholder = node.parentNode;
                    let newRange = document.createRange();
                    newRange.setStartBefore(placeholder);
                    newRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            }
        }
    });

    // Add placeholder button
    $('#addPlaceholderBtn').on('click', () => { 
        $('#placeholderModal').modal('show'); 
    });

    // Click handler for existing placeholders
    document.getElementById('existingPlaceholdersContainer').addEventListener('click', (e) => {
        const btn = e.target.closest('.placeholder-item');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const variable = state.variables.find(v => v.id === id);
        if (variable) duplicatePlaceholder(variable);
    });

    // Add custom placeholder button
    $('#addCustomPlaceholderBtn').on('click', () => {
        const raw = $('#placeholderSearch').val();
        const usage = $('input[name="customPlaceholderType"]:checked').val() || "generic";
        if (usage === "noun") {
            addCustomPlaceholder(raw, "noun");
            showNounNumberSelection("NN_" + StringUtils.pascalCase(raw), StringUtils.naturalDisplay(raw));
        } else if (usage === "verb") {
            addCustomPlaceholder(raw, "verb");
            showVerbTenseSelection("VB_" + StringUtils.pascalCase(raw), StringUtils.naturalDisplay(raw));
        } else {
            addCustomPlaceholder(raw);
            insertPlaceholderFromCustom(raw);
        }
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', state.currentPlaceholderSearch);
    });

    // Modal add custom placeholder button
    $('#modalAddCustomPlaceholderBtn').on('click', () => {
        const raw = $('#modalPlaceholderSearch').val();
        const usage = $('input[name="modalCustomPlaceholderType"]:checked').val() || "generic";
        if (usage === "noun") {
            addCustomPlaceholder(raw, "noun");
            showNounNumberSelection("NN_" + StringUtils.pascalCase(raw), StringUtils.naturalDisplay(raw));
        } else if (usage === "verb") {
            addCustomPlaceholder(raw, "verb");
            showVerbTenseSelection("VB_" + StringUtils.pascalCase(raw), StringUtils.naturalDisplay(raw));
        } else {
            addCustomPlaceholder(raw);
            insertPlaceholderFromCustom(raw);
        }
        updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', state.currentModalPlaceholderSearch);
        $('#placeholderModal').modal('hide');
        $('#modalPlaceholderSearch').val('');
        updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', state.currentModalPlaceholderSearch);
    });

    // Search modal placeholder input
    $('#modalPlaceholderSearchInput').on('input', function () {
        state.currentModalPlaceholderSearch = $(this).val().trim().toLowerCase();
        updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', state.currentModalPlaceholderSearch);
    });

    // The remaining initialization code follows
    // ... existing code ...
};