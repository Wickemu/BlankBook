// public/js/core/storyProcessor.js
import state from './state.js';
import { updateVariablesFromEditor, allPlaceholders, VERB_TENSES } from './placeholders.js';

/**
 * Functions for processing and manipulating story text
 */

// Fill in placeholders with user-provided values
export const fillPlaceholders = (templateText, variables, fillValues, pronounGroups) => {
    console.log("========== FILLING PLACEHOLDERS ==========");
    console.log("Input templateText length:", templateText?.length || 0);
    console.log("Available variables:", variables?.length || 0);
    console.log("Fill values:", fillValues);
    console.log("Placeholder text:", templateText);
    
    if (!templateText) return '';
    
    // Extract all placeholders from the text
    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders = [];
    let match;
    while ((match = placeholderRegex.exec(templateText)) !== null) {
        placeholders.push({
            fullMatch: match[0],
            id: match[1]
        });
    }
    
    console.log("Extracted placeholders:", placeholders.length);
    placeholders.forEach(p => console.log(`- ${p.fullMatch} (ID: ${p.id})`));
    
    let result = templateText;
    
    // First pass: process placeholders with explicit variables
    for (const variable of variables) {
        const placeholder = `{${variable.id}}`;
        if (result.includes(placeholder)) {
            console.log(`Processing ${placeholder}...`);
            
            // Handle pronouns specially
            if (variable.internalType.startsWith('PRONOUN|')) {
                const parts = variable.internalType.split('|');
                const groupId = parts[1];
                const form = parts[2];
                console.log(`  Handling pronoun: groupId=${groupId}, form=${form}`);
                
                if (pronounGroups && pronounGroups[groupId] && pronounGroups[groupId][form]) {
                    const pronounValue = pronounGroups[groupId][form];
                    console.log(`  Found pronoun value: "${pronounValue}"`);
                    result = result.replace(new RegExp(placeholder, 'g'), pronounValue);
                } else {
                    console.warn(`  WARNING: No pronoun value found for group ${groupId} form ${form}`);
                    result = result.replace(new RegExp(placeholder, 'g'), variable.displayOverride || variable.display || '[MISSING PRONOUN]');
                }
            } 
            // Handle regular variables
            else if (fillValues && fillValues[variable.id]) {
                console.log(`  Replacing with user-provided value: "${fillValues[variable.id]}"`);
                result = result.replace(new RegExp(placeholder, 'g'), fillValues[variable.id]);
            } else {
                console.warn(`  WARNING: No fill value for ${variable.id}`);
                result = result.replace(new RegExp(placeholder, 'g'), variable.displayOverride || '[MISSING VALUE]');
            }
        } else {
            console.log(`Placeholder {${variable.id}} not found in text`);
        }
    }
    
    // Second pass: Check for any remaining placeholders not in the variables list
    let remainingMatch;
    const remainingRegex = /\{([^}]+)\}/g;
    while ((remainingMatch = remainingRegex.exec(result)) !== null) {
        const missingId = remainingMatch[1];
        console.warn(`WARNING: Found placeholder {${missingId}} that wasn't in the variables list!`);
        
        // Try to directly replace from fillValues as a last resort
        if (fillValues && fillValues[missingId]) {
            console.log(`  Replacing directly from fillValues with: "${fillValues[missingId]}"`);
            result = result.replace(new RegExp(`\\{${missingId}\\}`, 'g'), fillValues[missingId]);
        } else {
            console.error(`  ERROR: No value available for placeholder {${missingId}}`);
        }
    }
    
    console.log("Final text after replacements:", result);
    return result;
};

// Parse uploaded story text file
export const parseStoryFile = (content) => {
    const titleMatch = content.match(/^Title:\s*(.*)$/m);
    const authorMatch = content.match(/^Author:\s*(.*)$/m);
    const storyStartIndex = content.indexOf('\n\n');
    const storyContent = storyStartIndex !== -1 ? content.substring(storyStartIndex + 2) : content;
    
    return {
        title: titleMatch ? titleMatch[1] : '',
        author: authorMatch ? authorMatch[1] : '',
        content: storyContent
    };
};

// Format story for export/download
export const formatStoryForExport = (title, author, content) => {
    return `Title: ${title}\nAuthor: ${author}\n\n${content}`;
};

// Create download filename from title
export const createFilenameFromTitle = (title) => {
    return title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt' : 'story.txt';
};

// Reset story state for a new story
export const resetStoryState = () => {
    // Clear DOM fields
    $('#storyTitle').val('');
    $('#storyAuthor').val('');
    $('#storyText').html('');
    $('#storyTags').val('');
    
    // Reset state variables
    state.variables = [];
    state.variableCounts = {};
    state.insertionCounter = 0;
    state.customPlaceholders = [];
    state.fillValues = {};
    state.pronounGroups = {};
    state.pronounGroupCount = 0;
    state.storyHasUnsavedChanges = false;
    
    // Show editor view
    $('#editor').removeClass('d-none');
    $('#inputs, #result').addClass('d-none');
    
    // Update UI
    updateVariablesFromEditor();
};

// Load story data into the editor
export const loadStoryIntoEditor = (storyData) => {
    $('#storyTitle').val(storyData.title || '');
    $('#storyAuthor').val(storyData.author || '');
    $('#storyText').html(storyData.content || '');
    $('#storyTags').val(storyData.tags ? storyData.tags.join(', ') : '');
    
    // Reset state with the loaded story's data
    state.variables = storyData.variables || [];
    state.variableCounts = storyData.variableCounts || {};
    state.insertionCounter = 0;
    state.customPlaceholders = storyData.customPlaceholders || [];
    state.fillValues = storyData.fillValues || {};
    state.pronounGroups = storyData.pronounGroups || {};
    state.pronounGroupCount = storyData.pronounGroupCount || 0;
    state.storyHasUnsavedChanges = false;
    
    // Update UI based on the loaded story
    updateVariablesFromEditor();
};