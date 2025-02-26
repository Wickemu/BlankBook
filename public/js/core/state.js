// public/js/core/state.js

// Create state singleton object
const state = {
  variables: [],
  variableCounts: {},
  insertionCounter: 0,
  storyText: '',
  customPlaceholders: [],
  fillValues: {},
  pronounGroups: {},
  pronounGroupCount: 0,
  lastRange: null,
  usageTracker: {},
  placeholderInsertionInProgress: false,
  storyHasUnsavedChanges: false,
  fillOrder: 'alphabetical',
  currentStoryId: null,
  currentPlaceholderSearch: '',
  currentModalPlaceholderSearch: '',
  currentEditingVariable: null,
  currentPlaceholderElement: null,
  isEditingPlaceholder: false,
};

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
}