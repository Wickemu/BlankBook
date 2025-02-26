/**
 * AJAX Debugging Script
 * Add this to your HTML via: <script src="debug.js"></script>
 */

// Wait for jQuery to be defined before overriding $.ajax
(function checkJQuery() {
    if (typeof $ !== 'undefined' && typeof $.ajax === 'function') {
        // jQuery is loaded, proceed with overriding
        console.log('%c[AJAX Debug] jQuery detected, installing AJAX debugger...', 'color: purple; font-weight: bold');
        
        // Keep a reference to the original $.ajax method
        const originalAjax = $.ajax;
        
        // Debug version that logs all calls
        $.ajax = function(options) {
            // If options is a string (URL), convert to an object
            if (typeof options === 'string') {
                options = { url: options };
            }
            
            const startTime = new Date();
            console.log(`%c[AJAX REQUEST] ${options.method || 'GET'} ${options.url}`, 
                        'color: blue; font-weight: bold;');
            console.log('Request Data:', options.data || 'No data');
            
            // Intercept the success callback
            const originalSuccess = options.success;
            options.success = function(data, textStatus, jqXHR) {
                const endTime = new Date();
                const duration = endTime - startTime;
                console.log(`%c[AJAX SUCCESS] ${options.method || 'GET'} ${options.url} (${duration}ms)`, 
                            'color: green; font-weight: bold;');
                console.log('Response Data:', data);
                
                // Call the original success handler
                if (originalSuccess) {
                    originalSuccess.apply(this, arguments);
                }
            };
            
            // Intercept the error callback
            const originalError = options.error;
            options.error = function(jqXHR, textStatus, errorThrown) {
                const endTime = new Date();
                const duration = endTime - startTime;
                console.log(`%c[AJAX ERROR] ${options.method || 'GET'} ${options.url} (${duration}ms)`, 
                            'color: red; font-weight: bold;');
                console.log('Status:', textStatus);
                console.log('Error:', errorThrown);
                console.log('Response:', jqXHR.responseText);
                console.log('Status Code:', jqXHR.status);
                
                // Network error
                if (jqXHR.status === 0) {
                    console.log('%cThis appears to be a network error. Possible causes:', 'color: red');
                    console.log('1. CORS issue - Different origin not allowed');
                    console.log('2. Server not running');
                    console.log('3. Network connectivity issue');
                }
                
                // Call the original error handler
                if (originalError) {
                    originalError.apply(this, arguments);
                }
            };
            
            // Call the original $.ajax with our modified options
            return originalAjax.call($, options);
        };
        
        console.log('%c[AJAX Debug] Installed - All AJAX calls will be logged', 'color: purple; font-weight: bold');
    } else {
        // jQuery not loaded yet, check again soon
        console.log('[AJAX Debug] Waiting for jQuery to load...');
        setTimeout(checkJQuery, 50);
    }
})(); 