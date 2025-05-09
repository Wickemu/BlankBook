// public/js/data/storage.js
import state from '../core/state.js';
import { updateVariablesFromEditor } from '../core/placeholders.js';
import { buildFillForm } from '../ui/forms.js';
import { Utils, decodeHTMLEntities } from '../utils/utils.js';

// Define the base URL for all API calls - UPDATED to be dynamic
const API_BASE_URL = (() => {
    // If we're running on localhost with a specific port, use it with port 3000
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:3000';
    }
    // For all other cases (production), use the same origin with correct port
    return `${window.location.protocol}//${window.location.hostname}:3000`;
})();

console.log(`Using API base URL: ${API_BASE_URL}`);

export const Storage = {
    handleAjaxError: (xhr, statusText, errorThrown, customErrorMessage) => {
        let errorMessage = customErrorMessage || 'Failed to perform action';
        if (xhr.status) {
            errorMessage += `. Server responded with status: ${xhr.status} ${xhr.statusText}`;
        } else if (statusText) {
            errorMessage += `. Status text: ${statusText}`;
        } else if (errorThrown) {
            errorMessage += `. Error: ${errorThrown}`;
        }
        Swal.fire('Error', errorMessage, 'error');
        console.error("AJAX Error:", errorMessage, xhr);
    },
    
    addCurrentStoryToSavedStories: () => {
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
                // We need to import and call loadPreexistingTags from events.js
                // This requires proper module handling
                const container = $('#preexistingTagsContainer');
                $.ajax({
                    url: `${API_BASE_URL}/api/gettags`,
                    method: 'GET',
                    success: (tags) => {
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
                
                const story = {
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
                    password: data.password && data.password.trim() !== '' ? data.password : null,
                    // Add chapters array and current chapter if they exist in state
                    chapters: state.chapters || [],
                    currentChapter: state.currentChapter || 0
                };
                
                $.ajax({
                    url: `${API_BASE_URL}/api/savestory`,
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
                                    // Create a new story object with the overwrite flag
                                    let storyWithOverwrite = {
                                        storyTitle: $('#storyTitle').val(),
                                        storyAuthor: $('#storyAuthor').val(),
                                        storyText: $('#storyText').html(),
                                        variables: state.variables,
                                        pronounGroups: state.pronounGroups,
                                        variableCounts: state.variableCounts,   
                                        pronounGroupCount: state.pronounGroupCount,
                                        customPlaceholders: state.customPlaceholders,
                                        tags: $('#storyTags').val() ? $('#storyTags').val().split(',').map(s => s.trim()) : [],
                                        savedAt: new Date().toISOString(),
                                        password: null,
                                        overwrite: true,  // Add the overwrite flag
                                        // Add chapters array and current chapter if they exist in state
                                        chapters: state.chapters || [],
                                        currentChapter: state.currentChapter || 0
                                    };

                                    $.ajax({
                                        url: `${API_BASE_URL}/api/savestory`,
                                        method: 'POST',
                                        contentType: 'application/json',
                                        data: JSON.stringify(storyWithOverwrite),
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
    },
    
    // NEW: Add a chapter to the current story
    addChapterToCurrentStory: () => {
        // First check if we have a story ID
        if (!state.currentStoryId) {
            Swal.fire({
                title: 'No Story Selected',
                text: 'You need to save the story first before adding chapters.',
                icon: 'warning'
            });
            return;
        }

        Swal.fire({
            title: 'Add New Chapter',
            html: `
              <input type="text" id="swalChapterTitle" class="swal2-input" placeholder="Chapter Title" value="Chapter ${(state.chapters?.length || 0) + 1}">
              <input type="number" id="swalChapterNumber" class="swal2-input" placeholder="Chapter Number" value="${(state.chapters?.length || 0) + 1}">
            `,
            showCancelButton: true,
            confirmButtonText: 'Add Chapter',
            preConfirm: () => {
                return {
                    chapterTitle: document.getElementById('swalChapterTitle').value,
                    chapterNumber: document.getElementById('swalChapterNumber').value,
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const data = result.value;
                
                // Create a new chapter
                const chapter = {
                    storyTitle: $('#storyTitle').val(),
                    chapterTitle: data.chapterTitle,
                    chapterNumber: parseInt(data.chapterNumber),
                    chapterText: '', // Start with an empty chapter
                    variables: state.variables,  // Inherit variables from current story/chapter
                    fillValues: state.fillValues || {},
                    pronounGroups: state.pronounGroups || {},
                    variableCounts: state.variableCounts || {},
                    customPlaceholders: state.customPlaceholders || [],
                    pronounGroupCount: state.pronounGroupCount || 0
                };
                
                $.ajax({
                    url: `${API_BASE_URL}/api/savechapter`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(chapter),
                    success: (response) => {
                        // Update state with the new chapter information
                        state.chapters = response.story.chapters || [];
                        state.currentChapter = parseInt(data.chapterNumber);
                        
                        // Update the UI to show the new chapter
                        Storage.loadChapter(state.currentStoryId, state.currentChapter);
                        
                        // Update chapter selection dropdown
                        Storage.updateChapterSelector();
                        
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'New chapter added!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    },
                    error: (xhr, statusText, errorThrown) => {
                        Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to add new chapter');
                    }
                });
            }
        });
    },
    
    // NEW: Load a specific chapter
    loadChapter: (storyId, chapterNumber) => {
        $.ajax({
            url: `${API_BASE_URL}/api/getchapter?storyId=${storyId}&chapterNumber=${chapterNumber}`,
            method: 'GET',
            success: (chapter) => {
                // Update the editor with the chapter content
                if (parseInt(chapterNumber) === 0) {
                    // This is the main story
                    $('#storyTitle').val(chapter.chapterTitle);
                    $('#chapterTitle').val(''); // No chapter title for main story
                } else {
                    $('#chapterTitle').val(chapter.chapterTitle);
                }
                
                $('#storyText').html(decodeHTMLEntities(chapter.chapterText));
                
                // Update state with chapter data
                state.variables = chapter.variables || [];
                state.fillValues = chapter.fillValues || {};
                state.pronounGroups = chapter.pronounGroups || {};
                state.variableCounts = chapter.variableCounts || {};
                state.customPlaceholders = chapter.customPlaceholders || [];
                state.pronounGroupCount = chapter.pronounGroupCount || 0;
                state.currentChapter = parseInt(chapterNumber);
                
                // Re-scan the editor to update variables
                updateVariablesFromEditor();
                
                // Update chapter selection dropdown
                Storage.updateChapterSelector();
                
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `${parseInt(chapterNumber) === 0 ? 'Main story' : 'Chapter ' + chapterNumber} loaded!`,
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: (xhr, statusText, errorThrown) => {
                Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load chapter');
            }
        });
    },
    
    // NEW: Save the current chapter
    saveCurrentChapter: () => {
        if (!state.currentStoryId) {
            Swal.fire({
                title: 'No Story Selected',
                text: 'You need to save the story first before saving chapters.',
                icon: 'warning'
            });
            return;
        }
        
        const chapterData = {
            storyTitle: $('#storyTitle').val(),
            chapterTitle: state.currentChapter === 0 ? $('#storyTitle').val() : $('#chapterTitle').val(),
            chapterNumber: state.currentChapter,
            chapterText: $('#storyText').html(),
            variables: state.variables,
            fillValues: state.fillValues || {},
            pronounGroups: state.pronounGroups || {},
            variableCounts: state.variableCounts || {},
            customPlaceholders: state.customPlaceholders || [],
            pronounGroupCount: state.pronounGroupCount || 0
        };
        
        $.ajax({
            url: `${API_BASE_URL}/api/savechapter`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(chapterData),
            success: (response) => {
                // Update state with updated chapters
                state.chapters = response.story.chapters || [];
                
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `${state.currentChapter === 0 ? 'Main story' : 'Chapter ' + state.currentChapter} saved!`,
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: (xhr, statusText, errorThrown) => {
                Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save chapter');
            }
        });
    },
    
    // NEW: Delete a chapter
    deleteChapter: (storyId, chapterNumber) => {
        if (parseInt(chapterNumber) === 0) {
            Swal.fire({
                title: 'Cannot Delete Main Story',
                text: 'You cannot delete the main story. Delete the entire story instead.',
                icon: 'warning'
            });
            return;
        }
        
        Swal.fire({
            title: 'Delete Chapter',
            text: `Are you sure you want to delete Chapter ${chapterNumber}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${API_BASE_URL}/api/deletechapter`,
                    method: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify({ storyId, chapterNumber }),
                    success: (response) => {
                        // Update state with updated chapters
                        state.chapters = response.story.chapters || [];
                        state.currentChapter = response.story.currentChapter;
                        
                        // Load the current chapter
                        Storage.loadChapter(storyId, state.currentChapter);
                        
                        // Update chapter selection dropdown
                        Storage.updateChapterSelector();
                        
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Chapter deleted!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    },
                    error: (xhr, statusText, errorThrown) => {
                        Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to delete chapter');
                    }
                });
            }
        });
    },
    
    // NEW: Update the chapter selector dropdown
    updateChapterSelector: () => {
        const $chapterSelector = $('#chapterSelector');
        if (!$chapterSelector.length) {
            console.error('Chapter selector not found in the DOM');
            return;
        }
        
        $chapterSelector.empty();
        
        // Add main story option
        $chapterSelector.append(
            $('<option></option>')
                .val(0)
                .text('Main Story')
                .prop('selected', state.currentChapter === 0)
        );
        
        // Add chapter options
        if (state.chapters && state.chapters.length > 0) {
            state.chapters.forEach(chapter => {
                $chapterSelector.append(
                    $('<option></option>')
                        .val(chapter.chapterNumber)
                        .text(`Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`)
                        .prop('selected', state.currentChapter === chapter.chapterNumber)
                );
            });
        }
    },
    
    addCompletedStoryToSavedStories: () => {
        Swal.fire({
            title: 'Save Completed Story',
            html: `
              <input type="text" id="swalTitle" class="swal2-input" placeholder="Story Title" value="${$('#displayTitle').text()}">
              <input type="text" id="swalAuthor" class="swal2-input" placeholder="Author" value="${$('#displayAuthor').text()}">
              <input type="text" id="swalTags" class="swal2-input" placeholder="Tags (comma separated)" value="${$('#displayTags').text()}">
              <input type="password" id="swalPassword" class="swal2-input" placeholder="Password (optional)">
              <div id="preexistingTagsContainer" style="text-align:left; margin-top:10px;"></div>
            `,
            didOpen: () => {
                // We need to import and call loadPreexistingTags from events.js
                // This requires proper module handling
                const container = $('#preexistingTagsContainer');
                $.ajax({
                    url: `${API_BASE_URL}/api/gettags`,
                    method: 'GET',
                    success: (tags) => {
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
                // Update display in the result section
                $('#displayTitle').text(data.title);
                $('#displayAuthor').text(data.author);
                $('#displayTags').text(data.tags);
                
                const story = {
                    storyTitle: data.title,
                    storyAuthor: data.author,
                    storyText: state.storyText,
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
                    url: `${API_BASE_URL}/api/savestory`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(story),
                    success: () => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Completed story saved to site!',
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
                                        url: `${API_BASE_URL}/api/savestory`,
                                        method: 'POST',
                                        contentType: 'application/json',
                                        data: JSON.stringify(story),
                                        success: () => {
                                            Swal.fire({
                                                toast: true,
                                                position: 'top-end',
                                                icon: 'success',
                                                title: 'Completed story overwritten!',
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                        },
                                        error: (xhrOverwrite, statusTextOverwrite, errorThrownOverwrite) => {
                                            Storage.handleAjaxError(xhrOverwrite, statusTextOverwrite, errorThrownOverwrite, 'Failed to overwrite completed story');
                                        }
                                    });
                                }
                            });
                        } else {
                            Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save completed story');
                        }
                    }
                });
            }
        });
    },
    
    loadSavedStoriesList: () => {
        const tag = $('#filterTag').val();
        const sort = $('#sortOption').val();
        $.ajax({
            url: `${API_BASE_URL}/api/getstories?tag=${encodeURIComponent(tag || '')}&sort=${encodeURIComponent(sort || 'date_desc')}`,
            method: 'GET',
            success: (stories) => {
                // Store the fetched stories globally for later reference
                window.savedStories = stories;
                const $listContainer = $('#savedStoriesList').empty();
                if (!stories.length) {
                    $listContainer.append('<p>No stories saved yet.</p>');
                    return;
                }
                stories.forEach((story, index) => {
                    const dateObj = new Date(story.savedAt);
                    const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
                    const tags = story.tags && story.tags.length ? story.tags.join(', ') : 'No tags';
                    const ratingDisplay = story.ratingCount ? `Rating: ${story.rating.toFixed(1)} (${story.ratingCount} votes)` : 'No ratings';
                    const lockIndicator = story.locked ? `<i class="fas fa-lock" title="Password Protected"></i> ` : '';
                    const chapterCount = story.chapterCount ? `<span class="badge bg-info">${story.chapterCount} chapters</span> ` : '';
                    
                    const item = $(`
                      <div class="list-group-item p-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>${lockIndicator}${story.storyTitle || 'Untitled'}</strong> ${chapterCount}<br>
                            <small>${story.storyAuthor || 'Unknown'} | ${dateStr}</small><br>
                            <small>${tags} | ${ratingDisplay}</small>
                          </div>
                          <div>
                            <button class="btn btn-sm btn-secondary editSavedStoryBtn" data-index="${index}" aria-label="Edit Story">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-success loadSavedStoryBtn" data-index="${index}" aria-label="Play Story">
                              <i class="fas fa-play"></i>
                            </button>
                            <button class="btn btn-sm btn-danger deleteSavedStoryBtn" data-title="${story.storyTitle}" aria-label="Delete Story">
                              <i class="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    `);
                    $listContainer.append(item);
                });
            },
            error: (xhr, statusText, errorThrown) => {
                Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load saved stories list');
            }
        });
    },
    
    createSavedStoryListItem: (story, index, dateStr) => {
        const chapterCount = story.chapters && story.chapters.length ? `<span class="badge bg-info">${story.chapters.length} chapters</span> ` : '';
        
        return $(`
            <div class="list-group-item p-2">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>${story.storyTitle || 'Untitled'}</strong> ${chapterCount}<br>
                  <small>${story.storyAuthor || 'Unknown'} | ${dateStr}</small>
                </div>
                <div>
                  <button class="btn btn-sm btn-secondary editSavedStoryBtn" data-index="${index}" aria-label="Edit Story">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-success loadSavedStoryBtn" data-index="${index}" aria-label="Play Story">
                    <i class="fas fa-play"></i>
                  </button>
                  <button class="btn btn-sm btn-danger deleteSavedStoryBtn" data-title="${story.storyTitle}" aria-label="Delete Story">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
        `);
    },
    
    loadSavedStory: (index, mode = "edit") => {
        const stories = window.savedStories || [];
        const story = stories[index];
        if (!story) {
            Swal.fire('Error', 'Story not found.', 'error');
            return;
        }
        // NEW: If the story is locked, prompt for the password.
        if (story.locked) {
            Swal.fire({
                title: 'Enter Password',
                input: 'password',
                inputPlaceholder: 'Password',
                showCancelButton: true,
                inputAttributes: { autocapitalize: 'off', autocorrect: 'off' }
            }).then(result => {
                if (result.value) {
                    $.ajax({
                        url: `${API_BASE_URL}/api/unlockstory`,
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({ storyId: story._id, password: result.value }),
                        success: (unlockedStory) => {
                            Storage.populateEditorWithStory(unlockedStory, mode);
                            state.currentStoryId = unlockedStory._id || null;
                            state.chapters = unlockedStory.chapters || [];
                            state.currentChapter = unlockedStory.currentChapter || 0;
                            $('#displayStoryId').text(state.currentStoryId);
                            
                            // Update chapter selector
                            Storage.updateChapterSelector();
                            
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Story loaded!', showConfirmButton: false, timer: 1500 });
                        },
                        error: (xhr, statusText, errorThrown) => {
                            Storage.handleAjaxError(xhr, statusText, errorThrown, 'Incorrect password or failed to unlock story');
                        }
                    });
                }
            });
        } else {
            // If the story has chapters, load the first chapter or current chapter
            if (story.chapters && story.chapters.length > 0 && story._id) {
                // Store story info in state
                state.currentStoryId = story._id;
                state.chapters = story.chapters;
                state.currentChapter = story.currentChapter || 0;
                
                // Load the current chapter
                Storage.loadChapter(story._id, story.currentChapter || 0);
            } else {
                // Regular story with no chapters
                Storage.populateEditorWithStory(story, mode);
                state.currentStoryId = story._id || null;
                state.chapters = story.chapters || [];
                state.currentChapter = 0; // Default to main story
                $('#displayStoryId').text(state.currentStoryId);
                
                // Update chapter selector
                Storage.updateChapterSelector();
                
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Story loaded!', showConfirmButton: false, timer: 1500 });
            }
        }
    },

    populateEditorWithStory: (story, mode) => {
        $('#storyTitle').val(story.storyTitle);
        $('#storyAuthor').val(story.storyAuthor);
        $('#storyText').html(decodeHTMLEntities(story.storyText));
        // NEW: Populate tags input if editing a story.
        if (story.tags && story.tags.length) {
            $('#storyTags').val(story.tags.join(', '));
        }
        // Also store rating info in a display area (if desired)
        if (mode === "play" && story.ratingCount) {
            $('#ratingSection').show();
        } else {
            $('#ratingSection').hide();
        }
        state.variables = [];
        state.variableCounts = {};
        state.insertionCounter = 0;
        state.fillValues = story.fillValues || {};
        state.pronounGroups = story.pronounGroups || {};
        state.pronounGroupCount = story.pronounGroupCount || 0;
        state.customPlaceholders = story.customPlaceholders || [];
        updateVariablesFromEditor();
        if (mode === "edit") {
            $('#editor').removeClass('d-none');
            $('#inputs, #result').addClass('d-none');
        } else if (mode === "play") {
            buildFillForm();
            $('#inputs').removeClass('d-none');
            $('#editor, #result').addClass('d-none');
        }
    },
    
    // NEW: Load all chapters for a story in play mode
    loadAllChaptersForPlay: (storyId) => {
        $.ajax({
            url: `${API_BASE_URL}/api/getchapters?storyId=${storyId}`,
            method: 'GET',
            success: (response) => {
                // Store all chapters in the state for playback
                state.allChapters = response.chapters;
                state.currentStoryId = response.storyId;
                state.storyTitle = response.storyTitle;
                state.storyAuthor = response.storyAuthor;
                state.currentChapter = response.currentChapter;
                
                // Start with chapter 0 (main story)
                const mainStory = response.chapters.find(ch => ch.chapterNumber === 0);
                if (mainStory) {
                    $('#displayTitle').text(response.storyTitle);
                    $('#displayAuthor').text(response.storyAuthor);
                    
                    // Set up the variables and placeholders from the main story
                    state.variables = mainStory.variables || [];
                    state.fillValues = mainStory.fillValues || {};
                    state.pronounGroups = mainStory.pronounGroups || {};
                    state.variableCounts = mainStory.variableCounts || {};
                    state.customPlaceholders = mainStory.customPlaceholders || [];
                    state.pronounGroupCount = mainStory.pronounGroupCount || 0;
                    state.storyText = mainStory.chapterText;
                    
                    // Build the fill form for the user to fill in variables
                    buildFillForm();
                    
                    // Show chapter navigation if there are chapters
                    if (response.chapters.length > 1) {
                        $('#chapterNavigation').removeClass('d-none');
                        // Populate chapter dropdown
                        const $chapterNav = $('#playChapterSelector').empty();
                        response.chapters.forEach(chapter => {
                            $chapterNav.append(
                                $('<option></option>')
                                    .val(chapter.chapterNumber)
                                    .text(chapter.chapterNumber === 0 
                                        ? 'Introduction' 
                                        : `Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`)
                                    .prop('selected', state.currentChapter === chapter.chapterNumber)
                            );
                        });
                    } else {
                        $('#chapterNavigation').addClass('d-none');
                    }
                    
                    $('#inputs').removeClass('d-none');
                    $('#editor, #result').addClass('d-none');
                }
            },
            error: (xhr, statusText, errorThrown) => {
                Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load chapters');
            }
        });
    },
    
    // NEW: Switch to a different chapter in play mode
    switchPlayChapter: (chapterNumber) => {
        if (!state.allChapters) {
            console.error('No chapters loaded');
            return;
        }
        
        const chapter = state.allChapters.find(ch => ch.chapterNumber === parseInt(chapterNumber));
        if (!chapter) {
            console.error(`Chapter ${chapterNumber} not found`);
            return;
        }
        
        // Update the current chapter
        state.currentChapter = parseInt(chapterNumber);
        
        // Update the display with the chapter content
        $('#playChapterTitle').text(chapter.chapterNumber === 0 
            ? '' 
            : `Chapter ${chapter.chapterNumber}: ${chapter.chapterTitle}`);
        
        // We don't change the variables and placeholders when switching chapters
        // This allows variables from earlier chapters to be available in later chapters
        state.storyText = chapter.chapterText;
        
        // Rebuild the form with the current variables
        buildFillForm();
        
        // Update the chapter selector
        $('#playChapterSelector').val(chapterNumber);
    },
    
    deleteSavedStory: (title) => {
        $.ajax({
            url: `${API_BASE_URL}/api/deletestory`,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ storyTitle: title }),
            success: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Story deleted!',
                    showConfirmButton: false,
                    timer: 1500
                });
                Storage.loadSavedStoriesList();
            },
            error: (xhr, statusText, errorThrown) => {
                Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to delete story');
            }
        });
    }
};