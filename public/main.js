"use strict";
(function () {
  // ====================================================
  // 1. UTILITY FUNCTIONS
  // ====================================================
  const Utils = {
    debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    },
    toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    pascalCase(str) {
      return str.toLowerCase().split(/\s+/).map(Utils.capitalize).join('');
    },
    naturalDisplay(str) {
      // Inserts a space between a lowercase letter followed by an uppercase letter.
      return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    },
    sanitizeString(str) {
      return str.replace(/[^a-zA-Z0-9_]/g, '');
    }
  };

  // ----------------------------------------------------
  // NEW: HTML Entities Decoder Function
  // ----------------------------------------------------
  /**
   * Decodes HTML entities in a string.
   * For example, it converts "&lt;" back to "<" and "&gt;" back to ">".
   */
  function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  // ====================================================
  // 2. GLOBAL STATE VARIABLES
  // ====================================================
  let variables = [];
  let variableCounts = {};
  let insertionCounter = 0;
  let storyText = '';
  let customPlaceholders = [];
  let fillValues = {};
  let pronounGroups = {}; // Stores each pronoun group’s temporary mapping.
  let pronounGroupCount = 0;
  let lastRange = null;
  // Tracks how often each placeholder (by its id) is used.
  let usageTracker = {};
  let placeholderInsertionInProgress = false;
  let storyHasUnsavedChanges = false;
  let fillOrder = 'alphabetical'; // default order is alphabetical



  // Predefined mapping for temporary pronoun values.
  const pronounMapping = {
    "He/Him": { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
    "She/Her": { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
    "They/Them": { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
  };

  // ====================================================
  // 2a. Capture Selection Changes
  // ====================================================
  document.addEventListener('selectionchange', function () {
    const editor = document.getElementById("storyText");
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      lastRange = sel.getRangeAt(0);
    }
  });

  // ====================================================
  // 3. STORAGE HELPER FUNCTIONS (Server-side)
  // ====================================================
  const Storage = {
    handleAjaxError(xhr, statusText, errorThrown, customErrorMessage) { // Improved error handling function
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
    addCurrentStoryToSavedStories() {
      const story = {
        storyTitle: $('#storyTitle').val(),
        storyAuthor: $('#storyAuthor').val(),
        storyText: $('#storyText').html(),
        variables,
        pronounGroups,
        variableCounts,
        pronounGroupCount,
        customPlaceholders,
        savedAt: new Date().toISOString()
      };
      $.ajax({
        url: '/api/savestory',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(story),
        success: function () {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Story saved to site!',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: function (xhr, statusText, errorThrown) {
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
                  success: function () {
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'success',
                      title: 'Story overwritten!',
                      showConfirmButton: false,
                      timer: 1500
                    });
                  },
                  error: function (xhrOverwrite, statusTextOverwrite, errorThrownOverwrite) {
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
    addCompletedStoryToSavedStories() {
      const story = {
        storyTitle: $('#displayTitle').text(),
        storyAuthor: $('#displayAuthor').text(),
        storyText: storyText,
        variables,
        pronounGroups,
        variableCounts,
        pronounGroupCount,
        customPlaceholders,
        savedAt: new Date().toISOString()
      };
      $.ajax({
        url: '/api/savestory',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(story),
        success: function () {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Completed story saved to site!',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: function (xhr, statusText, errorThrown) {
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
                  success: function () {
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      icon: 'success',
                      title: 'Completed story overwritten!',
                      showConfirmButton: false,
                      timer: 1500
                    });
                  },
                  error: function (xhrOverwrite, statusTextOverwrite, errorThrownOverwrite) {
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
    loadSavedStoriesList() {
      $.ajax({
        url: '/api/getstories',
        method: 'GET',
        success: function (stories) {
          const listContainer = $('#savedStoriesList');
          listContainer.empty();
          if (stories.length === 0) {
            listContainer.append('<p>No stories saved yet.</p>');
            return;
          }
          stories.forEach((story, index) => {
            const dateObj = new Date(story.savedAt);
            const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
            const item = Storage.createSavedStoryListItem(story, index, dateStr);
            listContainer.append(item);
          });
        },
        error: function (xhr, statusText, errorThrown) {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load saved stories list');
        }
      });
    },
    createSavedStoryListItem(story, index, dateStr) {
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
    loadSavedStory(index, mode = "edit") {
      $.ajax({
        url: '/api/getstories',
        method: 'GET',
        success: function (stories) {
          const story = stories[index];
          if (!story) return;
          Storage.populateEditorWithStory(story, mode);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Story loaded!',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: function (xhr, statusText, errorThrown) {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load saved story');
        }
      });
    },
    populateEditorWithStory(story, mode) { // Modular function to populate editor
      $('#storyTitle').val(story.storyTitle);
      $('#storyAuthor').val(story.storyAuthor);
      // Decode the escaped HTML entities before inserting into the editor.
      $('#storyText').html(decodeHTMLEntities(story.storyText));
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
    deleteSavedStory(title) {
      $.ajax({
        url: '/api/deletestory',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ storyTitle: title }),
        success: function () {
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
        error: function (xhr, statusText, errorThrown) {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to delete story');
        }
      });
    }
  };

  // ====================================================
  // 4. TYPE HELPER FUNCTIONS
  // ====================================================
  const TypeHelpers = {
    naturalizeType(type) {
      if (type.startsWith("NNPS")) {
        let sub = type.substring(4);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Proper Noun")) + " (Plural)";
      }
      if (type.startsWith("NNP")) {
        let sub = type.substring(3);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        return Utils.toTitleCase(Utils.naturalDisplay(sub || "Proper Noun")) + " (Singular)";
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
          if (category) {
            return Utils.toTitleCase(category) + " Verb (" + verbTenseMap[tense] + ")";
          } else {
            return "Verb (" + verbTenseMap[tense] + ")";
          }
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
    getTooltipForType(type) {
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
    getOriginalDisplayForType(type) {
      for (let category in allPlaceholders) {
        for (let p of allPlaceholders[category]) {
          if (p.internalType === type) {
            return p.display;
          }
        }
      }
      if (type.startsWith("NN")) {
        return TypeHelpers.naturalizeType(type);
      }
      return type;
    },
    guessTypeFromId(id) {
      let base = id.replace(/\d+$/, '');
      const custom = customPlaceholders.find(p => p.type === base);
      if (custom) return custom.type;
      const pronounFixedRe = /^PRP(\d+)(SUB|OBJ|PSA|PSP|REF)$/;
      if (pronounFixedRe.test(id)) {
        const match = id.match(pronounFixedRe);
        const groupNum = match[1];
        const abbrev = match[2];
        const formMapReverse = {
          SUB: "subject",
          OBJ: "object",
          PSA: "possAdj",
          PSP: "possPron",
          REF: "reflexive"
        };
        const formFull = formMapReverse[abbrev];
        return `PRONOUN|PronounGroup${groupNum}|${formFull}`;
      }
      const pronounRe = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)$/;
      if (pronounRe.test(base)) {
        let m = base.match(pronounRe);
        return `PRONOUN|${m[1]}|${m[2]}`;
      }
      return this.naturalizeType(base);
    },
    getNounFinalType(baseInternal, number) {
      let baseTag = "";
      let extra = "";
      if (baseInternal.indexOf("_") !== -1) {
        let parts = baseInternal.split("_");
        baseTag = parts[0];
        extra = parts.slice(1).join("_");
      } else {
        baseTag = baseInternal;
      }
      let finalTag = "";
      if (baseTag === "NN") {
        finalTag = (number === "Singular") ? "NN" : "NNS";
      } else if (baseTag === "NNP") {
        finalTag = (number === "Singular") ? "NNP" : "NNPS";
      } else {
        finalTag = (number === "Singular") ? baseTag : baseTag + "S";
      }
      return extra ? finalTag + "_" + extra : finalTag;
    },
    computeFinalVerbType(baseInternal, tenseTag) {
      if (baseInternal === "MD") {
        return "MD_" + tenseTag;
      }
      let parts = baseInternal.split("_");
      let baseCategory = parts.slice(1).join("_");
      return baseCategory ? tenseTag + "_" + baseCategory : tenseTag;
    }
  };

  // ====================================================
  // 5. PLACEHOLDER DEFINITIONS & CATEGORY ORDER
  // ====================================================
  const categoryOrder = [
    "Nouns",
    "Verbs",
    "Descriptors",
    "Other",
  ];
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
      { internalType: "JJ_Number", display: "Ordered Number", tooltip: "A ranked number (1st, seventh)", icon: "fas fa-hashtag", isPrimary: true },

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
  function insertNodeAtCaret(node, range) {
    if (range) {
      range.deleteContents();
      range.insertNode(node);
      let newRange = document.createRange();
      newRange.setStartAfter(node);
      newRange.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      const sel = window.getSelection();
      if (sel.rangeCount) {
        let r = sel.getRangeAt(0);
        r.deleteContents();
        r.insertNode(node);
        r.setStartAfter(node);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
  }

  function insertPlaceholderSpan(placeholderID, displayText, range) {
    const span = document.createElement("span");
    span.className = "placeholder";
    span.setAttribute("data-id", placeholderID);
    span.setAttribute("title", placeholderID);
    span.setAttribute("contenteditable", "false");
    span.textContent = displayText;
    insertNodeAtCaret(span, range);
  
    // Only add an extra space if the display text does not already end with a space.
    if (!displayText.endsWith(" ")) {
      if (span.parentNode) {
        let nextNode = span.nextSibling;
        // If there is a following text node, check if its first character is whitespace.
        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
          if (!/^\s/.test(nextNode.textContent)) {
            span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
          }
        } 
        // If there’s no next sibling or it isn’t a text node, simply append a space.
        else if (nextNode) {
          span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
        } else {
          span.parentNode.appendChild(document.createTextNode(" "));
        }
      }
    }
  }
  

  function duplicatePlaceholder(variable) {
    // Increment frequency for this variable:
    usageTracker[variable.id] = (usageTracker[variable.id] || 0) + 1;

    const newId = variable.id;
    const editor = document.getElementById("storyText");
    let rangeToUse = null;
    if (lastRange && editor.contains(lastRange.commonAncestorContainer)) {
      rangeToUse = lastRange;
    } else {
      ensureEditorFocus();
      const sel = window.getSelection();
      if (sel.rangeCount) {
        rangeToUse = sel.getRangeAt(0);
      }
    }
    // Use the temporary fill word (if available) as the displayed text.
    const displayText = variable.displayOverride || variable.officialDisplay;
    insertPlaceholderSpan(newId, displayText, rangeToUse);
    lastRange = null;
  }

  function ensureEditorFocus() {
    const editor = document.getElementById("storyText");
    const sel = window.getSelection();
    if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
      editor.focus();
      let range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  async function insertPlaceholder(internalType, displayName, isCustom) {
    const sanitized = Utils.sanitizeString(internalType);
    const editor = document.getElementById("storyText");

    const spans = editor.querySelectorAll(".placeholder");
    let max = 0;
    spans.forEach(function (span) {
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
    variableCounts[sanitized] = newCount;
    const id = sanitized + newCount;

    let rangeToUse = null;
    if (lastRange && editor.contains(lastRange.commonAncestorContainer)) {
      rangeToUse = lastRange;
    } else {
      ensureEditorFocus();
      const sel = window.getSelection();
      if (sel.rangeCount) {
        rangeToUse = sel.getRangeAt(0);
      }
    }
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
      if (temp) {
        displayText = temp;
      }
    }
    insertPlaceholderSpan(id, displayText, rangeToUse);
    if (!variables.some(v => v.id === id)) {
      variables.push({
        id: id,
        internalType: internalType,
        officialDisplay: displayName,
        display: displayName,
        isCustom: !!isCustom,
        order: insertionCounter++,
        displayOverride: displayText
      });
    }
    updateVariablesList();
    lastRange = null;
  }

  function insertPronounPlaceholderSimple(groupId, form, tempValue) {
    const editor = document.getElementById("storyText");
    ensureEditorFocus();
    let sel = window.getSelection();
    let range = (lastRange && editor.contains(lastRange.commonAncestorContainer))
      ? lastRange
      : (sel.rangeCount ? sel.getRangeAt(0) : null);
    const groupNum = groupId.replace('PronounGroup', '');
    const formAbbrevMap = {
      subject: 'SUB',
      object: 'OBJ',
      possAdj: 'PSA',
      possPron: 'PSP',
      reflexive: 'REF'
    };
    const abbrev = formAbbrevMap[form] || form.toUpperCase();
    const placeholderId = `PRP${groupNum}${abbrev}`;
    if (!variables.some(v => v.id === placeholderId)) {
      const displayType = `Person (${form})`;
      variables.push({
        id: placeholderId,
        internalType: `PRONOUN|${groupId}|${form}`,
        officialDisplay: displayType,
        display: displayType,
        isCustom: false,
        order: insertionCounter++,
        displayOverride: tempValue
      });
      updateVariablesList();
    }
    insertPlaceholderSpan(placeholderId, tempValue, range);
    lastRange = null;
  }

  // (Note: The duplicate choosePronounTempValue definition from earlier has been removed.
  // The following definition (with two parameters) is used throughout.)
  function choosePronounTempValue(form, groupId) {
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
        if (!value) {
          return 'You need to choose an option!';
        }
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
  }

  function formatLabel(variable) {
    if (variable.displayOverride && variable.displayOverride !== variable.officialDisplay) {
      return `${variable.displayOverride} (${variable.officialDisplay})`;
    } else {
      return variable.officialDisplay;
    }
  }

  function updateVariablesList() {
    const container = document.getElementById('existingPlaceholdersContainer');
    container.innerHTML = ''; // Clear existing items

    // Sort variables by usage frequency (descending) then by insertion order:
    variables.sort((a, b) => {
      const freqA = usageTracker[a.id] || 0;
      const freqB = usageTracker[b.id] || 0;
      return freqB - freqA || a.order - b.order;
    });

    variables.forEach(v => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-secondary btn-sm m-1 placeholder-item';
      btn.setAttribute('data-id', v.id);
      // Set the displayed text to the temporary word (if present) or fallback to the official display.
      btn.textContent = v.displayOverride || v.officialDisplay;
      // Set the tooltip (title) to the placeholder ID.
      btn.setAttribute('title', v.id);
      container.appendChild(btn);
    });
  }

  function updateVariablesFromEditor() {
    variables = [];
    variableCounts = {};
    insertionCounter = 0;
    const editor = document.getElementById('storyText');
    const placeholderElements = editor.querySelectorAll('.placeholder');
    placeholderElements.forEach(el => {
      const id = el.getAttribute('data-id');
      const base = id.replace(/\d+$/, '');
      const numMatch = id.match(/(\d+)$/);
      const num = numMatch ? parseInt(numMatch[1], 10) : 0;
      if (!variableCounts[base] || num > variableCounts[base]) {
        variableCounts[base] = num;
      }
      if (!variables.some(v => v.id === id)) {
        let variableEntry;
        const custom = customPlaceholders.find(p => p.type === base);
        if (custom) {
          variableEntry = {
            id: id,
            internalType: custom.type,
            officialDisplay: TypeHelpers.naturalizeType(custom.type),
            display: TypeHelpers.naturalizeType(custom.type),
            isCustom: true,
            order: insertionCounter++,
            displayOverride: el.textContent
          };
        } else {
          const guessed = TypeHelpers.guessTypeFromId(id);
          const originalDisplay = TypeHelpers.getOriginalDisplayForType(guessed) || guessed;
          variableEntry = {
            id: id,
            internalType: guessed,
            officialDisplay: originalDisplay,
            display: originalDisplay,
            order: insertionCounter++,
            displayOverride: el.textContent
          };
        }
        variables.push(variableEntry);
      }
    });
    updateVariablesList();
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  }

  function generateLegacyText() {
    const editor = document.getElementById("storyText");
    
    function traverse(node) {
      let result = "";
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          result += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // If it's a <br>, add a newline.
          if (child.tagName.toLowerCase() === "br") {
            result += "\n";
          }
          // If it's a placeholder pill, output its token.
          else if (child.classList.contains("placeholder")) {
            result += "{" + child.getAttribute("data-id") + "}";
          }
          // Otherwise, recursively process the element's children.
          else {
            result += traverse(child);
            // Optionally, if the element is a block-level element,
            // add a newline after processing it.
            const tag = child.tagName.toLowerCase();
            if (tag === "div" || tag === "p") {
              result += "\n";
            }
          }
        }
      });
      return result;
    }
    
    return traverse(editor);
  }

  // ====================================================
  // 7. UPDATE PLACEHOLDER ACCORDION
  // ====================================================
  function updatePlaceholderAccordion(accordionSelector, noResultsSelector, searchVal = '') {
    // if (searchVal) {
    //   $(noResultsSelector).text('No placeholders found for "' + searchVal + '"');
    // } else {
    //   $(noResultsSelector).text('No placeholders found.');
    // }
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

    if (customPlaceholders.length > 0) {
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
  }

  function createPlaceholderCategoryCard(categoryName, accordionSelector, placeholders, searchVal) {
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
  }

  function createCustomPlaceholderCategoryCard(accordionSelector, searchVal) {
    const card = $(`<div class='card'></div>`);
    card.append(createCardHeader('Custom Placeholders', 'CustomPlaceholders', accordionSelector));

    const collapseDiv = $(`
      <div id='CustomPlaceholdersCollapse' class='collapse show' aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
        <div class='card-body'><div class='list-group'></div></div>
      </div>
    `);

    customPlaceholders.forEach(p => {
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
  }

  function createCardHeader(categoryName, sanitizedCategoryName, accordionSelector) {
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
  }

  function createSecondaryPlaceholderWrapper(secondaryItems, searchVal) {
    const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
    secondaryItems.forEach(p => appendPlaceholderItem(hiddenWrapper, p, searchVal, true));
    return hiddenWrapper;
  }

  function createShowMoreToggle(sanitizedCategoryName) {
    return $(`
      <div class='show-more-toggle' data-category='${sanitizedCategoryName}'>
        Show More
      </div>
    `);
  }

  function updateShowMoreToggleVisibility(collapseDiv, searchVal, secondaryPlaceholderWrapper) {
    const toggleLink = collapseDiv.find('.show-more-toggle');
    if (!searchVal) {
      secondaryPlaceholderWrapper.find('.secondary-placeholder').hide();
      toggleLink.text('Show More');
    } else {
      let anySecondaryVisible = secondaryPlaceholderWrapper.find('.secondary-placeholder:visible').length > 0;
      toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
    }
  }

  function appendPlaceholderItem(listGroup, placeholder, searchVal, isSecondary = false) {
    const showItem = matchesSearch(placeholder, searchVal);
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
  }

  function matchesSearch(placeholder, searchVal) {
    return !searchVal || placeholder.display.toLowerCase().includes(searchVal.toLowerCase());
  }

  // ====================================================
  // 8. PLACEHOLDER SELECTION & INFO ICON HANDLERS
  // ====================================================
  $(document).on('click', '.accordion-info-icon', function (e) {
    e.stopPropagation();
    const tooltip = $(this).data('tooltip');
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
  $(document).on('click', '.fill-info-icon', function (e) {
    e.stopPropagation();
    const type = $(this).data('type');
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
    if (link.text() === 'Show More') {
      hiddenItems.show();
      link.text('Show Less');
    } else {
      hiddenItems.hide();
      link.text('Show More');
    }
  });

  // ====================================================
  // 9. CUSTOM PLACEHOLDER HANDLERS & SAVED STORIES SORTING
  // ====================================================
  function addNewCustomPlaceholderWithUsage(rawText, usage) {
    let internal;
    if (usage === "noun") {
      internal = "NN_" + Utils.pascalCase(rawText);
    } else if (usage === "verb") {
      internal = "VB_" + Utils.pascalCase(rawText);
    } else {
      internal = Utils.pascalCase(rawText);
    }
    if (!customPlaceholders.some(p => p.type === internal)) {
      customPlaceholders.push({ type: internal });
    }
  }
  function addNewCustomPlaceholder(rawText) {
    const internal = Utils.pascalCase(rawText);
    if (!customPlaceholders.some(p => p.type === internal)) {
      customPlaceholders.push({ type: internal });
    }
  }
  function insertPlaceholderFromCustom(rawText) {
    const internal = Utils.pascalCase(rawText);
    const display = Utils.naturalDisplay(internal);
    insertPlaceholder(internal, display, true);
  }
  $('#addCustomPlaceholderBtn').on('click', function () {
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
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
  });
  $('#modalAddCustomPlaceholderBtn').on('click', function () {
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
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
    $('#placeholderModal').modal('hide');
    $('#modalPlaceholderSearch').val('');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  });
  
  // --- Modal-specific handler for new placeholder selection ---
  $(document).on('click', '#modalPlaceholderAccordion .placeholder-btn', function (e) {
    // Prevent the event from bubbling further so that only this handler runs.
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    if ($('#placeholderModal').hasClass('show')) {
      $('#placeholderModal').modal('hide');
    }
    const internalType = $(this).data('internal');
    const displayName = $(this).data('display');

    // Handle special cases that require an extra selection step.
    if (internalType === "PRONOUN") {
      pickPronounFormAndGroup();
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
      return;
    }
    if (internalType.indexOf("NN") === 0) {
      showNounNumberSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
      return;
    }
    if (internalType.indexOf("VB") === 0 || internalType === "MD") {
      showVerbTenseSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
      return;
    }
    // For other types, if we are in edit mode, update the existing placeholder.
    if (window.isEditingPlaceholder && currentEditingVariable) {
      updateExistingPlaceholder(currentEditingVariable, internalType, displayName);
      window.isEditingPlaceholder = false;
      currentEditingVariable = null;
    } else {
      // Otherwise, insert the placeholder normally.
      insertPlaceholder(internalType, displayName, false);
    }
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
  });

  // --- Global handler for .placeholder-btn clicks outside the modal ---
  $(document).on('click', '.placeholder-btn', function (e) {
    // Prevent duplicate processing using the lock flag.
    if (placeholderInsertionInProgress) {
      return;
    }
    placeholderInsertionInProgress = true;

    // If the clicked element is inside the modal accordion, let the modal-specific handler handle it.
    if ($(this).closest('#modalPlaceholderAccordion').length > 0) {
      placeholderInsertionInProgress = false;
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const internalType = $(this).data('internal');
    const displayName = $(this).data('display');

    if (window.isEditingPlaceholder && currentEditingVariable) {
      // Update an existing placeholder if in edit mode.
      updateExistingPlaceholder(currentEditingVariable, internalType, displayName);
      window.isEditingPlaceholder = false;
      currentEditingVariable = null;
      $('#placeholderModal').modal('hide');
    } else {
      // Normal insertion behavior.
      if (internalType === "PRONOUN") {
        pickPronounFormAndGroup();
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
        placeholderInsertionInProgress = false;
        return;
      }
      if (internalType.indexOf("NN") === 0) {
        showNounNumberSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
        placeholderInsertionInProgress = false;
        return;
      }
      if (internalType.indexOf("VB") === 0 || internalType === "MD") {
        showVerbTenseSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
        placeholderInsertionInProgress = false;
        return;
      }
      // Insert the placeholder normally.
      insertPlaceholder(internalType, displayName, false);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    }
    
    // Release the lock after a short delay.
    setTimeout(() => {
      placeholderInsertionInProgress = false;
    }, 50);
  });

  // ====================================================
  // 10. VERB & NOUN SELECTION MODALS
  // ====================================================
  function showNounNumberSelection(baseInternal, baseDisplay) {
    let html = `<div class='list-group'>`;
    const forms = ['Singular', 'Plural'];
    forms.forEach(f => {
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
          const finalDisplay = baseDisplay + " (" + selected + ")";
          if (window.isEditingPlaceholder && currentEditingVariable) {
            updateExistingPlaceholder(currentEditingVariable, finalInternal, finalDisplay);
            window.isEditingPlaceholder = false;
            currentEditingVariable = null;
            Swal.close();
          } else {
            await insertPlaceholder(finalInternal, finalDisplay, false);
            Swal.close();
          }
        });        
        
      }
    });
  }
  
  const VERB_TENSES = [
    { value: 'VB', text: 'Base (run)' },
    { value: 'VBP', text: 'Present (I walk)' },
    { value: 'VBZ', text: 'Present 3rd (he leaves)' },
    { value: 'VBD', text: 'Past (slept)' },
    { value: 'VBG', text: 'Gerund (crying)' },
    { value: 'VBN', text: 'Past Participle (eaten)' }
  ];
  function showVerbTenseSelection(baseInternal, baseDisplay) {
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
          const finalDisplay = baseDisplay + " (" + tenseText + ")";
          if (window.isEditingPlaceholder && currentEditingVariable) {
            updateExistingPlaceholder(currentEditingVariable, finalInternal, finalDisplay);
            window.isEditingPlaceholder = false;
            currentEditingVariable = null;
            Swal.close();
          } else {
            await insertPlaceholder(finalInternal, finalDisplay, false);
            Swal.close();
          }
        });        
      }
    });
  }

  // ====================================================
  // 11. PRONOUN HANDLERS
  // ====================================================
  function pickPronounFormAndGroup() {
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
  }
  function pickPronounGroup(form) {
    const groupKeys = Object.keys(pronounGroups);
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
          if (pronounGroups[grp] && pronounGroups[grp][form]) {
            insertPronounPlaceholderSimple(grp, form, pronounGroups[grp][form]);
          } else {
            choosePronounTempValue(form, grp).then(tempValue => {
              if (pronounMapping[tempValue]) {
                pronounGroups[grp] = pronounMapping[tempValue];
              } else {
                pronounGroups[grp] = { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
              }
              insertPronounPlaceholderSimple(grp, form, pronounGroups[grp][form]);
            });
          }
        });
        $(container).find('#createNewPronounGroupBtn').on('click', function () {
          pronounGroupCount++;
          const newGroup = `PronounGroup${pronounGroupCount}`;
          pronounGroups[newGroup] = {};
          Swal.close();
          choosePronounTempValue(form, newGroup).then(tempValue => {
            if (pronounMapping[tempValue]) {
              pronounGroups[newGroup] = pronounMapping[tempValue];
            } else {
              pronounGroups[newGroup] = { subject: tempValue, object: tempValue, possAdj: tempValue, possPron: tempValue, reflexive: tempValue };
            }
            insertPronounPlaceholderSimple(newGroup, form, pronounGroups[newGroup][form]);
          });
        });
      }
    });
  }
  // (The choosePronounTempValue function has already been defined above.)
  
  // ====================================================
  // 12. BUILD THE FILL-IN-THE-BLANK FORM
  // ====================================================
  function buildFillForm() {
    const form = $('#inputForm');
    form.empty();

    appendPronounGroupsToForm(form);
    appendNonPronounVariablesToForm(form);
  }

  function appendPronounGroupsToForm(form) {
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
  }

  function getPronounGroups() {
    const groupSet = new Set();
    for (const v of variables) {
      if (v.internalType.startsWith('PRONOUN|')) {
        const parts = v.internalType.split('|');
        groupSet.add(parts[1]);
      }
    }
    return groupSet;
  }

  // --- MODIFIED: Add an id to the pronoun group label so we can mark it with an asterisk when incomplete ---
  function createPronounGroupBlock(groupName) {
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
  }

  function handlePronounChoiceChange() {
    const groupName = $(this).attr('name').replace('-choice', '');
    if ($(this).val() === 'Custom') {
      $(`#${groupName}-custom`).removeClass('d-none');
    } else {
      $(`#${groupName}-custom`).addClass('d-none');
    }
  }

  function appendNonPronounVariablesToForm(form) {
    let nonPronounVars = variables.filter(v => !v.internalType.startsWith('PRONOUN|'));
    if (fillOrder === 'alphabetical') {
      nonPronounVars.sort((a, b) => a.officialDisplay.localeCompare(b.officialDisplay));
    } else if (fillOrder === 'random') {
      nonPronounVars.sort(() => Math.random() - 0.5);
    }
    nonPronounVars.forEach(variable => {
      const groupRow = createInputRow(variable);
      form.append(groupRow);
    });
  }
  

  function createInputRow(variable) {
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
    if (fillValues[variable.id]) {
      groupRow.find('input').val(fillValues[variable.id]);
    }
    return groupRow;
  }

  // ====================================================
  // 13. EVENT HANDLERS & DOCUMENT READY
  // ====================================================
  $(document).ready(function () {
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');

    // Share button functionality
    $('#shareStory').on('click', function () {
      // Gather the final story content
      const finalText = $('#finalStory').text();
      const title = $('#displayTitle').text();
      const author = $('#displayAuthor').text();
      const content = `Title: ${title}\nAuthor: ${author}\n\n${finalText}`;

      // Use the Clipboard API if available
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
        // Fallback for older browsers
        fallbackCopyTextToClipboard(content);
      }
    });

    // Fallback function using a temporary textarea
    function fallbackCopyTextToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Place the textarea off-screen
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
    }

    document.getElementById('existingPlaceholdersContainer').addEventListener('click', function(e) {
      const btn = e.target.closest('.placeholder-item');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const variable = variables.find(v => v.id === id);
      if (variable) {
        duplicatePlaceholder(variable);
      }
    });
    
    $('#placeholderSearch').on('input', function () {
      const searchVal = $(this).val();
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', searchVal);
      $('#addCustomPlaceholderBtn').text('Add "' + searchVal + '"');
    });
    
    $('#modalPlaceholderSearch').on('input', function () {
      const searchVal = $(this).val();
      updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', searchVal);
      $('#modalAddCustomPlaceholderBtn').text('Add "' + searchVal + '"');
    });
    
    $('#storyText').on('input', function () {
      updateVariablesFromEditor();
      storyHasUnsavedChanges = true;
    });

    $('#uploadStoryBtn').on('click', function () {
      $('#uploadStory').click();
    });
    $('#uploadStory').on('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        const titleMatch = content.match(/^Title:\s*(.*)$/m);
        const authorMatch = content.match(/^Author:\s*(.*)$/m);
        const storyStartIndex = content.indexOf('\n\n');
        let storyContent = '';
        if (storyStartIndex !== -1) {
          storyContent = content.substring(storyStartIndex + 2);
        } else {
          storyContent = content;
        }
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
    $('#startGame').on('click', function () {
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
    $('#generateStory').on('click', function () {
      // First, check that every non-pronoun fill has a value.
      const inputs = $('#inputForm input[type="text"]:not(.d-none)');
      let valid = true;
      inputs.each(function () {
        const pid = $(this).attr('name');
        if (!pid) return;
        const val = $(this).val().trim();
        const label = $(this).attr('data-label');
        if (!val && pid) {
          Swal.fire('Oops!', `Please enter a value for ${label}.`, 'error');
          valid = false;
          return false;
        }
        fillValues[pid] = val;
      });
      if (!valid) return;

      // Next, check that each pronoun group has a complete selection.
      let pronounComplete = true;
      const groupSet = new Set();
      for (const v of variables) {
        if (v.internalType.startsWith('PRONOUN|')) {
          const parts = v.internalType.split('|');
          groupSet.add(parts[1]);
        }
      }
      groupSet.forEach(g => {
        // Remove any previous error asterisk:
        $(`#${g}-label .required-asterisk`).remove();

        const choice = $(`input[name='${g}-choice']:checked`).val();
        if (!choice) {
          pronounComplete = false;
          // Append a red asterisk to indicate this pronoun group is incomplete.
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

      // Process pronoun selections as before…
      groupSet.forEach(g => {
        const choice = $(`input[name='${g}-choice']:checked`).val();
        if (choice === 'HeHim' || choice === 'SheHer' || choice === 'TheyThem') {
          const predefined = {
            HeHim: { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
            SheHer: { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
            TheyThem: { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
          };
          pronounGroups[g] = { ...predefined[choice] };
        } else {  // Custom
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
      let final = storyText;
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
      // Here we are displaying final story as plain text.
      $('#finalStory').text(final);
      $('#displayTitle').text($('#storyTitle').val());
      $('#displayAuthor').text($('#storyAuthor').val());
      $('#result').removeClass('d-none');
      $('#inputs').addClass('d-none');
    });
    $('#createNewStory2, #createNewStory').on('click', function (e) {
      e.preventDefault();
      
      if (storyHasUnsavedChanges) {
        // Ask if the user wants to save before discarding unsaved changes.
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
            // Save the current story and then start a new one.
            Storage.addCurrentStoryToSavedStories();
            // (Optionally, wait for the save to complete before starting a new story.)
            // For example, you could delay or chain the new story creation in the success callback.
            setTimeout(createNewStory, 1000);
          } else if (result.isDenied) {
            // Confirm discarding unsaved changes.
            Swal.fire({
              title: 'Are you sure?',
              text: 'This will discard your current unsaved story.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, start new',
              cancelButtonText: 'Cancel'
            }).then((res) => {
              if (res.isConfirmed) {
                createNewStory();
              }
            });
          }
          // If the user cancels the first dialog, do nothing.
        });
      } else {
        // No unsaved changes; just confirm discarding the current story.
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will discard your current story.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, start new',
          cancelButtonText: 'Cancel'
        }).then((res) => {
          if (res.isConfirmed) {
            createNewStory();
          }
        });
      }
    });
    
    function createNewStory() {
      $('#storyTitle').val('');
      $('#storyAuthor').val('');
      $('#storyText').html('');
      variables = [];
      variableCounts = {};
      insertionCounter = 0;
      customPlaceholders = [];
      fillValues = {};
      pronounGroups = {};
      pronounGroupCount = 0;
      storyHasUnsavedChanges = false;
      updateVariablesList();
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
      updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
      $('#editor').removeClass('d-none');
      $('#inputs, #result').addClass('d-none');
    }
    $('#editStoryEntries').on('click', function () {
      buildFillForm();
      $('#result').addClass('d-none');
      $('#inputs').removeClass('d-none');
    });
    $('#backToEditor, #backToEditor2').on('click', function () {
      $('#result, #inputs').addClass('d-none');
      $('#editor').removeClass('d-none');
    });
    $('#saveCompletedStoryToSite').on('click', function () {
      Storage.addCompletedStoryToSavedStories();
      storyHasUnsavedChanges = false;
    });
    

    // NEW: Download Completed Story as a Text File
    $('#downloadStory').on('click', function () {
      // Get the final story text and the title/author
      const finalText = $('#finalStory').text();
      const title = $('#displayTitle').text();
      const author = $('#displayAuthor').text();

      // Build the content string (adjust as needed)
      const content = `Title: ${title}\nAuthor: ${author}\n\n${finalText}`;

      // Create a blob from the content
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement('a');
      a.href = url;

      // Generate a file name based on the title (fallback to 'story.txt')
      const fileName = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt' : 'story.txt';
      a.download = fileName;

      // Append, click, remove, and revoke URL
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    $('#mySavedStoriesBtn').on('click', function () {
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
        if (result.isConfirmed) {
          Storage.deleteSavedStory(title);
        }
      });
    });
    $('#saveStoryToSite').on('click', function () {
      Storage.addCurrentStoryToSavedStories();
      storyHasUnsavedChanges = false;
    });


    $('#storyText').on('keydown', function (e) {
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

    $('#addPlaceholderBtn').on('click', function () {
      $('#placeholderModal').modal('show');
    });
  });
  
  // ====================================================
  // 14. GLOBALS & HELPER FUNCTIONS FOR THE NEW FEATURES
  // ====================================================
  
  // Global for “editing” a placeholder (when tapped)
  let currentEditingVariable = null;
  let currentPlaceholderElement = null;

  // --- Floating Menu Helper Functions ---
  // This helper positions a given menu (talk-bubble style) above and centered to a target element.
  function positionMenu(menu, rect) {
    // Make sure the menu is visible so we can measure it.
    menu.style.display = 'block';
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const offset = 5; // gap in pixels
  
    let desiredTop;
    // If there is enough room below the selection, position the menu there.
    if (rect.bottom + offset + menuHeight <= window.innerHeight) {
      desiredTop = window.scrollY + rect.bottom + offset;
    } else {
      // Otherwise, place it above the selection.
      desiredTop = window.scrollY + rect.top - menuHeight - offset;
    }
  
    // Center the menu horizontally relative to the selection.
    let desiredLeft = window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2);
  
    // Ensure the menu doesn’t go off the left edge.
    if (desiredLeft < window.scrollX + 5) {
      desiredLeft = window.scrollX + 5;
    }
    // Ensure it doesn’t go off the right edge.
    if (desiredLeft + menuWidth > window.scrollX + window.innerWidth - 5) {
      desiredLeft = window.scrollX + window.innerWidth - menuWidth - 5;
    }
  
    menu.style.top = desiredTop + 'px';
    menu.style.left = desiredLeft + 'px';
  }
  
  function hideMenu(menu) {
    menu.style.display = 'none';
  }
  
  function hideAllMenus() {
    hideMenu(selectionMenu);
    hideMenu(placeholderEditMenu);
  }
  
  // Create a floating selection menu element
  const selectionMenu = document.createElement('div');
  selectionMenu.id = 'textSelectionMenu';
  // (You can move these styles into your CSS as desired.)
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
  
  // Create a floating menu for editing an existing placeholder
  const placeholderEditMenu = document.createElement('div');
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
  
  // ====================================================
  // 15. SELECTION MENU FOR HIGHLIGHTED TEXT (Updated)
  // ====================================================
  document.getElementById('storyText').addEventListener('mouseup', function (e) {
    setTimeout(function () {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) {
        // Only show the menu if the selection isn’t within a placeholder.
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
  
  // Hide the selection menu if clicking elsewhere.
  document.addEventListener('click', function (e) {
    if (!selectionMenu.contains(e.target) && !placeholderEditMenu.contains(e.target)) {
      hideAllMenus();
    }
  });
  
  // Handler for “New Placeholder”
  document.getElementById('newPlaceholderBtn').addEventListener('click', function (e) {
    hideMenu(selectionMenu);
    // Open the placeholder modal (the modal will use the stored lastRange).
    $('#placeholderModal').modal('show');
  });
  
  // Handler for “Reuse Placeholder”
  document.getElementById('reusePlaceholderBtn').addEventListener('click', function (e) {
    hideMenu(selectionMenu);
    if (variables.length === 0) {
      Swal.fire('No existing placeholders', 'There are no placeholders to reuse yet.', 'info');
      return;
    }
    
    // Create a copy of variables and sort them (most-used first, then by insertion order)
    const sortedVariables = [...variables].sort((a, b) => {
      const freqA = usageTracker[a.id] || 0;
      const freqB = usageTracker[b.id] || 0;
      return freqB - freqA || a.order - b.order;
    });
    
    // Build HTML using the same button style as in updateVariablesList()
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
    
    // Open a Swal modal with our custom HTML content.
    Swal.fire({
      title: 'Select a placeholder to reuse',
      html: html,
      showCancelButton: true,
      showConfirmButton: false,
      didOpen: () => {
        // Attach click listeners to each button inside the modal.
        const container = Swal.getHtmlContainer();
        const btns = container.querySelectorAll('.reuse-placeholder-btn');
        btns.forEach(button => {
          button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const variable = variables.find(v => v.id === id);
            if (variable) {
              duplicatePlaceholder(variable);
            }
            Swal.close();
          });
        });
      }
    });
  });
  
  // ====================================================
  // 16. EDITING A PLACEHOLDER WHEN IT IS TAPPED (Updated)
  // ====================================================
  // When a placeholder pill (the span with class "placeholder") is clicked,
  // offer three options: change its placeholder, change its override, or delete it.
  $(document).on('click', '#storyText .placeholder', function (e) {
    e.stopPropagation();
    // Store a reference to the clicked placeholder element.
    currentPlaceholderElement = this;
    const placeholderId = this.getAttribute('data-id');
    const variable = variables.find(v => v.id === placeholderId);
    if (!variable) return;
    Swal.fire({
      title: 'Edit Placeholder',
      html: `<div class="btn-group-vertical" style="width:100%;">
               <button id="editPlaceholderBtn" class="btn btn-primary btn-sm">Change Placeholder</button>
               <button id="editOverrideBtn" class="btn btn-secondary btn-sm">Change Override</button>
               <button id="deletePlaceholderBtn" class="btn btn-danger btn-sm">Delete</button>
             </div>`,
      showConfirmButton: false
    });
  });
  
  // Delegate the “Change Placeholder” button click.
  $(document).on('click', '#editPlaceholderBtn', function () {
    Swal.close();
    if (!currentPlaceholderElement) return;
    const placeholderId = currentPlaceholderElement.getAttribute('data-id');
    const variable = variables.find(v => v.id === placeholderId);
    if (!variable) return;
    // Set the editing flag and store the variable so that the modal selection will update it.
    currentEditingVariable = variable;
    window.isEditingPlaceholder = true;
    $('#placeholderModal').modal('show');
  });
  
  // Delegate the “Change Override” button click.
  $(document).on('click', '#editOverrideBtn', function () {
    Swal.close();
    if (!currentPlaceholderElement) return;
    const placeholderId = currentPlaceholderElement.getAttribute('data-id');
    const variable = variables.find(v => v.id === placeholderId);
    if (!variable) return;
    Swal.fire({
      title: 'Change Display Override',
      input: 'text',
      inputValue: variable.displayOverride,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Display override cannot be empty';
      }
    }).then(result => {
      if (result.value) {
        variable.displayOverride = result.value;
        // Update all occurrences of this placeholder in the editor.
        document.querySelectorAll('.placeholder[data-id="'+variable.id+'"]').forEach(el => {
          el.setAttribute("data-id", variable.id);
          el.setAttribute("title", variable.id);
          // Use the preserved override as the text content.
          el.textContent = variable.displayOverride;
        });
        updateVariablesList();
      }
    });
  });

  $('#alphabeticalOrderBtn').on('click', function(){
    fillOrder = 'alphabetical';
    // Optionally, update button styles to indicate the active order:
    $(this).addClass('active');
    $('#randomOrderBtn').removeClass('active');
    buildFillForm();
});

$('#randomOrderBtn').on('click', function(){
    fillOrder = 'random';
    $(this).addClass('active');
    $('#alphabeticalOrderBtn').removeClass('active');
    buildFillForm();
});

  
  // Delegate the “Delete” button click.
  $(document).on('click', '#deletePlaceholderBtn', function () {
    Swal.close();
    if (currentPlaceholderElement) {
      currentPlaceholderElement.remove();
      updateVariablesFromEditor();
    }
  });
  
  // ====================================================
  // 17. MODIFYING THE PLACEHOLDER MODAL HANDLER FOR “EDIT MODE”
  // ====================================================
  // Helper function to update an existing placeholder’s type and official display while preserving its display override.
  function updateExistingPlaceholder(variable, newInternalType, newOfficialDisplay) {
    let oldId = variable.id;
    const sanitized = Utils.sanitizeString(newInternalType);
    const editor = document.getElementById("storyText");
    let max = 0;
    editor.querySelectorAll(".placeholder").forEach(span => {
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
    const newId = sanitized + newCount;
    variable.id = newId;
    variable.internalType = newInternalType;
    variable.officialDisplay = newOfficialDisplay;
    // Preserve displayOverride if it already exists; otherwise, set it to newOfficialDisplay.
    if (!variable.displayOverride) {
      variable.displayOverride = newOfficialDisplay;
    }
    // Update every placeholder span that used the old id.
    document.querySelectorAll('.placeholder[data-id="'+oldId+'"]').forEach(el => {
      el.setAttribute("data-id", newId);
      el.setAttribute("title", newId);
      // Use the preserved override as the text content.
      el.textContent = variable.displayOverride;
    });
    updateVariablesList();
  }
  
  // ====================================================
  // 18. FLOATING MENU ELEMENTS CREATION (if not already present)
  // ====================================================
  // Floating selection menu (for highlighted text) – already created in the HTML above if desired,
  // but here we create it dynamically if not present.
  if (!document.getElementById('textSelectionMenu')) {
    const selectionMenu = document.createElement('div');
    selectionMenu.id = 'textSelectionMenu';
    selectionMenu.className = 'floating-menu';
    selectionMenu.innerHTML = `
      <button id="newPlaceholderBtn" class="btn btn-sm btn-primary">New Placeholder</button>
      <button id="reusePlaceholderBtn" class="btn btn-sm btn-secondary">Reuse Placeholder</button>
    `;
    document.body.appendChild(selectionMenu);
  }
  // Floating edit menu for existing placeholder:
  if (!document.getElementById('placeholderEditMenu')) {
    const placeholderEditMenu = document.createElement('div');
    placeholderEditMenu.id = 'placeholderEditMenu';
    placeholderEditMenu.className = 'floating-menu';
    placeholderEditMenu.innerHTML = `
      <button id="editPlaceholderBtn" class="btn btn-sm btn-primary">Change Placeholder</button>
      <button id="editOverrideBtn" class="btn btn-sm btn-secondary">Change Override</button>
      <button id="deletePlaceholderBtn" class="btn btn-sm btn-danger">Delete</button>
    `;
    document.body.appendChild(placeholderEditMenu);
  }
})();
