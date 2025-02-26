// public/js/data/storage.js
import state from '../core/state.js';
import { updateVariablesFromEditor } from '../core/placeholders.js';
import { buildFillForm } from '../ui/forms.js';

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
        const story = {
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
            password: data.password || null
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
                                password: data.password || null,
                                overwrite: true  // Add the overwrite flag
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
    },
    
    addCompletedStoryToSavedStories: () => {
        const story = {
            storyTitle: $('#displayTitle').text(),
            storyAuthor: $('#displayAuthor').text(),
            storyText: state.storyText,
            variables: state.variables,
            pronounGroups: state.pronounGroups,
            variableCounts: state.variableCounts,
            pronounGroupCount: state.pronounGroupCount,
            customPlaceholders: state.customPlaceholders,
            tags: $('#displayTags').text() ? $('#displayTags').text().split(',').map(s => s.trim()) : [],
            savedAt: new Date().toISOString(),
            password: data.password || null
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
                    const item = $(`
                      <div class="list-group-item p-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>${lockIndicator}${story.storyTitle || 'Untitled'}</strong><br>
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
        return $(`
            <div class="list-group-item p-2">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>${story.storyTitle || 'Untitled'}</strong><br>
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
                            $('#displayStoryId').text(state.currentStoryId);
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Story loaded!', showConfirmButton: false, timer: 1500 });
                        },
                        error: (xhr, statusText, errorThrown) => {
                            Storage.handleAjaxError(xhr, statusText, errorThrown, 'Incorrect password or failed to unlock story');
                        }
                    });
                }
            });
        } else {
            Storage.populateEditorWithStory(story, mode);
            state.currentStoryId = story._id || null;
            $('#displayStoryId').text(state.currentStoryId);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Story loaded!', showConfirmButton: false, timer: 1500 });
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