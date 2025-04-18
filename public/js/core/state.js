// public/js/core/state.js

// Central state object for the application
const state = {
    // Editor state
    lastRange: null,
    lastSelectedText: '',
    // Story state
    storyText: '',
    fillValues: {},
    fillOrder: 'alphabetical', // or 'random'
    storyHasUnsavedChanges: false,
    // Placeholder state
    variables: [],
    variableCounts: {},
    insertionCounter: 0,
    usageTracker: {}, // Tracks how many times each placeholder is used
    // Custom placeholders
    customPlaceholders: [],
    // Pronoun groups
    pronounGroupCount: 0,
    pronounGroups: {},
    // Search state
    currentPlaceholderSearch: '',
    currentModalPlaceholderSearch: '',
    // Placeholder editing
    isEditingPlaceholder: false,
    currentEditingVariable: null,
    // Current story metadata
    currentStoryId: null,
    // NEW: Chapter-related state
    chapters: [],
    currentChapter: 0,
    allChapters: null, // Used for play mode to store all chapters
    storyTitle: '',
    storyAuthor: ''
};

// Initialize state
function initState() {
    console.log("Initializing state");
    
    // Create arrays if they don't exist
    if (!state.variables) {
        state.variables = [];
    }
    
    if (!state.usageTracker) {
        state.usageTracker = {};
    }
    
    if (!state.customPlaceholders) {
        state.customPlaceholders = [];
    }
    
    if (!state.chapters) {
        state.chapters = [];
    }
    
    console.log("State initialized:", state);
}

// Run initialization
initState();

// Export the state object as default export
export default state;

// Predefined pronoun mappings
export const pronounMapping = {
  "He/Him": { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
  "She/Her": { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
  "They/Them": { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
};

// Function to reset state to initial values
export function resetState() {
  state.variables = [];
  state.variableCounts = {};
  state.insertionCounter = 0;
  state.storyText = '';
  state.customPlaceholders = [];
  state.fillValues = {};
  state.pronounGroups = {};
  state.pronounGroupCount = 0;
  state.lastRange = null;
  state.lastSelectedText = '';
  state.usageTracker = {};
  state.placeholderInsertionInProgress = false;
  state.storyHasUnsavedChanges = false;
  state.fillOrder = 'alphabetical';
  state.currentStoryId = null;
  state.currentPlaceholderSearch = '';
  state.currentModalPlaceholderSearch = '';
  state.currentEditingVariable = null;
  state.currentPlaceholderElement = null;
  state.isEditingPlaceholder = false;
  
  // NEW: Reset chapter-related state
  state.chapters = [];
  state.currentChapter = 0;
  state.allChapters = null;
  state.storyTitle = '';
  state.storyAuthor = '';
}