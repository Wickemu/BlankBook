/**
 * Responsive enhancements for BlankBook
 * Handles mobile-specific interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const storyTitle = document.getElementById('storyTitle');
    const storyAuthor = document.getElementById('storyAuthor');
    const storyTags = document.getElementById('storyTags');
    
    // Load saved metadata if available
    function loadSavedMetadata() {
        // Get saved values
        const savedTitle = localStorage.getItem('storyTitle') || '';
        const savedAuthor = localStorage.getItem('storyAuthor') || '';
        const savedTags = localStorage.getItem('storyTags') || '';
        
        // If any fields have content in localStorage, restore them
        if (savedTitle && storyTitle) storyTitle.value = savedTitle;
        if (savedAuthor && storyAuthor) storyAuthor.value = savedAuthor;
        if (savedTags && storyTags) storyTags.value = savedTags;
    }
    
    // Run on page load
    loadSavedMetadata();
    
    // Store metadata values in localStorage when they change
    function saveMetadataToLocalStorage() {
        if (storyTitle) localStorage.setItem('storyTitle', storyTitle.value);
        if (storyAuthor) localStorage.setItem('storyAuthor', storyAuthor.value);
        if (storyTags) localStorage.setItem('storyTags', storyTags.value);
    }
    
    // Add event listeners to save metadata on input
    if (storyTitle) storyTitle.addEventListener('input', saveMetadataToLocalStorage);
    if (storyAuthor) storyAuthor.addEventListener('input', saveMetadataToLocalStorage);
    if (storyTags) storyTags.addEventListener('input', saveMetadataToLocalStorage);
    
    // Window resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Handle any resize-specific logic here if needed in the future
    });
}); 