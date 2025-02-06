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
      return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    },
    sanitizeString(str) {
      return str.replace(/[^a-zA-Z0-9_]/g, '');
    }
  };

  // ====================================================
  // 2. GLOBAL STATE VARIABLES
  // ====================================================
  let variables = [];  // { id, internalType, display, isCustom, order }
  let variableCounts = {};
  let insertionCounter = 0;
  let storyText = '';
  let customPlaceholders = [];
  let fillValues = {};
  let pronounGroups = {};
  let pronounGroupCount = 0;

  // ====================================================
  // 3. STORAGE HELPER FUNCTIONS (Server-side)
  // ====================================================
  const Storage = {
    addCurrentStoryToSavedStories() {
      const story = {
        storyTitle: $('#storyTitle').val(),
        storyAuthor: $('#storyAuthor').val(),
        storyText: $('#storyText').val(),
        variables,
        fillValues,
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
        error: function (xhr) {
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
                  error: function () {
                    Swal.fire('Error', 'Failed to save story', 'error');
                  }
                });
              }
            });
          } else {
            Swal.fire('Error', 'Failed to save story', 'error');
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
        fillValues,
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
        error: function (xhr) {
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
                  error: function () {
                    Swal.fire('Error', 'Failed to save completed story', 'error');
                  }
                });
              }
            });
          } else {
            Swal.fire('Error', 'Failed to save completed story', 'error');
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
            const item = $(`
              <div class="list-group-item p-2">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>${story.storyTitle || 'Untitled'}</strong><br>
                    <small>${story.storyAuthor || 'Unknown'} | ${dateStr}</small>
                  </div>
                  <div>
                    <!-- New Edit button -->
                    <button class="btn btn-sm btn-secondary editSavedStoryBtn" data-index="${index}" aria-label="Edit Story">
                      <i class="fas fa-edit"></i>
                    </button>
                    <!-- Play button (to start the game/fill-in view) -->
                    <button class="btn btn-sm btn-success loadSavedStoryBtn" data-index="${index}" aria-label="Play Story">
                      <i class="fas fa-play"></i>
                    </button>
                    <!-- Delete button -->
                    <button class="btn btn-sm btn-danger deleteSavedStoryBtn" data-title="${story.storyTitle}" aria-label="Delete Story">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            `);
            listContainer.append(item);
          });
        },
        error: function () {
          Swal.fire('Error', 'Failed to load saved stories', 'error');
        }
      });
    },
    loadSavedStory(index, mode = "edit") {
      $.ajax({
        url: '/api/getstories',
        method: 'GET',
        success: function (stories) {
          const story = stories[index];
          if (!story) return;
          // Load title, author, and story text into the editor
          $('#storyTitle').val(story.storyTitle);
          $('#storyAuthor').val(story.storyAuthor);
          $('#storyText').val(story.storyText);
          
          // Reset globals before rebuilding state.
          variables = [];
          variableCounts = {};
          insertionCounter = 0;
          fillValues = story.fillValues || {};
          pronounGroups = story.pronounGroups || {};
          pronounGroupCount = story.pronounGroupCount || 0;
          customPlaceholders = story.customPlaceholders || [];
          
          // Rebuild state from the loaded text.
          updateVariablesFromText();
          
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Story loaded!',
            showConfirmButton: false,
            timer: 1500
          });
          
          // Decide which section to show.
          if (mode === "edit") {
            // Show the editor so the user can further modify the story.
            $('#editor').removeClass('d-none');
            $('#inputs, #result').addClass('d-none');
          } else if (mode === "play") {
            // Build and show the fill-in-the-blanks form.
            buildFillForm();
            $('#inputs').removeClass('d-none');
            $('#editor, #result').addClass('d-none');
          }
        }
      });
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
        error: function () {
          Swal.fire('Error', 'Failed to delete story', 'error');
        }
      });
    }
  };

  // ====================================================
  // 4. TYPE HELPER FUNCTIONS
  // ====================================================
  const TypeHelpers = {
    naturalizeType(type) {
      if (type === "Onomatopoeia") return "Onomatopoeia";
      if (type.startsWith("MD_")) {
        let tense = type.substring(3);
        let tenseNatural = "";
        switch (tense) {
          case "VB":  tenseNatural = "Base Form"; break;
          case "VBP": tenseNatural = "Present (Non-3rd Person Singular)"; break;
          case "VBZ": tenseNatural = "3rd Person Singular Present"; break;
          case "VBD": tenseNatural = "Past Tense"; break;
          case "VBG": tenseNatural = "Present Participle"; break;
          case "VBN": tenseNatural = "Past Participle"; break;
          default:    tenseNatural = tense;
        }
        return "Modal Verb (" + tenseNatural + ")";
      }
      if (type.startsWith("NNPS")) {
        let sub = type.substring(4);
        if (sub.startsWith("_")) sub = sub.substring(1);
        return Utils.capitalize(sub || "Proper Noun") + " (Plural)";
      }
      if (type.startsWith("NNP")) {
        let sub = type.substring(3);
        if (sub.startsWith("_")) sub = sub.substring(1);
        return Utils.capitalize(sub || "Proper Noun") + " (Singular)";
      }
      if (type.startsWith("NNS")) {
        let sub = type.substring(3);
        if (sub.startsWith("_")) sub = sub.substring(1);
        return Utils.capitalize(sub || "Common Noun") + " (Plural)";
      }
      if (type.startsWith("NN")) {
        let sub = type.substring(2);
        if (sub.startsWith("_")) sub = sub.substring(1);
        return Utils.capitalize(sub || "Common Noun") + " (Singular)";
      }
      const verbTenseMap = {
        "VBZ": "3rd Person Singular Present",
        "VBD": "Past Tense",
        "VBG": "Present Participle",
        "VBN": "Past Participle",
        "VBP": "Present (Non-3rd Person Singular)"
      };
      for (let tense in verbTenseMap) {
        if (type.startsWith(tense)) {
          let remainder = type.substring(tense.length);
          let category = "";
          if (remainder.startsWith("_")) {
            category = remainder.substring(1);
          }
          if (category) {
            return Utils.capitalize(category) + " Verb (" + verbTenseMap[tense] + ")";
          } else {
            return "Verb (" + verbTenseMap[tense] + ")";
          }
        }
      }
      if (type.startsWith("VB")) {
        let rest = type.substring(2).replace(/^_+/, "");
        return rest ? Utils.capitalize(rest) + " Verb (Base Form)" : "Verb (Base Form)";
      }
      if (type.startsWith("JJ_")) {
        let sub = type.substring(3);
        return Utils.naturalDisplay(sub) + " Adjective";
      }
      if (type.startsWith("JJS_")) {
        let sub = type.substring(4);
        if (sub.toLowerCase() === "ordinal") {
          return "Ordinal Number";
        }
        return Utils.naturalDisplay(sub) + " Superlative Adjective";
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
      if (type === "IN") return "Preposition";
      if (type === "UH") return "Interjection";
      if (type === "RP") return "Particle";
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
      const verbTensePrefixes = ["VBZ", "VBD", "VBG", "VBN", "VBP"];
      for (let prefix of verbTensePrefixes) {
        if (type.startsWith(prefix + "_")) {
          const baseType = "VB_" + type.substring(prefix.length + 1);
          for (let category in allPlaceholders) {
            for (let p of allPlaceholders[category]) {
              if (p.internalType === baseType) {
                return p.display;
              }
            }
          }
        }
      }
      return type;
    },
    guessTypeFromId(id) {
      // First, check if this is a custom placeholder.
      let base = id.replace(/\d+$/, '');
      const custom = customPlaceholders.find(p => p.type === base);
      if (custom) return custom.type;
      
      // New: Check for fixed pronoun placeholder format: e.g. "PRP1SUB"
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
      
      // Fallback: try the original pronoun regex (for older placeholders)
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
    "Adjectives and Adverbs",
    "Determiners, Conjunctions & Numerals",
    "Other Placeholders"
  ];

  const allPlaceholders = {
    "Nouns": [
      { internalType: "NN", display: "Common Noun", tooltip: "A generic noun (book, table)", icon: "fas fa-book", isPrimary: true },
      { internalType: "NNP", display: "Proper Noun", tooltip: "A specific name (John, Paris)", icon: "fas fa-user", isPrimary: false },
      { internalType: "NN_Concrete", display: "Concrete Noun", tooltip: "A tangible object (car, phone)", icon: "fas fa-cube", isPrimary: false },
      { internalType: "NN_Person", display: "Person", tooltip: "A person or role (teacher, father)", icon: "fas fa-user-friends", isPrimary: true },
      { internalType: "NN_Place", display: "Place", tooltip: "A location (home, city)", icon: "fas fa-map-marker-alt", isPrimary: true },
      { internalType: "PRONOUN", display: "Pronoun", tooltip: "A pronoun placeholder (he, they)", icon: "fas fa-user-circle", isPrimary: true },
      { internalType: "NN_Abstract", display: "Abstract Noun", tooltip: "An intangible concept (freedom, happiness)", icon: "fas fa-cloud", isPrimary: true },
      { internalType: "NN_Animal", display: "Animal", tooltip: "An animal (dog, lion)", icon: "fas fa-dog", isPrimary: false },
      { internalType: "NN_BodyPart", display: "Body Part", tooltip: "A part of the body (arm, head)", icon: "fas fa-hand-paper", isPrimary: false },
      { internalType: "NN_Clothing", display: "Clothing", tooltip: "A clothing item (shirt, coat)", icon: "fas fa-tshirt", isPrimary: false },
      { internalType: "NN_Drink", display: "Drink", tooltip: "A beverage (coffee, juice)", icon: "fas fa-cocktail", isPrimary: false },
      { internalType: "NN_Emotion", display: "Emotion", tooltip: "A feeling (joy, anger)", icon: "fas fa-heart", isPrimary: false },
      { internalType: "NN_Food", display: "Food", tooltip: "An edible item (pizza, apple)", icon: "fas fa-utensils", isPrimary: false },
      { internalType: "NN_Vehicle", display: "Vehicle", tooltip: "A type of transport (car, train)", icon: "fas fa-car", isPrimary: false },
      { internalType: "NN_Onomatopoeia", display: "Onomatopoeia (Noun)", tooltip: "A sound word used as a noun (bang, hiss)", icon: "fas fa-volume-up", isPrimary: false }
    ],
    "Verbs": [
      { internalType: "VB", display: "Verb", tooltip: "A verb of any kind (eat, dislike)", icon: "fas fa-pen", isPrimary: true },
      { internalType: "VB_Intransitive", display: "Intransitive Verb", tooltip: "Does not take a direct object (sleep, arrive)", icon: "fas fa-bed", isPrimary: true },
      { internalType: "VB_Transitive", display: "Transitive Verb", tooltip: "Takes a direct object (eat, read)", icon: "fas fa-hammer", isPrimary: true },
      { internalType: "VB_Action", display: "Action Verb", tooltip: "An action-based verb (run, jump)", icon: "fas fa-bolt", isPrimary: false },
      { internalType: "VB_Stative", display: "Stative Verb", tooltip: "Describes a state (believe, like)", icon: "fas fa-brain", isPrimary: false },
      { internalType: "VB_Communication", display: "Communication Verb", tooltip: "A speaking verb (say, shout)", icon: "fas fa-comment-dots", isPrimary: false },
      { internalType: "VB_Movement", display: "Movement Verb", tooltip: "A movement-based verb (walk, swim)", icon: "fas fa-walking", isPrimary: false },
      { internalType: "VB_Onomatopoeia", display: "Onomatopoeia (Verb)", tooltip: "A sound word used as a verb (clangs, hissed)", icon: "fas fa-volume-up", isPrimary: false },
      { internalType: "MD", display: "Modal Verb", tooltip: "Expresses modality (can, must)", icon: "fas fa-key", isPrimary: false },
      { internalType: "VB_Linking", display: "Linking Verb", tooltip: "A linking verb (is, become)", icon: "fas fa-link", isPrimary: false }
    ],
    "Adjectives and Adverbs": [
      { internalType: "JJ", display: "Adjective", tooltip: "Describes a noun (big, happy, red)", icon: "fas fa-ad", isPrimary: true },
      { internalType: "RB", display: "Adverb", tooltip: "Modifies a verb (quickly, softly)", icon: "fas fa-feather-alt", isPrimary: true },
      { internalType: "JJR", display: "Comparative Adjective", tooltip: "Compares two items (bigger, faster)", icon: "fas fa-level-up-alt", isPrimary: false },
      { internalType: "JJS", display: "Superlative Adjective", tooltip: "Highest degree (biggest, fastest)", icon: "fas fa-medal", isPrimary: false },
      { internalType: "JJ_Color", display: "Color Adjective", tooltip: "Describes a color (red, blue)", icon: "fas fa-palette", isPrimary: false },
      { internalType: "JJ_Emotion", display: "Emotion Adjective", tooltip: "Describes an emotion (joyful, angry)", icon: "fas fa-smile", isPrimary: false },
      { internalType: "JJ_Size", display: "Size Adjective", tooltip: "Describes size (large, tiny)", icon: "fas fa-arrows-alt", isPrimary: false },
      { internalType: "JJS_Ordinal", display: "Ordinal Number", tooltip: "Indicates position or order (first, second, 34th)", icon: "fas fa-sort-numeric-down", isPrimary: false },
      { internalType: "RBR", display: "Comparative Adverb", tooltip: "Compares actions (faster, better)", icon: "fas fa-level-up-alt", isPrimary: false },
      { internalType: "RBS", display: "Superlative Adverb", tooltip: "Highest degree adverb (fastest, best)", icon: "fas fa-medal", isPrimary: false },
      { internalType: "WRB", display: "WH-adverb", tooltip: "WH-adverb (how, when, where)", icon: "fas fa-question", isPrimary: false }
    ],
    "Other Placeholders": [
      { internalType: "Onomatopoeia", display: "Onomatopoeia", tooltip: "A sound word used as an interjection (buzz, hiss)", icon: "fas fa-volume-up", isPrimary: true },
      { internalType: "FW", display: "Foreign Word", tooltip: "A foreign word (bonjour, ciao, hola)", icon: "fas fa-globe", isPrimary: true },
      { internalType: "Number", display: "Number", tooltip: "Any numerical value (five, 10)", icon: "fas fa-hashtag", isPrimary: true },
      { internalType: "Exclamation", display: "Exclamation", tooltip: "A short outburst (Stop!, Wow!)", icon: "fas fa-bullhorn", isPrimary: true },
      { internalType: "CC", display: "Coordinating Conjunction", tooltip: "e.g., and, or, but", icon: "fas fa-link", isPrimary: false },
      { internalType: "PDT", display: "Pre-determiner", tooltip: "e.g., all, both, half", icon: "fas fa-text-height", isPrimary: false },
      { internalType: "WDT", display: "WH-determiner", tooltip: "e.g., which, what, that", icon: "fas fa-question", isPrimary: false }
    ]
  };

  // ====================================================
  // 6. PLACEHOLDER & FORM HANDLING FUNCTIONS
  // ====================================================
  function insertPlaceholder(internalType, displayName, isCustom) {
    const sanitized = Utils.sanitizeString(internalType);
    
    // Recalculate count from story text.
    const currentText = $('#storyText').val();
    const regex = new RegExp('\\{' + sanitized + '(\\d+)\\}', 'g');
    let match, max = 0;
    while ((match = regex.exec(currentText)) !== null) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
    const newCount = max + 1;
    variableCounts[sanitized] = newCount;
    
    const id = sanitized + newCount;
    const ph = `{${id}}`;
    insertPlaceholderAtCursor(ph);
    
    if (!variables.some(v => v.id === id)) {
      variables.push({ id, internalType, display: displayName, isCustom: !!isCustom, order: insertionCounter++ });
    }
    updateVariablesList();
  }

  function formatLabel(variable) {
    if (variable.internalType.startsWith('PRONOUN|')) {
      const parts = variable.internalType.split('|');
      const group = parts[1];
      const form = parts[2];
      const formMap = {
        subject: 'Subject',
        object: 'Object',
        possAdj: 'Possessive Adjective',
        possPron: 'Possessive Pronoun',
        reflexive: 'Reflexive'
      };
      return `Pronoun (${formMap[form]} - Group ${group.replace('PronounGroup', '')})`;
    }
    return variable.display;
  }

  function insertPlaceholderAtCursor(placeholder) {
    const textarea = document.getElementById('storyText');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    let textValue = textarea.value;
    const savedScrollTop = textarea.scrollTop;
    if (startPos < endPos) {
      let selectedText = textValue.substring(startPos, endPos);
      const hasLeadingSpace = /^\s/.test(selectedText);
      const hasTrailingSpace = /\s$/.test(selectedText);
      selectedText = selectedText.trim();
      let insertion = placeholder;
      if (hasLeadingSpace || hasTrailingSpace) {
        insertion += ' ';
      }
      textValue = textValue.substring(0, startPos) + insertion + textValue.substring(endPos);
      textarea.value = textValue;
      const newCaretPos = startPos + insertion.length;
      textarea.selectionStart = textarea.selectionEnd = newCaretPos;
    } else {
      textarea.value = textValue.substring(0, startPos) + placeholder + textValue.substring(endPos);
      const newCaretPos = startPos + placeholder.length;
      textarea.selectionStart = textarea.selectionEnd = newCaretPos;
    }
    textarea.focus();
    textarea.scrollTop = savedScrollTop;
  }

  function updateVariablesFromText() {
    const txt = $('#storyText').val();
    variables = [];
    variableCounts = {};
    insertionCounter = 0;
    
    const regex = /\{([^}]+)\}/g;
    let m;
    while ((m = regex.exec(txt)) !== null) {
      const id = m[1];
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
            display: Utils.naturalDisplay(custom.type),
            isCustom: true,
            order: insertionCounter++
          };
        } else {
          const guessed = TypeHelpers.guessTypeFromId(id);
          const originalDisplay = TypeHelpers.getOriginalDisplayForType(guessed) || guessed;
          variableEntry = {
            id: id,
            internalType: guessed,
            display: originalDisplay,
            order: insertionCounter++
          };
        }
        variables.push(variableEntry);
      }
    }
    updateVariablesList();
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');
  }

  function updateVariablesList() {
    const sel = document.getElementById('existingPlaceholders');
    sel.innerHTML = '<option value="">-- Select Placeholder --</option>';
    variables.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${formatLabel(v)} ({${v.id}})`;
      sel.appendChild(opt);
    });
  }

  // ====================================================
  // 7. UPDATE PLACEHOLDER ACCORDION
  // ====================================================
  function updatePlaceholderAccordion(accordionSelector, noResultsSelector, searchVal = '') {
    if (searchVal) {
      $('#searchQuery').text(searchVal);
      $('#searchQueryBtn').text(searchVal);
    }
  
    const accordion = $(accordionSelector);
    accordion.empty();
    categoryOrder.forEach(categoryName => {
      const placeholders = allPlaceholders[categoryName] || [];
      const sanitized = categoryName.replace(/\s+/g, '');
      const card = $(`<div class='card'></div>`);
      const cardHeader = $(`
        <div class='card-header' id='${sanitized}Heading'>
          <h2 class='mb-0'>
            <button class='btn btn-link btn-block text-left' type='button'
              data-toggle='collapse' data-target='#${sanitized}Collapse'
              aria-expanded='true' aria-controls='${sanitized}Collapse'>
              ${categoryName}
            </button>
          </h2>
        </div>`);
      const collapseDiv = $(`
        <div id='${sanitized}Collapse' class='collapse show'
          aria-labelledby='${sanitized}Heading' data-parent='${accordionSelector}'>
          <div class='card-body'><div class='list-group'></div></div>
        </div>`);
      const primaryItems = placeholders.filter(p => p.isPrimary);
      const secondaryItems = placeholders.filter(p => !p.isPrimary);
      primaryItems.forEach(p => {
        const showItem = matchesSearch(p, searchVal);
        const item = $(`
          <div class='list-group-item placeholder-btn'
            data-internal='${p.internalType}'
            data-display='${p.display}'
            style='display: ${showItem ? 'block' : 'none'};'>
            <i class='${p.icon}'></i> ${p.display}
            <i class='fas fa-info-circle accordion-info-icon' data-tooltip="${p.tooltip}" style="font-size:0.8em; margin-left:5px;"></i>
          </div>`);
        collapseDiv.find('.list-group').append(item);
      });
      if (secondaryItems.length > 0) {
        const hiddenWrapper = $(`<div class='secondary-placeholder-wrapper'></div>`);
        secondaryItems.forEach(p => {
          const showItem = matchesSearch(p, searchVal);
          const item = $(`
            <div class='list-group-item placeholder-btn secondary-placeholder'
              data-internal='${p.internalType}'
              data-display='${p.display}'
              style='display: ${showItem ? 'block' : 'none'};'>
              <i class='${p.icon}'></i> ${p.display}
              <i class='fas fa-info-circle accordion-info-icon' data-tooltip="${p.tooltip}" style="font-size:0.8em; margin-left:5px;"></i>
            </div>`);
          hiddenWrapper.append(item);
        });
        collapseDiv.find('.list-group').append(hiddenWrapper);
        const toggleLink = $(`
          <div class='show-more-toggle' data-category='${sanitized}'>
            Show More
          </div>`);
        collapseDiv.find('.list-group').append(toggleLink);
        if (!searchVal) {
          hiddenWrapper.find('.secondary-placeholder').hide();
          toggleLink.text('Show More');
        } else {
          let anySecondaryVisible = false;
          hiddenWrapper.find('.secondary-placeholder').each(function () {
            if ($(this).css('display') !== 'none') anySecondaryVisible = true;
          });
          toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
        }
      }
      card.append(cardHeader).append(collapseDiv);
      accordion.append(card);
    });
    if (customPlaceholders.length > 0) {
      const card = $(`<div class='card'></div>`);
      const cardHeader = $(`
        <div class='card-header' id='CustomPlaceholdersHeading'>
          <h2 class='mb-0'>
            <button class='btn btn-link btn-block text-left' type='button'
              data-toggle='collapse' data-target='#CustomPlaceholdersCollapse'
              aria-expanded='true' aria-controls='CustomPlaceholdersCollapse'>
              Custom Placeholders
            </button>
          </h2>
        </div>`);
      const collapseDiv = $(`
        <div id='CustomPlaceholdersCollapse' class='collapse show'
          aria-labelledby='CustomPlaceholdersHeading' data-parent='${accordionSelector}'>
          <div class='card-body'><div class='list-group'></div></div>
        </div>`);
      customPlaceholders.forEach(p => {
        const showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
        const item = $(`
          <div class='list-group-item placeholder-btn custom-placeholder'
            data-internal='${p.type}'
            data-display='${p.type}'
            style='display: ${showItem ? 'block' : 'none'};'>
            <i class='fas fa-star'></i> ${p.type}
          </div>`);
        collapseDiv.find('.list-group').append(item);
      });
      card.append(cardHeader).append(collapseDiv);
      accordion.append(card);
    }
    if (searchVal) {
      let anyShown = false;
      accordion.find('.placeholder-btn').each(function () {
        if ($(this).css('display') !== 'none') anyShown = true;
      });
      $(noResultsSelector).toggle(!anyShown);
      accordion.find('.card-header, .show-more-toggle').hide();
    } else {
      $(noResultsSelector).hide();
      accordion.find('.card-header, .show-more-toggle').show();
    }
  }
  
  function matchesSearch(placeholder, searchVal) {
    if (searchVal) {
      return placeholder.display.toLowerCase().includes(searchVal.toLowerCase());
    }
    return placeholder.isPrimary;
  }

  // ====================================================
  // 7. PLACEHOLDER SELECTION & INFO ICON HANDLERS
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
  // 7. CUSTOM PLACEHOLDER HANDLERS & SAVED STORIES SORTING
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
  $(document).on('click', '.placeholder-btn', function () {
    if ($('#placeholderModal').hasClass('show')) {
      $('#placeholderModal').modal('hide');
    }
    const internalType = $(this).data('internal');
    const displayName = $(this).data('display');
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
    insertPlaceholder(internalType, displayName, false);
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
  });

  // ====================================================
  // 8. VERB & NOUN SELECTION MODALS
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
        $(container).find('.noun-number-btn').on('click', function () {
          const selected = $(this).data('form');
          const finalInternal = TypeHelpers.getNounFinalType(baseInternal, selected);
          const finalDisplay = baseDisplay + " (" + selected + ")";
          insertPlaceholder(finalInternal, finalDisplay, false);
          Swal.close();
        });
      }
    });
  }
  const VERB_TENSES = [
    { value: 'VB', text: 'Base Form (VB) e.g., "I run"' },
    { value: 'VBP', text: 'Present (Non-3rd Person Singular) (VBP) e.g., "I run"' },
    { value: 'VBZ', text: 'Present (3rd Person Singular) (VBZ) e.g., "he runs"' },
    { value: 'VBD', text: 'Past (VBD) e.g., "ran"' },
    { value: 'VBG', text: 'Present Participle (VBG) e.g., "running"' },
    { value: 'VBN', text: 'Past Participle (VBN) e.g., "run"' }
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
        $(container).find('.verb-tense-btn').on('click', function () {
          const selectedTense = $(this).data('tense');
          const tenseText = $(this).data('text');
          const finalInternal = TypeHelpers.computeFinalVerbType(baseInternal, selectedTense);
          const finalDisplay = baseDisplay + " (" + tenseText + ")";
          insertPlaceholder(finalInternal, finalDisplay, false);
          Swal.close();
        });
      }
    });
  }

  // ====================================================
  // 9. PRONOUN HANDLERS
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
          insertPronounPlaceholder(grp, form);
        });
        $(container).find('#createNewPronounGroupBtn').on('click', function () {
          pronounGroupCount++;
          const newGroup = `PronounGroup${pronounGroupCount}`;
          pronounGroups[newGroup] = null;
          Swal.close();
          insertPronounPlaceholder(newGroup, form);
        });
      }
    });
  }
  function insertPronounPlaceholder(groupId, form) {
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
      const displayType = `PRONOUN|${groupId}|${form}`;
      variables.push({
        id: placeholderId,
        internalType: displayType,
        display: displayType,
        order: insertionCounter++
      });
      updateVariablesList();
    }
    insertPlaceholderAtCursor(`{${placeholderId}}`);
  }
  
  function showPronounReuseFlow(variable) {
    const parts = variable.internalType.split('|');
    const groupId = parts[1];
    const form = parts[2];
    Swal.fire({
      title: 'Pronoun Placeholder',
      html: `Group: ${groupId}, Form: ${form}<br>Insert again or pick a new form?`,
      showCancelButton: true,
      confirmButtonText: 'Insert Again',
      cancelButtonText: 'New Form'
    }).then(res => {
      if (res.isConfirmed) {
        insertPlaceholderAtCursor(`{${variable.id}}`);
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        pickPronounFormAndGroup();
      }
    });
  }

  // ====================================================
  // 10. BUILD THE FILL-IN-THE-BLANK FORM WITH SORT OPTIONS
  // ====================================================
  function buildFillForm() {
    const form = $('#inputForm');
    form.empty();

    // Remove sorting; display fill inputs in random order.
    // First, handle pronoun groups.
    const groupSet = new Set();
    for (const v of variables) {
      if (v.internalType.startsWith('PRONOUN|')) {
        const parts = v.internalType.split('|');
        groupSet.add(parts[1]);
      }
    }
    if (groupSet.size > 0) {
      form.append(`<h4>Pronouns</h4>`);
      groupSet.forEach(g => {
        const block = $(`
          <div class='form-group'>
            <label>
              <strong>${g}</strong> <i class="fas fa-info-circle fill-info-icon" data-type="${g}" style="font-size:0.8em; margin-left:5px;"></i>
            </label>
          </div>
        `);
        const radios = `
          <div class='form-check'>
            <input type='radio' class='form-check-input' name='${g}-choice' value='HeHim'>
            <label class='form-check-label'>He/Him</label>
          </div>
          <div class='form-check'>
            <input type='radio' class='form-check-input' name='${g}-choice' value='SheHer'>
            <label class='form-check-label'>She/Her</label>
          </div>
          <div class='form-check'>
            <input type='radio' class='form-check-input' name='${g}-choice' value='TheyThem'>
            <label class='form-check-label'>They/Them</label>
          </div>
          <div class='form-check mb-2'>
            <input type='radio' class='form-check-input' name='${g}-choice' value='Custom'>
            <label class='form-check-label'>Custom</label>
          </div>
          <input type='text' class='form-control form-control-sm d-none' id='${g}-custom'
            placeholder='comma-separated: subject, object, possAdj, possPron, reflexive'>
        `;
        block.append(radios);
        form.append(block);
      });
      form.on('change', "input[type='radio']", function () {
        const groupName = $(this).attr('name').replace('-choice', '');
        if ($(this).val() === 'Custom') {
          $(`#${groupName}-custom`).removeClass('d-none');
        } else {
          $(`#${groupName}-custom`).addClass('d-none');
        }
      });
    }

    // Then, create input rows for non-pronoun variables in random order.
    let shuffledVars = [...variables].sort(() => Math.random() - 0.5);
    shuffledVars.forEach(variable => {
      if (variable.internalType.startsWith('PRONOUN|')) return;
      const groupRow = $(`
        <div class="form-group input-row">
          <div class="row">
            <div class="col-sm-4">
              <label class="input-label">
                ${formatLabel(variable)}:
                <i class="fas fa-info-circle fill-info-icon" data-type="${variable.baseInternalType || variable.internalType}" style="font-size:0.8em; margin-left:5px;"></i>
              </label>
            </div>
            <div class="col-sm-8">
              <input type="text"
                class="form-control form-control-sm compact-input"
                name="${variable.id}"
                data-label="${variable.display}">
            </div>
          </div>
        </div>
      `);
      if (fillValues[variable.id]) {
        groupRow.find('input').val(fillValues[variable.id]);
      }
      form.append(groupRow);
    });
  }

  // ====================================================
  // 11. DOCUMENT READY & EVENT HANDLERS
  // ====================================================
  $(document).ready(function () {
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults');

    $('#placeholderSearch').on('input', function () {
      const searchVal = $(this).val();
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', searchVal);
    });

    $('#storyText').autocomplete({
      source: function (request, response) {
        const term = request.term;
        const match = term.match(/\{([^\}]+)$/);
        if (match) {
          const searchTerm = match[1].toLowerCase();
          const suggestions = variables
            .map(v => `{${v.id}}`)
            .filter(placeholder => placeholder.toLowerCase().includes(searchTerm));
          response(suggestions);
        } else {
          response([]);
        }
      },
      focus: function () { return false; },
      select: function (event, ui) {
        const textarea = $('#storyText')[0];
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const text = textarea.value;
        const match = text.substring(0, startPos).match(/\{([^\}]+)$/);
        if (match) {
          const prefix = text.substring(0, startPos - match[1].length);
          const suffix = text.substring(endPos);
          textarea.value = prefix + ui.item.value + suffix;
          textarea.selectionStart = textarea.selectionEnd = prefix.length + ui.item.value.length;
        }
        return false;
      },
      minLength: 1
    });

    $('#storyText').on('input', function() {
      updateVariablesFromText();
    });

    $('#existingPlaceholders').on('change', function () {
      const id = this.value;
      if (!id) return;
      const variable = variables.find(v => v.id === id);
      if (!variable) return;
      if (variable.internalType.startsWith('PRONOUN|')) {
        showPronounReuseFlow(variable);
        this.value = '';
        return;
      }
      if (variable.internalType.indexOf("VB") === 0) {
        showVerbTenseSelection(variable.internalType, variable.display);
        this.value = '';
        return;
      }
      if (variable.internalType.indexOf("NN") === 0) {
        showNounNumberSelection(variable.internalType, variable.display);
        this.value = '';
        return;
      }
      insertPlaceholderAtCursor(`{${id}}`);
      this.value = '';
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
        $('#storyText').val(storyContent);
        variables = [];
        variableCounts = {};
        insertionCounter = 0;
        pronounGroupCount = 0;
        pronounGroups = {};
        fillValues = {};
        customPlaceholders = [];
        updateVariablesFromText();
      };
      reader.readAsText(file);
    });
    $('#startGame').on('click', function () {
      storyText = $('#storyText').val();
      if (!storyText) {
        Swal.fire('Oops!', 'Please write a story.', 'error');
        return;
      }
      variables = [];
      const regex = /\{([^}]+)\}/g;
      let m;
      while ((m = regex.exec(storyText)) !== null) {
        let id = m[1];
        let base = id.replace(/\d+$/, '');
        const custom = customPlaceholders.find(p => p.type === base);
        if (custom) {
          variables.push({ id, internalType: custom.type, display: Utils.naturalDisplay(custom.type), isCustom: true, order: insertionCounter++ });
        } else {
          let guessed = TypeHelpers.guessTypeFromId(id);
          let originalDisplay = TypeHelpers.getOriginalDisplayForType(guessed) || guessed;
          variables.push({ id, internalType: guessed, display: originalDisplay, order: insertionCounter++ });
        }
      }
      variables = variables.filter((v, i, self) => i === self.findIndex(t => t.id === v.id));
      if (!variables.length) {
        Swal.fire('Oops!', 'No placeholders found.', 'error');
        return;
      }
      buildFillForm();
      $('#inputs').removeClass('d-none');
      $('#editor').addClass('d-none');
    });
    $('#generateStory').on('click', function () {
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
      const groupSet = new Set();
      for (const v of variables) {
        if (v.internalType.startsWith('PRONOUN|')) {
          const parts = v.internalType.split('|');
          groupSet.add(parts[1]);
        }
      }
      groupSet.forEach(g => {
        const choice = $(`input[name='${g}-choice']:checked`).val();
        if (!choice) {
          pronounGroups[g] = { subject: '', object: '', possAdj: '', possPron: '', reflexive: '' };
          return;
        }
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
          if (splitted.length === 5) {
            pronounGroups[g] = {
              subject: splitted[0],
              object: splitted[1],
              possAdj: splitted[2],
              possPron: splitted[3],
              reflexive: splitted[4],
            };
          } else {
            pronounGroups[g] = { subject: '', object: '', possAdj: '', possPron: '', reflexive: '' };
          }
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
          if (!groupObj) {
            final = final.replace(phRegex, '');
          } else {
            const finalWord = groupObj[form] || '';
            final = final.replace(phRegex, finalWord);
          }
        } else {
          const userVal = fillValues[v.id] || '';
          final = final.replace(phRegex, userVal);
        }
      }
      $('#finalStory').text(final);
      $('#displayTitle').text($('#storyTitle').val());
      $('#displayAuthor').text($('#storyAuthor').val());
      $('#result').removeClass('d-none');
      $('#inputs').addClass('d-none');
    });
    $('#createNewStory2, #createNewStory').on('click', function (e) {
      e.preventDefault();
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
    });
    function createNewStory() {
      $('#storyTitle').val('');
      $('#storyAuthor').val('');
      $('#storyText').val('');
      variables = [];
      variableCounts = {};
      insertionCounter = 0;
      customPlaceholders = [];
      fillValues = {};
      pronounGroups = {};
      pronounGroupCount = 0;
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
    });
    $('#mySavedStoriesBtn').on('click', function () {
      Storage.loadSavedStoriesList();
      $('#savedStoriesModal').modal('show');
    });
    // NEW: Wire up the click handlers for saved story buttons.
    $(document).on('click', '.loadSavedStoryBtn', function () {
      const index = $(this).data('index');
      $('#savedStoriesModal').modal('hide');
      // For play mode, load the story and jump straight to fill-in.
      Storage.loadSavedStory(index, "play");
    });
    $(document).on('click', '.editSavedStoryBtn', function () {
      const index = $(this).data('index');
      $('#savedStoriesModal').modal('hide');
      // For edit mode, load the story into the editor.
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
    });
  });
})();
