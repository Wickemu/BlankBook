"use strict";
import { Utils, decodeHTMLEntities } from './utils.js';
import { Storage } from './storage.js';
import {
  updatePlaceholderAccordion, duplicatePlaceholder, insertPlaceholder,
  updateVariablesList
} from './placeholders.js';
import { buildFillForm } from './formbuilder.js';
import { showNounNumberSelection, showVerbTenseSelection, showPersonTypeSelection, pickPronounFormAndGroup } from './modals.js';
import {
  variables, variableCounts, customPlaceholders, fillValues, pronounGroups,
  pronounGroupCount, lastRange, usageTracker, placeholderInsertionInProgress, storyHasUnsavedChanges,
  currentStoryPassword, currentStoryLocked, currentStoryId, currentPlaceholderSearch, currentModalPlaceholderSearch
} from './state.js';


// Global variables for editing menus
let currentEditingVariable = null;
let currentPlaceholderElement = null;
window.isEditingPlaceholder = false;

// Create floating selection menu
export const selectionMenu = document.createElement('div');
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

// Create floating placeholder edit menu
export const placeholderEditMenu = document.createElement('div');
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

// Helper functions for positioning/hiding menus
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

export const hideMenu = (menu) => { menu.style.display = 'none'; };
export const hideAllMenus = () => { hideMenu(selectionMenu); hideMenu(placeholderEditMenu); };

// Fallback copy-to-clipboard function
export const fallbackCopyTextToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Story copied to clipboard!',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire('Error', 'Failed to copy story. Please copy manually.', 'error');
    }
  } catch (err) {
    Swal.fire('Error', 'Failed to copy story. Please copy manually.', 'error');
  }
  document.body.removeChild(textarea);
};

$(document).ready(() => {
  // Debounced search handlers for placeholder search inputs
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

  updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);

  // Filter and sort events
  $('#filterTag').on('input', Utils.debounce(() => {
    Storage.loadSavedStoriesList();
  }, 300));

  $('#sortOption').on('change', () => {
    Storage.loadSavedStoriesList();
  });

  $('#alphabeticalOrderBtn').on('click', function () {
    fillOrder = 'alphabetical';
    $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
    $('#randomOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
    buildFillForm();
  });

  $('#randomOrderBtn').on('click', function () {
    fillOrder = 'random';
    $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
    $('#alphabeticalOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
    buildFillForm();
  });

  // Autocomplete for tag filter using AJAX
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

  // Share story handler with clipboard copy fallback
  $('#shareStory').on('click', () => {
    const finalText = $('#finalStory').text();
    const title = $('#displayTitle').text();
    const author = $('#displayAuthor').text();
    const content = `Title: ${title}\nAuthor: ${author}\n\n${finalText}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(content)
        .then(() => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Story copied to clipboard!',
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch(err => {
          console.error('Error copying text: ', err);
          fallbackCopyTextToClipboard(content);
        });
    } else {
      fallbackCopyTextToClipboard(content);
    }
  });

  // Duplicate placeholder via click on existing placeholders container
  document.getElementById('existingPlaceholdersContainer').addEventListener('click', (e) => {
    const btn = e.target.closest('.placeholder-item');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const variable = variables.find(v => v.id === id);
    if (variable) duplicatePlaceholder(variable);
  });

  // Update variables when the story text changes
  $('#storyText').on('input', () => {
    updateVariablesFromEditor();
    storyHasUnsavedChanges = true;
  });

  // File upload events
  $('#uploadStoryBtn').on('click', () => { $('#uploadStory').click(); });
  $('#uploadStory').on('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const titleMatch = content.match(/^Title:\s*(.*)$/m);
      const authorMatch = content.match(/^Author:\s*(.*)$/m);
      const storyStartIndex = content.indexOf('\n\n');
      const storyContent = storyStartIndex !== -1 ? content.substring(storyStartIndex + 2) : content;
      $('#storyTitle').val(titleMatch ? titleMatch[1] : '');
      $('#storyAuthor').val(authorMatch ? authorMatch[1] : '');
      $('#storyText').html(storyContent);
      variables = [];
      variableCounts = {};
      insertionCounter = 0;
      pronounGroupCount = 0;
      pronounGroups = {};
      fillValues = {};
      customPlaceholders = [];
      updateVariablesFromEditor();
    };
    reader.readAsText(file);
  });

  // Start game handler
  $('#startGame').on('click', () => {
    const content = $('#storyText').html();
    if (!content.trim()) {
      Swal.fire('Oops!', 'Please write a story.', 'error');
      return;
    }
    updateVariablesFromEditor();
    storyText = generateLegacyText();
    if (!variables.length) {
      Swal.fire('Oops!', 'No placeholders found.', 'error');
      return;
    }
    buildFillForm();
    $('#inputs').removeClass('d-none');
    $('#editor').addClass('d-none');
  });

  // Generate story handler
  $('#generateStory').on('click', () => {
    const inputs = $('#inputForm input[type="text"]:not(.d-none)');
    let valid = true;
    inputs.each(function () {
      const pid = $(this).attr('name');
      if (!pid) return;
      const val = $(this).val().trim();
      const label = $(this).attr('data-label');
      if (!val) {
        Swal.fire('Oops!', `Please enter a value for ${label}.`, 'error');
        valid = false;
        return false;
      }
      fillValues[pid] = val;
    });
    if (!valid) return;
    let pronounComplete = true;
    const groupSet = new Set();
    for (const v of variables) {
      if (v.internalType.startsWith('PRONOUN|')) {
        const parts = v.internalType.split('|');
        groupSet.add(parts[1]);
      }
    }
    groupSet.forEach(g => {
      $(`#${g}-label .required-asterisk`).remove();
      const choice = $(`input[name='${g}-choice']:checked`).val();
      if (!choice) {
        pronounComplete = false;
        $(`#${g}-label`).append("<span class='required-asterisk' style='color:red;'> *</span>");
      } else if (choice === 'Custom') {
        const raw = $(`#${g}-custom`).val().trim();
        const splitted = raw.split(',').map(s => s.trim());
        if (splitted.length !== 5 || splitted.some(s => s === "")) {
          pronounComplete = false;
          $(`#${g}-label`).append("<span class='required-asterisk' style='color:red;'> *</span>");
        }
      }
    });
    if (!pronounComplete) {
      Swal.fire("Oops!", "Please complete all pronoun selections.", "error");
      return;
    }
    groupSet.forEach(g => {
      const choice = $(`input[name='${g}-choice']:checked`).val();
      if (choice === 'HeHim' || choice === 'SheHer' || choice === 'TheyThem') {
        const predefined = {
          HeHim: { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
          SheHer: { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
          TheyThem: { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
        };
        pronounGroups[g] = { ...predefined[choice] };
      } else {
        const raw = $(`#${g}-custom`).val().trim();
        const splitted = raw.split(',').map(s => s.trim());
        pronounGroups[g] = {
          subject: splitted[0],
          object: splitted[1],
          possAdj: splitted[2],
          possPron: splitted[3],
          reflexive: splitted[4],
        };
      }
    });
    let final = generateLegacyText();
    for (const v of variables) {
      const phRegex = new RegExp(`\\{${v.id}\\}`, 'g');
      if (v.internalType.startsWith('PRONOUN|')) {
        const parts = v.internalType.split('|');
        const groupId = parts[1];
        const form = parts[2];
        const groupObj = pronounGroups[groupId];
        final = final.replace(phRegex, groupObj ? (groupObj[form] || '') : '');
      } else {
        const userVal = fillValues[v.id] || '';
        final = final.replace(phRegex, userVal);
      }
    }
    $('#finalStory').text(final);
    $('#displayTitle').text($('#storyTitle').val());
    $('#displayAuthor').text($('#storyAuthor').val());
    $('#displayTags').text($('#storyTags').val());
    $('#result').removeClass('d-none');
    $('#inputs').addClass('d-none');
  });

  // Create new story handler
  $('#createNewStory2, #createNewStory').on('click', (e) => {
    e.preventDefault();
    if (storyHasUnsavedChanges) {
      Swal.fire({
        title: 'Unsaved changes',
        text: 'Your story has unsaved changes. Would you like to save it to the site before starting a new one?',
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save and start new',
        denyButtonText: 'Discard changes'
      }).then((result) => {
        if (result.isConfirmed) {
          Storage.addCurrentStoryToSavedStories();
          setTimeout(createNewStory, 1000);
        } else if (result.isDenied) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'This will discard your current unsaved story.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, start new',
            cancelButtonText: 'Cancel'
          }).then((res) => {
            if (res.isConfirmed) createNewStory();
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This will discard your current story.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, start new',
        cancelButtonText: 'Cancel'
      }).then((res) => {
        if (res.isConfirmed) createNewStory();
      });
    }
  });

  const createNewStory = () => {
    $('#storyTitle').val('');
    $('#storyAuthor').val('');
    $('#storyText').html('');
    $('#storyTags').val('');
    variables = [];
    variableCounts = {};
    insertionCounter = 0;
    customPlaceholders = [];
    fillValues = {};
    pronounGroups = {};
    pronounGroupCount = 0;
    storyHasUnsavedChanges = false;
    updateVariablesList();
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
    $('#editor').removeClass('d-none');
    $('#inputs, #result').addClass('d-none');
  };

  // Edit and navigation handlers
  $('#editStoryEntries').on('click', () => {
    buildFillForm();
    $('#result').addClass('d-none');
    $('#inputs').removeClass('d-none');
  });
  $('#backToEditor, #backToEditor2').on('click', () => {
    $('#result, #inputs').addClass('d-none');
    $('#editor').removeClass('d-none');
  });

  // Preexisting tags for story saving
  function loadPreexistingTags() {
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
  }
  $('#saveStoryToSite').on('click', () => {
    const passwordHtml = currentStoryLocked ?
      `<div class="form-group mb-3">
          <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="keepExistingPassword" checked>
              <label class="custom-control-label" for="keepExistingPassword">Keep existing password</label>
          </div>
          <input type="password" id="swalPassword" class="form-control mt-2" placeholder="New password (or leave empty to remove)" style="display:none;">
       </div>` :
      `<div class="form-group mb-3">
          <input type="password" id="swalPassword" class="form-control" placeholder="Password (optional)">
       </div>`;

    Swal.fire({
      title: 'Save Story',
      html: `
        <div class="container p-0">
          <div class="form-group mb-3">
            <input type="text" id="swalTitle" class="form-control" placeholder="Story Title" value="${$('#storyTitle').val()}">
          </div>
          <div class="form-group mb-3">
            <input type="text" id="swalAuthor" class="form-control" placeholder="Author" value="${$('#storyAuthor').val()}">
          </div>
          <div class="form-group mb-3">
            <input type="text" id="swalTags" class="form-control" placeholder="Tags (comma separated)" value="${$('#storyTags').val()}">
          </div>
          ${passwordHtml}
          <div class="form-group">
            <label class="tag-section-label">Quick-add tags:</label>
            <div id="preexistingTagsContainer"></div>
          </div>
        </div>
      `,
      customClass: {
        container: 'save-story-modal',
        popup: 'save-story-popup',
        content: 'save-story-content'
      },
      didOpen: () => {
        loadPreexistingTags();
        if (currentStoryLocked) {
          $('#keepExistingPassword').on('change', function () {
            $('#swalPassword').toggle(!this.checked);
          });
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        let passwordToUse;
        if (currentStoryLocked && $('#keepExistingPassword').is(':checked')) {
          passwordToUse = currentStoryPassword;
        } else {
          passwordToUse = document.getElementById('swalPassword').value;
        }
        return {
          title: document.getElementById('swalTitle').value,
          author: document.getElementById('swalAuthor').value,
          tags: document.getElementById('swalTags').value,
          password: passwordToUse
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value;
        $('#storyTitle').val(data.title);
        $('#storyAuthor').val(data.author);
        $('#storyTags').val(data.tags);
        currentStoryPassword = data.password;
        currentStoryLocked = !!data.password;
        let story = {
          storyTitle: data.title,
          storyAuthor: data.author,
          storyText: $('#storyText').html(),
          variables,
          pronounGroups,
          variableCounts,
          pronounGroupCount,
          customPlaceholders,
          tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
          savedAt: new Date().toISOString(),
          password: data.password || null,
          locked: !!data.password
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
            storyHasUnsavedChanges = false;
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
                      storyHasUnsavedChanges = false;
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
  });

  // Download story as text file
  $('#downloadStory').on('click', () => {
    const finalText = $('#finalStory').text();
    const title = $('#displayTitle').text();
    const author = $('#displayAuthor').text();
    const content = `Title: ${title}\nAuthor: ${author}\n\n${finalText}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt' : 'story.txt';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Saved stories modal events
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
    Swal.fire({
      title: 'Delete Story?',
      text: 'Are you sure you want to delete this saved story?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) Storage.deleteSavedStory(title);
    });
  });

  // Submit rating event
  $('#submitRating').on('click', () => {
    const rating = parseInt($('#storyRating').val(), 10);
    if (!currentStoryId) {
      Swal.fire('Error', 'Story ID not found.', 'error');
      return;
    }
    $.ajax({
      url: '/api/rateStory',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ storyId: currentStoryId, rating }),
      success: (data) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Thank you for rating! New average: ${data.rating.toFixed(1)} (${data.ratingCount} votes)`,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (xhr, statusText, errorThrown) => {
        Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to rate story');
      }
    });
  });

  // Custom key handling in storyText for placeholder navigation
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

  // Show placeholder modal trigger
  $('#addPlaceholderBtn').on('click', () => { $('#placeholderModal').modal('show'); });
});

// Floating menu for placeholder editing
document.getElementById('storyText').addEventListener('click', function (e) {
  if (e.target.classList.contains('placeholder')) {
    e.stopPropagation();
    currentEditingVariable = variables.find(v => v.id === e.target.getAttribute('data-id'));
    currentPlaceholderElement = e.target;
    positionMenu(placeholderEditMenu, e.target.getBoundingClientRect());
  }
});

document.getElementById('editPlaceholderBtn').addEventListener('click', () => {
  hideMenu(placeholderEditMenu);
  window.isEditingPlaceholder = true;
  $('#placeholderModal').modal('show');
  currentEditingVariable = null;
  currentPlaceholderElement = null;
});

document.getElementById('editOverrideBtn').addEventListener('click', async () => {
  hideMenu(placeholderEditMenu);
  const { value: newOverride } = await Swal.fire({
    title: 'Change Override',
    input: 'text',
    inputLabel: 'Enter new override text',
    inputValue: currentPlaceholderElement ? currentPlaceholderElement.textContent : ''
  });
  if (newOverride !== undefined) {
    if (currentPlaceholderElement) {
      currentPlaceholderElement.textContent = newOverride;
    }
    if (currentEditingVariable) {
      currentEditingVariable.displayOverride = newOverride;
    }
    updateVariablesList();
  }
  currentEditingVariable = null;
  currentPlaceholderElement = null;
});

document.getElementById('deletePlaceholderBtn').addEventListener('click', () => {
  hideMenu(placeholderEditMenu);
  if (currentPlaceholderElement) {
    currentPlaceholderElement.remove();
  }
  updateVariablesFromEditor();
  currentEditingVariable = null;
  currentPlaceholderElement = null;
});

document.getElementById('storyText').addEventListener('mouseup', () => {
  setTimeout(() => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      if (sel.anchorNode && sel.anchorNode.parentNode &&
        !sel.anchorNode.parentNode.classList.contains('placeholder')) {
        lastRange = sel.getRangeAt(0);
        const rect = lastRange.getBoundingClientRect();
        positionMenu(selectionMenu, rect);
      }
    } else {
      hideMenu(selectionMenu);
    }
  }, 0);
});

document.addEventListener('click', (e) => {
  if (!selectionMenu.contains(e.target) && !placeholderEditMenu.contains(e.target)) {
    hideAllMenus();
  }
});

document.getElementById('newPlaceholderBtn').addEventListener('click', () => {
  hideMenu(selectionMenu);
  $('#placeholderModal').modal('show');
});

document.getElementById('reusePlaceholderBtn').addEventListener('click', () => {
  hideMenu(selectionMenu);
  if (variables.length === 0) {
    Swal.fire('No existing placeholders', 'There are no placeholders to reuse yet.', 'info');
    return;
  }
  const sortedVariables = [...variables].sort((a, b) =>
    (usageTracker[b.id] || 0) - (usageTracker[a.id] || 0) || a.order - b.order
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
          const variable = variables.find(v => v.id === id);
          if (variable) duplicatePlaceholder(variable);
          Swal.close();
        });
      });
    }
  });
});

// Modal placeholder accordion click handler
$(document).on('click', '#modalPlaceholderAccordion .placeholder-btn', (e) => {
  e.stopImmediatePropagation();
  e.stopPropagation();
  e.preventDefault();
  if ($('#placeholderModal').hasClass('show')) {
    $('#placeholderModal').modal('hide');
  }
  const internalType = $(e.currentTarget).data('internal');
  const displayName = $(e.currentTarget).data('display');
  if (internalType === "PRONOUN") {
    pickPronounFormAndGroup();
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    return;
  }
  if (internalType.indexOf("NN") === 0) {
    if (internalType === "NN_Person") {
      showPersonTypeSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      return;
    }
    showNounNumberSelection(internalType, displayName);
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    return;
  }
  if (internalType.indexOf("VB") === 0 || internalType === "MD") {
    showVerbTenseSelection(internalType, displayName);
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    return;
  }
  if (window.isEditingPlaceholder && currentEditingVariable) {
    updateExistingPlaceholder(currentEditingVariable, internalType, displayName);
    window.isEditingPlaceholder = false;
    currentEditingVariable = null;
  } else {
    insertPlaceholder(internalType, displayName, false);
  }
  $('#placeholderSearch').val('');
  updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
});

// Main accordion placeholder click handler
$(document).on('click', '.placeholder-btn', (e) => {
  if (placeholderInsertionInProgress) return;
  placeholderInsertionInProgress = true;
  if ($(e.currentTarget).closest('#modalPlaceholderAccordion').length > 0) {
    placeholderInsertionInProgress = false;
    return;
  }
  e.stopPropagation();
  e.preventDefault();
  const internalType = $(e.currentTarget).data('internal');
  const displayName = $(e.currentTarget).data('display');
  if (window.isEditingPlaceholder && currentEditingVariable) {
    updateExistingPlaceholder(currentEditingVariable, internalType, displayName);
    window.isEditingPlaceholder = false;
    currentEditingVariable = null;
    $('#placeholderModal').modal('hide');
  } else {
    if (internalType === "PRONOUN") {
      pickPronounFormAndGroup();
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      placeholderInsertionInProgress = false;
      return;
    }
    if (internalType.indexOf("NN") === 0) {
      if (internalType === "NN_Person") {
        showPersonTypeSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        placeholderInsertionInProgress = false;
        return;
      }
      showNounNumberSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      placeholderInsertionInProgress = false;
      return;
    }
    if (internalType.indexOf("VB") === 0 || internalType === "MD") {
      showVerbTenseSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      placeholderInsertionInProgress = false;
      return;
    }
    insertPlaceholder(internalType, displayName, false);
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
  }
  setTimeout(() => { placeholderInsertionInProgress = false; }, 50);
});

export const generateLegacyText = () => {
  const editor = document.getElementById("storyText");
  const traverse = (node) => {
    let result = "";
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName.toLowerCase() === "br") {
          result += "\n";
        } else if (child.classList.contains("placeholder")) {
          result += "{" + child.getAttribute("data-id") + "}";
        } else {
          result += traverse(child);
          const tag = child.tagName.toLowerCase();
          if (tag === "div" || tag === "p") result += "\n";
        }
      }
    });
    return result;
  };
  return traverse(editor);
};