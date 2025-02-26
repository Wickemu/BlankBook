// init.js - We can use jQuery directly since it's loaded globally
// No need to import it as a module

// Initialize Bootstrap tooltips when document is ready
$(function () { 
    $('[data-toggle="tooltip"]').tooltip(); 
  });