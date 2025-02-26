import State from './state.js';
import { Utils, decodeHTMLEntities } from './utils.js';

(function () {
  "use strict";

  window.Utils = Utils;
  window.decodeHTMLEntities = decodeHTMLEntities;

  // ====================================================
  // 1. UTILITY FUNCTIONS
  // ====================================================
  // (Utility functions commented out remain here for reference)

  // ====================================================
  // 2. GLOBAL STATE (Using State object from state.js)
  // ====================================================

  const pronounMapping = {
    "He/Him": { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
    "She/Her": { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
    "They/Them": { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
  };

  // NEW: Global to store the current story's database ID when loaded.
  let currentStoryId = null;

  // NEW: Global search strings (these are local since they’re not part of state.js)
  let currentPlaceholderSearch = '';
  let currentModalPlaceholderSearch = '';

  // ====================================================
  // 2a. Capture Selection Changes
  // ====================================================
  document.addEventListener('selectionchange', () => {
    const editor = document.getElementById("storyText");
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      State.lastRange = sel.getRangeAt(0);
    }
  });

  // ====================================================
  // 3. STORAGE HELPER FUNCTIONS (Server-side)
  // ====================================================
  const Storage = {
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
        variables: State.variables,
        pronounGroups: State.pronounGroups,
        variableCounts: State.variableCounts,
        pronounGroupCount: State.pronounGroupCount,
        customPlaceholders: State.customPlaceholders,
        tags: $('#storyTags').val() ? $('#storyTags').val().split(',').map(s => s.trim()) : [],
        savedAt: new Date().toISOString(),
        password: data.password || null
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
                // Create a new story object with the overwrite flag
                let storyWithOverwrite = {
                  storyTitle: data.title,
                  storyAuthor: data.author,
                  storyText: $('#storyText').html(),
                  variables: State.variables,
                  pronounGroups: State.pronounGroups,
                  variableCounts: State.variableCounts,
                  pronounGroupCount: State.pronounGroupCount,
                  customPlaceholders: State.customPlaceholders,
                  tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
                  savedAt: new Date().toISOString(),
                  password: data.password || null,
                  overwrite: true  // Add the overwrite flag
                };

                $.ajax({
                  url: '/api/savestory',
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
        storyText: State.storyText,
        variables: State.variables,
        pronounGroups: State.pronounGroups,
        variableCounts: State.variableCounts,
        pronounGroupCount: State.pronounGroupCount,
        customPlaceholders: State.customPlaceholders,
        tags: $('#displayTags').text() ? $('#displayTags').text().split(',').map(s => s.trim()) : [],
        savedAt: new Date().toISOString(),
        password: data.password || null
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
              url: '/api/unlockstory',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ storyId: story._id, password: result.value }),
              success: (unlockedStory) => {
                Storage.populateEditorWithStory(unlockedStory, mode);
                currentStoryId = unlockedStory._id || null;
                $('#displayStoryId').text(currentStoryId);
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
        currentStoryId = story._id || null;
        $('#displayStoryId').text(currentStoryId);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Story loaded!', showConfirmButton: false, timer: 1500 });
      }
    },
    populateEditorWithStory: (story, mode) => {
      $('#storyTitle').val(story.storyTitle);
      $('#storyAuthor').val(story.storyAuthor);
      $('#storyText').html(decodeHTMLEntities(story.storyText));
      if (story.tags && story.tags.length) {
        $('#storyTags').val(story.tags.join(', '));
      }
      if (mode === "play" && story.ratingCount) {
        $('#ratingSection').show();
      } else {
        $('#ratingSection').hide();
      }
      // Reset and update state with the saved story's values
      State.variables = [];
      State.variableCounts = {};
      State.insertionCounter = 0;
      // --- FIX: Use the top-level keys from the saved story object ---
      State.fillValues = story.fillValues || {};
      State.pronounGroups = story.pronounGroups || {};
      State.pronounGroupCount = story.pronounGroupCount || 0;
      State.customPlaceholders = story.customPlaceholders || [];
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

  // ====================================================
  // 4. TYPE HELPER FUNCTIONS
  // ====================================================
  const TypeHelpers = {
    naturalizeType: (type) => {
      if (type.startsWith("NNPS")) {
        let sub = type.substring(4);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        if (sub.toLowerCase() === "person") {
          return "Person (proper, plural)";
        }
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Proper Noun")) + " (Plural)";
      }
      if (type.startsWith("NNP")) {
        let sub = type.substring(3);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        if (sub.toLowerCase() === "person") {
          return "Person (proper, singular)";
        }
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Proper Noun")) + " (Singular)";
      }
      if (type.startsWith("NNS")) {
        let sub = type.substring(3);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        if (sub.toLowerCase() === "person") {
          return "Person (common, plural)";
        }
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Plural)";
      }
      if (type.startsWith("NN")) {
        let sub = type.substring(2);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        if (sub.toLowerCase() === "person") {
          return "Person (common, singular)";
        }
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Singular)";
      }
      if (type.startsWith("NNS")) {
        let sub = type.substring(3);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Plural)";
      }
      if (type.startsWith("NN")) {
        let sub = type.substring(2);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Singular)";
      }
      if (type === "Onomatopoeia") return "Onomatopoeia";
      if (type.startsWith("MD_")) {
        let tense = type.substring(3);
        let tenseNatural = "";
        switch (tense) {
          case "VB": tenseNatural = "Base (run)"; break;
          case "VBP": tenseNatural = "Present (I walk)"; break;
          case "VBZ": tenseNatural = "3rd Person (he leaves)"; break;
          case "VBD": tenseNatural = "Past (slept)"; break;
          case "VBG": tenseNatural = "Gerund (crying)"; break;
          case "VBN": tenseNatural = "Past Participle (eaten)"; break;
          default: tenseNatural = tense;
        }
        return "Modal Verb (" + tenseNatural + ")";
      }
      const verbTenseMap = {
        "VBZ": "3rd Person (he leaves)",
        "VBD": "Past Tense (slept)",
        "VBG": "Gerund (crying)",
        "VBN": "Past Participle (eaten)",
        "VBP": "Present (I walk)"
      };
      for (let tense in verbTenseMap) {
        if (type.startsWith(tense)) {
          let remainder = type.substring(tense.length);
          let category = "";
          if (remainder.startsWith("_")) {
            category = remainder.substring(1);
          }
          return category
            ? Utils.toTitleCase(category) + " Verb (" + verbTenseMap[tense] + ")"
            : "Verb (" + verbTenseMap[tense] + ")";
        }
      }
      if (type.startsWith("VB")) {
        let rest = type.substring(2).replace(/^_+/, "");
        return rest ? Utils.toTitleCase(rest) + " Verb (Base Form)" : "Verb (Base Form)";
      }
      if (type.startsWith("JJ_")) {
        let sub = type.substring(3);
        return Utils.toTitleCase(Utils.naturalDisplay(sub));
      }
      if (type.startsWith("JJS_")) {
        let sub = type.substring(4);
        if (sub.toLowerCase() === "ordinal") {
          return "Ordinal Number";
        }
        return Utils.toTitleCase(Utils.naturalDisplay(sub)) + " Superlative Adjective";
      }
      if (type === "JJ") return "Adjective";
      if (type === "JJR") return "Comparative Adjective";
      if (type === "JJS") return "Superlative Adjective";
      if (type === "RB") return "Adverb";
      if (type === "RBR") return "Comparative Adverb";
      if (type === "RBS") return "Superlative Adverb";
      if (type === "WRB") return "WH-adverb";
      if (type === "CC") return "Coordinating Conjunction";
      if (type === "PDT") return "Pre-determiner";
      if (type === "WDT") return "WH-determiner";
      if (type === "FW") return "Foreign Word";
      if (type === "Number") return "Number";
      if (type === "Exclamation") return "Exclamation";
      return type;
    },
    getTooltipForType: (type) => {
      const normalizedType = type.trim().toLowerCase();
      for (let category in allPlaceholders) {
        for (let p of allPlaceholders[category]) {
          if (p.internalType.trim().toLowerCase() === normalizedType) {
            return p.tooltip;
          }
        }
      }
      const verbTensePrefixes = ["VBZ", "VBD", "VBG", "VBN", "VBP"];
      for (let prefix of verbTensePrefixes) {
        if (normalizedType.startsWith(prefix.toLowerCase() + "_")) {
          const baseType = "vb_" + normalizedType.substring(prefix.length + 1);
          for (let category in allPlaceholders) {
            for (let p of allPlaceholders[category]) {
              if (p.internalType.trim().toLowerCase() === baseType) {
                return p.tooltip;
              }
            }
          }
        }
      }
      return "No additional info available.";
    },
    getOriginalDisplayForType: (type) => {
      for (let category in allPlaceholders) {
        for (let p of allPlaceholders[category]) {
          if (p.internalType === type) {
            return p.display;
          }
        }
      }
      return type.startsWith("NN") ? TypeHelpers.naturalizeType(type) : type;
    },
    guessTypeFromId: (id) => {
      let base = id.replace(/\d+$/, '');
      const custom = State.customPlaceholders.find(p => p.type === base);
      if (custom) return custom.type;
      const pronounFixedRe = /^PRP(\d+)(SUB|OBJ|PSA|PSP|REF)$/;
      if (pronounFixedRe.test(id)) {
        const match = id.match(pronounFixedRe);
        const groupNum = match[1];
        const abbrev = match[2];
        const formMapReverse = { SUB: "subject", OBJ: "object", PSA: "possAdj", PSP: "possPron", REF: "reflexive" };
        return `PRONOUN|PronounGroup${groupNum}|${formMapReverse[abbrev]}`;
      }
      const pronounRe = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)$/;
      if (pronounRe.test(base)) {
        const m = base.match(pronounRe);
        return `PRONOUN|${m[1]}|${m[2]}`;
      }
      return TypeHelpers.naturalizeType(base);
    },
    getNounFinalType: (baseInternal, number) => {
      let baseTag = "", extra = "";
      if (baseInternal.indexOf("_") !== -1) {
        const parts = baseInternal.split("_");
        baseTag = parts[0];
        extra = parts.slice(1).join("_");
      } else {
        baseTag = baseInternal;
      }
      let finalTag = baseTag === "NN" ? (number === "Singular" ? "NN" : "NNS")
        : baseTag === "NNP" ? (number === "Singular" ? "NNP" : "NNPS")
          : (number === "Singular" ? baseTag : baseTag + "S");
      return extra ? finalTag + "_" + extra : finalTag;
    },
    computeFinalVerbType: (baseInternal, tenseTag) => {
      if (baseInternal === "MD") return "MD_" + tenseTag;
      const parts = baseInternal.split("_");
      const baseCategory = parts.slice(1).join("_");
      return baseCategory ? tenseTag + "_" + baseCategory : tenseTag;
    }
  };

  // ====================================================
  // 5. PLACEHOLDER DEFINITIONS & CATEGORY ORDER
  // ====================================================
  const categoryOrder = ["Nouns", "Verbs", "Descriptors", "Other"];
  const allPlaceholders = {
    "Nouns": [
      { internalType: "NN", display: "Noun", tooltip: "Generic noun (table, apple)", icon: "fas fa-book", isPrimary: true },
      { internalType: "NNP", display: "Proper Noun", tooltip: "Specific name (London, Sarah)", icon: "fas fa-user", isPrimary: false },
      { internalType: "PRONOUN", display: "Pronoun", tooltip: "A pronoun", icon: "fas fa-user-circle", isPrimary: true },
      { internalType: "NN_Concrete", display: "Concrete", tooltip: "Tangible object (chair, phone)", icon: "fas fa-cube", isPrimary: false },
      { internalType: "NN_Person", display: "Person", tooltip: "A person (teacher, doctor)", icon: "fas fa-user-friends", isPrimary: true },
      { internalType: "NN_Place", display: "Place", tooltip: "A location (park, school)", icon: "fas fa-map-marker-alt", isPrimary: true },
      { internalType: "NN_Abstract", display: "Abstract", tooltip: "Intangible (happiness, freedom)", icon: "fas fa-cloud", isPrimary: true },
      { internalType: "NN_Animal", display: "Animal", tooltip: "Living creature (dog, elephant)", icon: "fas fa-dog", isPrimary: false },
      { internalType: "NN_BodyPart", display: "Body Part", tooltip: "Part of body (hand, knee)", icon: "fas fa-hand-paper", isPrimary: false },
      { internalType: "NN_Clothing", display: "Clothing", tooltip: "Wearable (shirt, jacket)", icon: "fas fa-tshirt", isPrimary: false },
      { internalType: "NN_Drink", display: "Drink", tooltip: "Beverage (juice, coffee)", icon: "fas fa-cocktail", isPrimary: false },
      { internalType: "NN_Emotion", display: "Emotion", tooltip: "Feeling (joy, anger)", icon: "fas fa-heart", isPrimary: false },
      { internalType: "NN_Food", display: "Food", tooltip: "Edible item (pizza, carrot)", icon: "fas fa-utensils", isPrimary: false },
      { internalType: "NN_Vehicle", display: "Vehicle", tooltip: "Mode of transport (car, bicycle)", icon: "fas fa-car", isPrimary: false },
      { internalType: "NN_Onomatopoeia", display: "Sound/Onomatopoeia", tooltip: "Sound word (bang, buzz)", icon: "fas fa-volume-up", isPrimary: false }
    ],
    "Verbs": [
      { internalType: "VB", display: "Verb", tooltip: "Action/state (jump, write)", icon: "fas fa-pen", isPrimary: true },
      { internalType: "VB_Intransitive", display: "Intransitive", tooltip: "No object (sleep, arrive)", icon: "fas fa-bed", isPrimary: true },
      { internalType: "VB_Transitive", display: "Transitive", tooltip: "Takes object (kick, carry)", icon: "fas fa-hammer", isPrimary: true },
      { internalType: "VB_Action", display: "Action", tooltip: "Physical action (run, climb)", icon: "fas fa-bolt", isPrimary: false },
      { internalType: "VB_Stative", display: "State", tooltip: "Condition (believe, know)", icon: "fas fa-brain", isPrimary: false },
      { internalType: "VB_Communication", display: "Communication", tooltip: "Speaking (say, shout)", icon: "fas fa-comment-dots", isPrimary: false },
      { internalType: "VB_Movement", display: "Movement", tooltip: "Motion-based (walk, swim)", icon: "fas fa-walking", isPrimary: false },
      { internalType: "VB_Onomatopoeia", display: "Sound/Onomatopoeia", tooltip: "Sound verb (meow, boom)", icon: "fas fa-volume-up", isPrimary: false },
      { internalType: "MD", display: "Modal", tooltip: "Possibility (can, must)", icon: "fas fa-key", isPrimary: false },
      { internalType: "VB_Linking", display: "Linking", tooltip: "Links subject (seem, become)", icon: "fas fa-link", isPrimary: false },
      { internalType: "VB_Phrase", display: "Phrasal Verb", tooltip: "Multi-word verb (give up, look after)", icon: "fas fa-random", isPrimary: false }
    ],
    "Descriptors": [
      { internalType: "JJ", display: "Adjective", tooltip: "Describes noun (blue, tall)", icon: "fas fa-ad", isPrimary: true },
      { internalType: "RB", display: "Adverb", tooltip: "Modifies verb (quickly, often)", icon: "fas fa-feather-alt", isPrimary: true },
      { internalType: "JJR", display: "Comparative", tooltip: "Comparison (faster, smaller)", icon: "fas fa-level-up-alt", isPrimary: false },
      { internalType: "JJS", display: "Superlative", tooltip: "Highest degree (best, tallest)", icon: "fas fa-medal", isPrimary: false },
      { internalType: "JJ_Number", display: "Ordered Number", tooltip: "A ranked number (1st, seventh)", icon: "fas fa-hashtag", isPrimary: true }
    ],
    "Other": [
      { internalType: "IN", display: "Preposition", tooltip: "Shows relation (in, under)", icon: "fas fa-arrows-alt", isPrimary: false },
      { internalType: "DT", display: "Determiner", tooltip: "Specifier (a, the)", icon: "fas fa-bookmark", isPrimary: false },
      { internalType: "CC", display: "Conjunction", tooltip: "Joins clauses (and, or)", icon: "fas fa-link", isPrimary: false },
      { internalType: "FW", display: "Foreign Word", tooltip: "Non-English (bonjour, sushi)", icon: "fas fa-globe", isPrimary: false },
      { internalType: "Number", display: "Number", tooltip: "Numerical (five, twenty)", icon: "fas fa-hashtag", isPrimary: true },
      { internalType: "Exclamation", display: "Exclamation", tooltip: "Interjection (wow, oops)", icon: "fas fa-bullhorn", isPrimary: true }
    ]
  };

  // ====================================================
  // 6. PLACEHOLDER & FORM HANDLING FUNCTIONS
  // ====================================================
  const insertNodeAtCaret = (node, range) => {
    if (range) {
      range.deleteContents();
      range.insertNode(node);
      const newRange = document.createRange();
      newRange.setStartAfter(node);
      newRange.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      const sel = window.getSelection();
      if (sel.rangeCount) {
        const r = sel.getRangeAt(0);
        r.deleteContents();
        r.insertNode(node);
        r.setStartAfter(node);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
  };

  const insertPlaceholderSpan = (placeholderID, displayText, range) => {
    const span = document.createElement("span");
    span.className = "placeholder";
    span.setAttribute("data-id", placeholderID);
    span.setAttribute("title", placeholderID);
    span.setAttribute("contenteditable", "false");
    span.textContent = displayText;
    insertNodeAtCaret(span, range);

    // Append extra space if needed
    if (!displayText.endsWith(" ")) {
      if (span.parentNode) {
        let nextNode = span.nextSibling;
        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
          if (!/^\s/.test(nextNode.textContent)) {
            span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
          }
        } else if (nextNode) {
          span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
        } else {
          span.parentNode.appendChild(document.createTextNode(" "));
        }
      }
    }
  };

  const duplicatePlaceholder = (variable) => {
    State.usageTracker[variable.id] = (State.usageTracker[variable.id] || 0) + 1;
    const newId = variable.id;
    const editor = document.getElementById("storyText");
    let rangeToUse = (State.lastRange && editor.contains(State.lastRange.commonAncestorContainer))
      ? State.lastRange
      : (() => {
        ensureEditorFocus();
        const sel = window.getSelection();
        return sel.rangeCount ? sel.getRangeAt(0) : null;
      })();
    const displayText = variable.displayOverride || variable.officialDisplay;
    insertPlaceholderSpan(newId, displayText, rangeToUse);
    State.lastRange = null;
  };

  const ensureEditorFocus = () => {
    const editor = document.getElementById("storyText");
    const sel = window.getSelection();
    if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
      editor.focus();
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const insertPlaceholder = async (internalType, displayName, isCustom) => {
    const sanitized = Utils.sanitizeString(internalType);
    const editor = document.getElementById("storyText");
    const spans = editor.querySelectorAll(".placeholder");
    let max = 0;
    spans.forEach(span => {
      const id = span.getAttribute("data-id");
      if (id.startsWith(sanitized)) {
        const match = id.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > max) max = num;
        }
      }
    });
    const newCount = max + 1;
    State.variableCounts[sanitized] = newCount;
    const id = sanitized + newCount;
    let rangeToUse = (State.lastRange && editor.contains(State.lastRange.commonAncestorContainer))
      ? State.lastRange
      : (() => {
        ensureEditorFocus();
        const sel = window.getSelection();
        return sel.rangeCount ? sel.getRangeAt(0) : null;
      })();
    let selectedText = "";
    if (rangeToUse && !rangeToUse.collapsed) {
      selectedText = rangeToUse.toString().trim();
    }
    let displayText = selectedText || displayName;
    if (!selectedText) {
      const { value: temp } = await Swal.fire({
        title: 'Enter temporary word',
        input: 'text',
        inputLabel: 'Temporary fill word for this placeholder',
        inputValue: displayName,
        showCancelButton: true
      });
      if (temp) displayText = temp;
    }
    insertPlaceholderSpan(id, displayText, rangeToUse);
    if (!State.variables.some(v => v.id === id)) {
      State.variables.push({
        id,
        internalType,
        officialDisplay: displayName,
        display: displayName,
        isCustom: !!isCustom,
        order: State.insertionCounter++,
        displayOverride: displayText
      });
    }
    updateVariablesList();
    State.lastRange = null;
    if (internalType.startsWith("NN") && selectedText) {
      Swal.fire({
        title: 'Apply placeholder to all occurrences?',
        text: `Replace all instances of "${selectedText}" with this placeholder?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, apply',
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          applyPlaceholderToAllOccurrences(selectedText, id, displayText);
        }
      });
    }
  };

  const insertPronounPlaceholderSimple = (groupId, form, tempValue) => {
    const editor = document.getElementById("storyText");
    ensureEditorFocus();
    const sel = window.getSelection();
    const range = (State.lastRange && editor.contains(State.lastRange.commonAncestorContainer))
      ? State.lastRange
      : (sel.rangeCount ? sel.getRangeAt(0) : null);
    const groupNum = groupId.replace('PronounGroup', '');
    const formAbbrevMap = { subject: 'SUB', object: 'OBJ', possAdj: 'PSA', possPron: 'PSP', reflexive: 'REF' };
    const abbrev = formAbbrevMap[form] || form.toUpperCase();
    const placeholderId = `PRP${groupNum}${abbrev}`;
    if (!State.variables.some(v => v.id === placeholderId)) {
      const displayType = `Person (${form})`;
      State.variables.push({
        id: placeholderId,
        internalType: `PRONOUN|${groupId}|${form}`,
        officialDisplay: displayType,
        display: displayType,
        isCustom: false,
        order: State.insertionCounter++,
        displayOverride: tempValue
      });
      updateVariablesList();
    }
    insertPlaceholderSpan(placeholderId, tempValue, range);
    State.lastRange = null;
  };

  const choosePronounTempValue = (form, groupId) => {
    return Swal.fire({
      title: 'Select Temporary Pronoun',
      input: 'radio',
      inputOptions: {
        'He/Him': 'He/Him',
        'She/Her': 'She/Her',
        'They/Them': 'They/Them',
        'Custom': 'Custom'
      },
      inputValidator: (value) => {
        if (!value) return 'You need to choose an option!';
      }
    }).then(result => {
      if (result.value === 'Custom') {
        return Swal.fire({
          title: 'Enter custom temporary pronoun',
          input: 'text',
          inputLabel: 'Temporary pronoun',
          inputValue: form,
          showCancelButton: true
        }).then(res => res.value || form);
      } else {
        return result.value;
      }
    });
  };

  const formatLabel = (variable) =>
    variable.displayOverride && variable.displayOverride !== variable.officialDisplay
      ? `${variable.displayOverride} (${variable.officialDisplay})`
      : variable.officialDisplay;

  const updateVariablesList = () => {
    const container = document.getElementById('existingPlaceholdersContainer');
    container.innerHTML = '';
    State.variables.sort((a, b) =>
      (State.usageTracker[b.id] || 0) - (State.usageTracker[a.id] || 0) || a.order - b.order
    );
    State.variables.forEach(v => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-secondary btn-sm m-1 placeholder-item';
      btn.setAttribute('data-id', v.id);
      btn.textContent = v.displayOverride || v.officialDisplay;
      btn.setAttribute('title', v.id);
      container.appendChild(btn);
    });
  };

  // ====================================================
  // 7. UPDATE PLACEHOLDER ACCORDION
  // ====================================================
  const updatePlaceholderAccordion = (accordionSelector, noResultsSelector, searchVal = '') => {
    if (noResultsSelector === "#noResults") {
      $("#searchQuery").text(searchVal);
      $("#searchQueryBtn").text(searchVal);
    } else if (noResultsSelector === "#modalNoResults") {
      $("#modalSearchQuery").text(searchVal);
      $("#modalSearchQueryBtn").text(searchVal);
    }
    $(noResultsSelector).hide();
    const accordion = $(accordionSelector);
    accordion.empty();
    categoryOrder.forEach(categoryName => {
      const placeholders = allPlaceholders[categoryName] || [];
      if (placeholders.length > 0) {
        const categoryCard = createPlaceholderCategoryCard(categoryName, accordionSelector, placeholders, searchVal);
        accordion.append(categoryCard);
      }
    });
    if (State.customPlaceholders.length > 0) {
      const customCard = createCustomPlaceholderCategoryCard(accordionSelector, searchVal);
      accordion.append(customCard);
    }
    if (searchVal) {
      const anyShown = accordion.find('.placeholder-btn:visible').length > 0;
      $(noResultsSelector).toggle(!anyShown);
      accordion.find('.card-header, .show-more-toggle').hide();
    } else {
      accordion.find('.card-header, .show-more-toggle').show();
    }
  };

  const createPlaceholderCategoryCard = (categoryName, accordionSelector, placeholders, searchVal) => {
    const sanitizedCategoryName = categoryName.replace(/\s+/g, '');
    const card = $(`<div class='card'></div>`);
    card.append(createCardHeader(categoryName, sanitizedCategoryName, accordionSelector));
    const collapseDiv = $(`
      <div id='${sanitizedCategoryName}Collapse' class='collapse show' aria-labelledby='${sanitizedCategoryName}Heading' data-parent='${accordionSelector}'>
        <div class='card-body'><div class='list-group'></div></div>
      </div>
    `);
    const primaryItems = placeholders.filter(p => p.isPrimary);
    const secondaryItems = placeholders.filter(p => !p.isPrimary);
    primaryItems.forEach(p => appendPlaceholderItem(collapseDiv.find('.list-group'), p, searchVal));
    if (secondaryItems.length > 0) {
      const secondaryPlaceholderWrapper = createSecondaryPlaceholderWrapper(secondaryItems, searchVal);
      collapseDiv.find('.list-group').append(secondaryPlaceholderWrapper);
      collapseDiv.find('.list-group').append(createShowMoreToggle(sanitizedCategoryName));
      updateShowMoreToggleVisibility(collapseDiv, searchVal, secondaryPlaceholderWrapper);
    }
    card.append(collapseDiv);
    return card;
  };

  const createCustomPlaceholderCategoryCard = (accordionSelector, searchVal) => {
    const card = $(`<div class='card'></div>`);
    card.append(createCardHeader('Custom Placeholders', 'CustomPlaceholders', accordionSelector));
    const collapseDiv = $(`
      <div id='CustomPlaceholdersCollapse' class='collapse show' aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
        <div class='card-body'><div class='list-group'></div></div>
      </div>
    `);
    State.customPlaceholders.forEach(p => {
      const showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
      const item = $(`
        <div class='list-group-item placeholder-btn custom-placeholder'
          data-internal='${p.type}'
          data-display='${p.type}'
          style='display: ${showItem ? 'block' : 'none'};'>
          <i class='fas fa-star'></i> ${p.type}
        </div>
      `);
      collapseDiv.find('.list-group').append(item);
    });
    card.append(collapseDiv);
    return card;
  };

  const createCardHeader = (categoryName, sanitizedCategoryName, accordionSelector) => {
    return $(`
      <div class='card-header' id='${sanitizedCategoryName}Heading'>
        <h2 class='mb-0'>
          <button class='btn btn-link btn-block text-left' type='button'
            data-toggle='collapse' data-target='#${sanitizedCategoryName}Collapse'
            aria-expanded='true' aria-controls='${sanitizedCategoryName}Collapse'>
            ${categoryName}
          </button>
        </h2>
      </div>
    `);
  };

  const createSecondaryPlaceholderWrapper = (secondaryItems, searchVal) => {
    const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
    secondaryItems.forEach(p => appendPlaceholderItem(hiddenWrapper, p, searchVal, true));
    return hiddenWrapper;
  };

  const createShowMoreToggle = (sanitizedCategoryName) => {
    return $(`
      <div class='show-more-toggle' data-category='${sanitizedCategoryName}'>
        Show More
      </div>
    `);
  };

  const updateShowMoreToggleVisibility = (collapseDiv, searchVal, secondaryPlaceholderWrapper) => {
    const toggleLink = collapseDiv.find('.show-more-toggle');
    if (!searchVal) {
      secondaryPlaceholderWrapper.find('.secondary-placeholder').hide();
      toggleLink.text('Show More');
    } else {
      let anySecondaryVisible = secondaryPlaceholderWrapper.find('.secondary-placeholder:visible').length > 0;
      toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
    }
  };

  const appendPlaceholderItem = (listGroup, placeholder, searchVal, isSecondary = false) => {
    const showItem = !searchVal || placeholder.display.toLowerCase().includes(searchVal.toLowerCase());
    const item = $(`
      <div class='list-group-item placeholder-btn${isSecondary ? ' secondary-placeholder' : ''}'
        data-internal='${placeholder.internalType}'
        data-display='${placeholder.display}'
        style='display: ${showItem ? 'block' : 'none'};'>
        <i class='${placeholder.icon}'></i> ${placeholder.display}
        <i class='fas fa-info-circle accordion-info-icon' data-tooltip="${placeholder.tooltip}" style="font-size:0.8em; margin-left:5px;"></i>
      </div>
    `);
    listGroup.append(item);
  };

  // ====================================================
  // 8. PLACEHOLDER SELECTION & INFO ICON HANDLERS
  // ====================================================
  $(document).on('click', '.accordion-info-icon', (e) => {
    e.stopPropagation();
    const tooltip = $(e.currentTarget).data('tooltip');
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: tooltip,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  });
  $(document).on('click', '.fill-info-icon', (e) => {
    e.stopPropagation();
    const type = $(e.currentTarget).data('type');
    const tooltip = TypeHelpers.getTooltipForType(type);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: tooltip,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  });
  $(document).on('click', '.show-more-toggle', function () {
    const parentList = $(this).closest('.list-group');
    const hiddenItems = parentList.find('.secondary-placeholder-wrapper .secondary-placeholder');
    const link = $(this);
    link.text(link.text() === 'Show More' ? 'Show Less' : 'Show More');
    hiddenItems.toggle();
  });

  // ====================================================
  // 9. CUSTOM PLACEHOLDER HANDLERS & SAVED STORIES SORTING
  // ====================================================
  const addNewCustomPlaceholderWithUsage = (rawText, usage) => {
    let internal;
    if (usage === "noun") {
      internal = "NN_" + Utils.pascalCase(rawText);
    } else if (usage === "verb") {
      internal = "VB_" + Utils.pascalCase(rawText);
    } else {
      internal = Utils.pascalCase(rawText);
    }
    if (!State.customPlaceholders.some(p => p.type === internal)) {
      State.customPlaceholders.push({ type: internal });
    }
  };
  const addNewCustomPlaceholder = (rawText) => {
    const internal = Utils.pascalCase(rawText);
    if (!State.customPlaceholders.some(p => p.type === internal)) {
      State.customPlaceholders.push({ type: internal });
    }
  };
  const insertPlaceholderFromCustom = (rawText) => {
    const internal = Utils.pascalCase(rawText);
    const display = Utils.naturalDisplay(internal);
    insertPlaceholder(internal, display, true);
  };
  $('#addCustomPlaceholderBtn').on('click', () => {
    const raw = $('#placeholderSearch').val();
    const usage = $('input[name="customPlaceholderType"]:checked').val() || "generic";
    if (usage === "noun") {
      addNewCustomPlaceholderWithUsage(raw, "noun");
      showNounNumberSelection("NN_" + Utils.pascalCase(raw), Utils.naturalDisplay(raw));
    } else if (usage === "verb") {
      addNewCustomPlaceholderWithUsage(raw, "verb");
      showVerbTenseSelection("VB_" + Utils.pascalCase(raw), Utils.naturalDisplay(raw));
    } else {
      addNewCustomPlaceholder(raw);
      insertPlaceholderFromCustom(raw);
    }
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
  });
  $('#modalAddCustomPlaceholderBtn').on('click', () => {
    const raw = $('#modalPlaceholderSearch').val();
    const usage = $('input[name="modalCustomPlaceholderType"]:checked').val() || "generic";
    if (usage === "noun") {
      addNewCustomPlaceholderWithUsage(raw, "noun");
      showNounNumberSelection("NN_" + Utils.pascalCase(raw), Utils.naturalDisplay(raw));
    } else if (usage === "verb") {
      addNewCustomPlaceholderWithUsage(raw, "verb");
      showVerbTenseSelection("VB_" + Utils.pascalCase(raw), Utils.naturalDisplay(raw));
    } else {
      addNewCustomPlaceholder(raw);
      insertPlaceholderFromCustom(raw);
    }
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
    $('#placeholderModal').modal('hide');
    $('#modalPlaceholderSearch').val('');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
  });

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
        // New step for person placeholders
        showPersonTypeSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        return;
      }
      // Otherwise, proceed as usual with number selection
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
    if (window.isEditingPlaceholder && State.currentEditingVariable) {
      updateExistingPlaceholder(State.currentEditingVariable, internalType, displayName);
      window.isEditingPlaceholder = false;
      State.currentEditingVariable = null;
    } else {
      insertPlaceholder(internalType, displayName, false);
    }
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
  });

  $(document).on('click', '.placeholder-btn', (e) => {
    if (State.placeholderInsertionInProgress) return;
    State.placeholderInsertionInProgress = true;
    if ($(e.currentTarget).closest('#modalPlaceholderAccordion').length > 0) {
      State.placeholderInsertionInProgress = false;
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    const internalType = $(e.currentTarget).data('internal');
    const displayName = $(e.currentTarget).data('display');
    if (window.isEditingPlaceholder && State.currentEditingVariable) {
      updateExistingPlaceholder(State.currentEditingVariable, internalType, displayName);
      window.isEditingPlaceholder = false;
      State.currentEditingVariable = null;
      $('#placeholderModal').modal('hide');
    } else {
      if (internalType === "PRONOUN") {
        pickPronounFormAndGroup();
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        State.placeholderInsertionInProgress = false;
        return;
      }
      if (internalType.indexOf("NN") === 0) {
        if (internalType === "NN_Person") {
          showPersonTypeSelection(internalType, displayName);
          $('#placeholderSearch').val('');
          updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
          State.placeholderInsertionInProgress = false;
          return;
        }
        showNounNumberSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        State.placeholderInsertionInProgress = false;
        return;
      }
      if (internalType.indexOf("VB") === 0 || internalType === "MD") {
        showVerbTenseSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        State.placeholderInsertionInProgress = false;
        return;
      }
      insertPlaceholder(internalType, displayName, false);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    }
    setTimeout(() => { State.placeholderInsertionInProgress = false; }, 50);
  });

  // ====================================================
  // 10. VERB & NOUN SELECTION MODALS
  // ====================================================
  const showPersonTypeSelection = (baseInternal, baseDisplay) => {
    let html = `<div class='list-group'>
      <button class='list-group-item list-group-item-action person-type-btn' data-type='common'>
        Common (e.g., doctor)
      </button>
      <button class='list-group-item list-group-item-action person-type-btn' data-type='proper'>
        Proper (e.g., Donald Trump)
      </button>
    </div>`;
    Swal.fire({
      title: 'Select Person Type',
      html,
      showCancelButton: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        $(container).find('.person-type-btn').on('click', function () {
          const selectedType = $(this).data('type'); // "common" or "proper"
          let updatedBaseInternal, updatedBaseDisplay;
          if (selectedType === "proper") {
            updatedBaseInternal = "NNP_Person";
            updatedBaseDisplay = "Proper " + baseDisplay;
          } else {
            updatedBaseInternal = "NN_Person";
            updatedBaseDisplay = "Common " + baseDisplay;
          }
          // Close the current modal...
          Swal.close();
          // ...and use a small timeout to ensure it’s fully closed before showing the next modal.
          setTimeout(() => {
            showNounNumberSelection(updatedBaseInternal, updatedBaseDisplay);
          }, 100);
        });
      }
    });
  };

  const showNounNumberSelection = (baseInternal, baseDisplay) => {
    let html = `<div class='list-group'>`;
    ['Singular', 'Plural'].forEach(f => {
      html += `<button class='list-group-item list-group-item-action noun-number-btn' data-form='${f}'>${f}</button>`;
    });
    html += `</div>`;
    Swal.fire({
      title: 'Select Number',
      html,
      showCancelButton: true,
      showConfirmButton: false,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        $(container).find('.noun-number-btn').on('click', async function () {
          const selected = $(this).data('form');
          const finalInternal = TypeHelpers.getNounFinalType(baseInternal, selected);
          const finalDisplay = `${baseDisplay} (${selected})`;
          if (window.isEditingPlaceholder && State.currentEditingVariable) {
            updateExistingPlaceholder(State.currentEditingVariable, finalInternal, finalDisplay);
            window.isEditingPlaceholder = false;
            State.currentEditingVariable = null;
            Swal.close();
          } else {
            await insertPlaceholder(finalInternal, finalDisplay, false);
            Swal.close();
          }
        });
      }
    });
  };

  const VERB_TENSES = [
    { value: 'VB', text: 'Base (run)' },
    { value: 'VBP', text: 'Present (I walk)' },
    { value: 'VBZ', text: 'Present 3rd (he leaves)' },
    { value: 'VBD', text: 'Past (slept)' },
    { value: 'VBG', text: 'Gerund (crying)' },
    { value: 'VBN', text: 'Past Participle (eaten)' }
  ];
  const showVerbTenseSelection = (baseInternal, baseDisplay) => {
    let html = `<div class='list-group'>`;
    VERB_TENSES.forEach(t => {
      html += `<button class='list-group-item list-group-item-action verb-tense-btn' data-tense='${t.value}' data-text='${t.text}'>${t.text}</button>`;
    });
    html += `</div>`;
    Swal.fire({
      title: 'Select Verb Tense',
      html,
      showCancelButton: true,
      showConfirmButton: false,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        $(container).find('.verb-tense-btn').on('click', async function () {
          const selectedTense = $(this).data('tense');
          const tenseText = $(this).data('text');
          const finalInternal = TypeHelpers.computeFinalVerbType(baseInternal, selectedTense);
          const finalDisplay = `${baseDisplay} (${tenseText})`;
          if (window.isEditingPlaceholder && State.currentEditingVariable) {
            updateExistingPlaceholder(State.currentEditingVariable, finalInternal, finalDisplay);
            window.isEditingPlaceholder = false;
            State.currentEditingVariable = null;
            Swal.close();
          } else {
            await insertPlaceholder(finalInternal, finalDisplay, false);
            Swal.close();
          }
        });
      }
    });
  };

  // ====================================================
  // 11. PRONOUN HANDLERS
  // ====================================================
  const pickPronounFormAndGroup = () => {
    const forms = [
      { value: 'subject', text: 'Subject (he, she, they)' },
      { value: 'object', text: 'Object (him, her, them)' },
      { value: 'possAdj', text: 'Possessive Adj. (his, her, their)' },
      { value: 'possPron', text: 'Possessive Pron. (his, hers)' },
      { value: 'reflexive', text: 'Reflexive (himself, herself)' }
    ];
    let html = `<div class='list-group mb-2'>`;
    forms.forEach(f => {
      html += `<button class='list-group-item list-group-item-action pronoun-form-btn' data-form='${f.value}'>${f.text}</button>`;
    });
    html += `</div>`;
    Swal.fire({
      title: 'Pick a Pronoun Form',
      html,
      showCancelButton: true,
      showConfirmButton: false,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        $(container).find('.pronoun-form-btn').on('click', function () {
          const chosenForm = $(this).data('form');
          Swal.close();
          pickPronounGroup(chosenForm);
        });
      }
    });
  };

  const pickPronounGroup = (form) => {
    // IMPORTANT: Use State.pronounGroups here.
    const groupKeys = Object.keys(State.pronounGroups);
    let html = '';
    if (groupKeys.length > 0) {
      html += `<h5>Existing Pronoun Groups</h5><div class='list-group mb-2'>`;
      groupKeys.forEach(g => {
        html += `<button class='list-group-item list-group-item-action pronoun-group-btn' data-group='${g}'>${g}</button>`;
      });
      html += `</div><hr>`;
    }
    html += `<button class='btn btn-sm btn-outline-primary' id='createNewPronounGroupBtn'>Create New Group</button>`;
    Swal.fire({
      title: 'Pick a Pronoun Group',
      html,
      showCancelButton: true,
      showConfirmButton: false,
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        $(container).find('.pronoun-group-btn').on('click', function () {
          const grp = $(this).data('group');
          Swal.close();
          if (State.pronounGroups[grp] && State.pronounGroups[grp][form]) {
            insertPronounPlaceholderSimple(grp, form, State.pronounGroups[grp][form]);
          } else {
            choosePronounTempValue(form, grp).then(tempValue => {
              State.pronounGroups[grp] = pronounMapping[tempValue] || { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
              insertPronounPlaceholderSimple(grp, form, State.pronounGroups[grp][form]);
            });
          }
        });
        $(container).find('#createNewPronounGroupBtn').on('click', function () {
          State.pronounGroupCount++;
          const newGroup = `PronounGroup${State.pronounGroupCount}`;
          State.pronounGroups[newGroup] = {};
          Swal.close();
          choosePronounTempValue(form, newGroup).then(tempValue => {
            State.pronounGroups[newGroup] = pronounMapping[tempValue] || { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
            insertPronounPlaceholderSimple(newGroup, form, State.pronounGroups[newGroup][form]);
          });
        });
      }
    });
  };

  // ====================================================
  // 12. BUILD THE FILL-IN-THE-BLANK FORM
  // ====================================================
  const buildFillForm = () => {
    const form = $('#inputForm').empty();
    appendPronounGroupsToForm(form);
    appendNonPronounVariablesToForm(form);
  };

  const appendPronounGroupsToForm = (form) => {
    const groupSet = getPronounGroups();
    const sortedGroups = Array.from(groupSet).sort((a, b) => a.localeCompare(b));
    if (sortedGroups.length > 0) {
      form.append(`<h4>Pronouns</h4>`);
      sortedGroups.forEach(g => {
        const block = createPronounGroupBlock(g);
        form.append(block);
      });
      form.on('change', "input[type='radio']", handlePronounChoiceChange);
    }
  };

  const getPronounGroups = () => {
    const groupSet = new Set();
    for (const v of State.variables) {
      if (v.internalType.startsWith('PRONOUN|')) {
        const parts = v.internalType.split('|');
        groupSet.add(parts[1]);
      }
    }
    return groupSet;
  };

  const createPronounGroupBlock = (groupName) => {
    const block = $(`
      <div class='form-group'>
        <label id='${groupName}-label' title="Hover to see internal ID">
          ${groupName} - Person (select pronoun)
          <i class="fas fa-info-circle fill-info-icon" data-type="${groupName}" style="font-size:0.8em; margin-left:5px;"></i>
        </label>
      </div>
    `);
    const radios = `
      <div class='form-check'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='HeHim'>
        <label class='form-check-label'>He/Him</label>
      </div>
      <div class='form-check'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='SheHer'>
        <label class='form-check-label'>She/Her</label>
      </div>
      <div class='form-check'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='TheyThem'>
        <label class='form-check-label'>They/Them</label>
      </div>
      <div class='form-check mb-2'>
        <input type='radio' class='form-check-input' name='${groupName}-choice' value='Custom'>
        <label class='form-check-label'>Custom</label>
      </div>
      <input type='text' class='form-control form-control-sm d-none' id='${groupName}-custom'
        placeholder='comma-separated: subject, object, possAdj, possPron, reflexive'>
    `;
    block.append(radios);
    return block;
  };

  const handlePronounChoiceChange = function () {
    const groupName = $(this).attr('name').replace('-choice', '');
    if ($(this).val() === 'Custom') {
      $(`#${groupName}-custom`).removeClass('d-none');
    } else {
      $(`#${groupName}-custom`).addClass('d-none');
    }
  };

  const appendNonPronounVariablesToForm = (form) => {
    let nonPronounVars = State.variables.filter(v => !v.internalType.startsWith('PRONOUN|'));
    if (State.fillOrder === 'alphabetical') {
      nonPronounVars.sort((a, b) => a.officialDisplay.localeCompare(b.officialDisplay));
    } else if (State.fillOrder === 'random') {
      nonPronounVars.sort(() => Math.random() - 0.5);
    }
    nonPronounVars.forEach(variable => {
      const groupRow = createInputRow(variable);
      form.append(groupRow);
    });
  };

  const createInputRow = (variable) => {
    const groupRow = $(`
      <div class="form-group input-row">
        <div class="row">
          <div class="col-sm-4">
            <label class="input-label" title="Internal ID: ${variable.id}">
              ${variable.officialDisplay}
            </label>
          </div>
          <div class="col-sm-8">
            <input type="text"
              class="form-control form-control-sm compact-input"
              name="${variable.id}"
              data-label="${variable.officialDisplay}">
          </div>
        </div>
      </div>
    `);
    if (State.fillValues[variable.id]) {
      groupRow.find('input').val(State.fillValues[variable.id]);
    }
    return groupRow;
  };

  // ====================================================
  // 13. EVENT HANDLERS & DOCUMENT READY
  // ====================================================
  $(document).ready(() => {
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

    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
    $('#filterTag').on('input', Utils.debounce(() => {
      Storage.loadSavedStoriesList();
    }, 300));

    $('#sortOption').on('change', () => {
      Storage.loadSavedStoriesList();
    });

    // Attach event handlers for the ordering buttons
    $('#alphabeticalOrderBtn').on('click', function () {
      // Set the fill order to alphabetical
      State.fillOrder = 'alphabetical';
      // Update button styling (optional)
      $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
      $('#randomOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
      // Rebuild the fill form to reflect the new order
      buildFillForm();
    });

    $('#randomOrderBtn').on('click', function () {
      // Set the fill order to random
      State.fillOrder = 'random';
      // Update button styling (optional)
      $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
      $('#alphabeticalOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
      // Rebuild the fill form to reflect the new order
      buildFillForm();
    });

    // NEW: Attach autocomplete to the tag filter input in the saved stories modal.
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

    // NEW: Event handler for applying filters in the saved stories modal.
    $('#applyFilters').on('click', () => {
      Storage.loadSavedStoriesList();
    });

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

    const fallbackCopyTextToClipboard = (text) => {
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

    document.getElementById('existingPlaceholdersContainer').addEventListener('click', (e) => {
      const btn = e.target.closest('.placeholder-item');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const variable = State.variables.find(v => v.id === id);
      if (variable) duplicatePlaceholder(variable);
    });

    $('#storyText').on('input', () => {
      updateVariablesFromEditor();
      State.storyHasUnsavedChanges = true;
    });

    $('#uploadStoryBtn').on('click', () => { $('#uploadStory').click(); });
    $('#uploadStory').on('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const titleMatch = content.match(/^Title:\s*(.*)$/m);
        const authorMatch = content.match(/^Author:\s*(.*)$/m);
        // ... (rest of the file-upload logic)
      };
      reader.readAsText(file);
    });

    $('#saveStoryToSite').on('click', () => {
      Storage.addCurrentStoryToSavedStories();
    });

    $('#startGame').on('click', () => {
      buildFillForm();
      $('#inputs').removeClass('d-none');
      $('#editor, #result').addClass('d-none');
    });

    // ... (Any additional event handlers)
  });
})();
