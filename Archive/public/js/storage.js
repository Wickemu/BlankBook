// storage.js
"use strict";
import { decodeHTMLEntities } from './utils.js';
import { variables, customPlaceholders, pronounGroups, variableCounts, pronounGroupCount, insertionCounter } from './state.js';

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
            variables,
            pronounGroups,
            variableCounts,
            pronounGroupCount,
            customPlaceholders,
            tags: $('#storyTags').val() ? $('#storyTags').val().split(',').map(s => s.trim()) : [],
            savedAt: new Date().toISOString(),
            password: $('#storyPassword').val() || null
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
    },
    addCompletedStoryToSavedStories: () => {
        const story = {
            storyTitle: $('#displayTitle').text(),
            storyAuthor: $('#displayAuthor').text(),
            storyText: storyText,
            variables,
            pronounGroups,
            variableCounts,
            pronounGroupCount,
            customPlaceholders,
            tags: $('#displayTags').text() ? $('#displayTags').text().split(',').map(s => s.trim()) : [],
            savedAt: new Date().toISOString(),
            password: null,  // Fixed undefined reference
            locked: false    // Not locked since password is null
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
    },
    loadSavedStoriesList: () => {
        const tag = $('#filterTag').val();
        const sort = $('#sortOption').val();
        $.ajax({
            url: `/api/getstories?tag=${encodeURIComponent(tag || '')}&sort=${encodeURIComponent(sort || 'date_desc')}`,
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
        // If the story is locked, prompt for the password.
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
                        url: '/api/unlockstory',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({ storyId: story._id, password: result.value }),
                        success: (unlockedStory) => {
                            Storage.populateEditorWithStory(unlockedStory, mode);
                            currentStoryId = unlockedStory._id || null;
                            currentStoryPassword = result.value; // Store the password that was used to unlock
                            currentStoryLocked = true; // Mark that this story has a password
                            $('#displayStoryId').text(currentStoryId);
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Story loaded!', showConfirmButton: false, timer: 1500 });
                        }, // Missing comma was here
                        error: (xhr, statusText, errorThrown) => {
                            Storage.handleAjaxError(xhr, statusText, errorThrown, 'Incorrect password or failed to unlock story');
                        }
                    });
                }
            });
        } else {
            Storage.populateEditorWithStory(story, mode);
            currentStoryId = story._id || null;
            currentStoryPassword = null; // Clear any previous password
            currentStoryLocked = story.locked || false; // Check if the story is locked
            $('#displayStoryId').text(currentStoryId);
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
        variables = [];
        variableCounts = {};
        insertionCounter = 0;
        fillValues = story.fillValues || {};
        pronounGroups = story.pronounGroups || {};
        pronounGroupCount = story.pronounGroupCount || 0;
        customPlaceholders = story.customPlaceholders || [];
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
            url: '/api/deletestory',
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