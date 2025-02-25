// state.js
"use strict";

export let variables = [];
export let variableCounts = {};
export let insertionCounter = 0;
export let storyText = '';
export let customPlaceholders = [];
export let fillValues = {};
export let pronounGroups = {}; // { groupName: { subject, object, possAdj, possPron, reflexive } }
export let pronounGroupCount = 0;
export let lastRange = null;
export let usageTracker = {};
export let placeholderInsertionInProgress = false;
export let storyHasUnsavedChanges = false;
export let fillOrder = 'alphabetical';
export let currentStoryPassword = null;
export let currentStoryLocked = false;
export let currentStoryId = null;
export let currentPlaceholderSearch = '';
export let currentModalPlaceholderSearch = '';

export const pronounMapping = {
  "He/Him": { subject: "he", object: "him", possAdj: "his", possPron: "his", reflexive: "himself" },
  "She/Her": { subject: "she", object: "her", possAdj: "her", possPron: "hers", reflexive: "herself" },
  "They/Them": { subject: "they", object: "them", possAdj: "their", possPron: "theirs", reflexive: "themselves" }
};
