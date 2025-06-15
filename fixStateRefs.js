// fixStateRefs.js
const fs = require('fs');
const path = require('path');

// Path to your main.js file located in public/js
const filePath = path.resolve(__dirname, 'public/js/main.js');

// Read the contents of public/js/main.js
let content = fs.readFileSync(filePath, 'utf8');

// List of state properties (from your state.js default export)
// Make sure this list includes all properties you want to ensure are accessed via State.
const stateProperties = [
  "variables",
  "variableCounts",
  "insertionCounter",
  "storyText",
  "customPlaceholders",
  "fillValues",
  "pronounGroups",
  "pronounGroupCount",
  "lastRange",
  "usageTracker",
  "placeholderInsertionInProgress",
  "storyHasUnsavedChanges",
  "fillOrder",
  "currentStoryId",
  "currentPlaceholderSearch",
  "currentModalPlaceholderSearch",
  "currentEditingVariable",
  "currentPlaceholderElement",
  "isEditingPlaceholder"
];

// For each property, perform a regex replacement that prefixes it with "State."
// The regex uses a negative lookbehind so that any occurrence already prefixed by "State." is not changed.
stateProperties.forEach(prop => {
  // The regex: (?<!State\.)\bprop\b
  const regex = new RegExp(`(?<!State\\.)\\b${prop}\\b`, 'g');
  content = content.replace(regex, `State.${prop}`);
});

// Write the corrected content to a new file
const outputPath = path.resolve(__dirname, 'main.fixed.js');
fs.writeFileSync(outputPath, content, 'utf8');

console.log(`All state variable references have been corrected.
The updated file has been saved as: ${outputPath}`);
