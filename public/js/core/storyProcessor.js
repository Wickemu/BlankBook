// public/js/core/storyProcessor.js
import state from './state.js';
import { updateVariablesFromEditor } from './placeholders.js';

/**
 * Functions for processing and manipulating story text
 */

// Fill in placeholders with user-provided values
export const fillPlaceholders = (templateText, variables, fillValues, pronounGroups) => {
    let finalText = templateText;
    
    for (const variable of variables) {
        const phRegex = new RegExp(`\\{${variable.id}\\}`, 'g');
        if (variable.internalType.startsWith('PRONOUN|')) {
            const parts = variable.internalType.split('|');
            const groupId = parts[1];
            const form = parts[2];
            const groupObj = pronounGroups[groupId];
            finalText = finalText.replace(phRegex, groupObj ? (groupObj[form] || '') : '');
        } else {
            const userVal = fillValues[variable.id] || '';
            finalText = finalText.replace(phRegex, userVal);
        }
    }
    
    return finalText;
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