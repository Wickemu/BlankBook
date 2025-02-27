/**
 * Utility functions for showing notifications to the user
 */

/**
 * Shows a toast notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - How long to show the notification in ms
 */
export const showToast = (message, type = 'success', duration = 3000) => {
    if (typeof Swal !== 'undefined') {
        // If SweetAlert2 is available
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: duration,
            timerProgressBar: true,
            icon: type,
            title: message
        });
    } else {
        // Fallback to alert if SweetAlert is not available
        console.log(`${type.toUpperCase()}: ${message}`);
        if (type === 'error') {
            alert(message);
        }
    }
};

/**
 * Shows an error notification with a title and message
 * @param {string} title - The error title
 * @param {string} message - The error message
 */
export const showError = (title, message) => {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message
        });
    } else {
        console.error(`${title}: ${message}`);
        alert(`${title}: ${message}`);
    }
}; 