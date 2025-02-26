// public/js/utils/domUtils.js

/**
 * DOM utility functions for working with the story editor and UI
 */

// Show a confirmation dialog using SweetAlert
export const confirmDialog = (options) => {
  const defaultOptions = {
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  return Swal.fire(finalOptions);
};

// Show a toast notification
export const showToast = (title, icon = 'success', timer = 1500) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true
  });
};

// Show an error message
export const showError = (title, text = '') => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'error'
  });
};

// Toggle element visibility
export const toggleVisibility = (selector, isVisible) => {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) {
    element.style.display = isVisible ? '' : 'none';
  }
};

// Toggle class on element
export const toggleClass = (selector, className, shouldAdd) => {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) {
    if (shouldAdd) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
};

// Show/hide multiple elements by class
export const showView = (viewName) => {
  // Hide all view containers
  document.querySelectorAll('.view-container').forEach(el => {
    el.classList.add('d-none');
  });
  
  // Show the requested view
  document.getElementById(viewName).classList.remove('d-none');
};

// Create element with attributes and content
export const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);
  
  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'html') {
      element.innerHTML = value;
    } else if (key === 'text') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  }
  
  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  
  return element;
};

// Get DOM element value safely (with default)
export const getElementValue = (selector, defaultValue = '') => {
  const element = document.querySelector(selector);
  if (!element) return defaultValue;
  
  if (element.type === 'checkbox') {
    return element.checked;
  } else if (element.type === 'radio') {
    const checkedEl = document.querySelector(`${selector}:checked`);
    return checkedEl ? checkedEl.value : defaultValue;
  } else {
    return element.value || defaultValue;
  }
};

// Set DOM element value safely
export const setElementValue = (selector, value) => {
  const element = document.querySelector(selector);
  if (!element) return;
  
  if (element.type === 'checkbox') {
    element.checked = !!value;
  } else if (element.type === 'radio') {
    const radio = document.querySelector(`${selector}[value="${value}"]`);
    if (radio) radio.checked = true;
  } else {
    element.value = value;
  }
};

// Get form data as object
export const getFormData = (formSelector) => {
  const form = document.querySelector(formSelector);
  if (!form) return {};
  
  const formData = new FormData(form);
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
};

// Clear form fields
export const clearForm = (formSelector) => {
  const form = document.querySelector(formSelector);
  if (!form) return;
  
  form.reset();
  
  // Also clear any custom fields that might not be cleared by reset
  form.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select').forEach(el => {
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = false;
    } else {
      el.value = '';
    }
  });
};

// Copy text to clipboard
export const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          console.error('Error copying text: ', err);
          const success = fallbackCopyTextToClipboard(text);
          resolve(success);
        });
    } else {
      const success = fallbackCopyTextToClipboard(text);
      resolve(success);
    }
  });
};

// Fallback method for copying text to clipboard
export const fallbackCopyTextToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    document.body.removeChild(textarea);
    return false;
  }
};

// Download text as file
export const downloadTextFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
};


// Advanced copy to clipboard function
export const copyTextToClipboard = async (content) => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(content);
      showToast('Copied to clipboard!');
      return true;
    } catch (err) {
      console.error('Error copying text: ', err);
      return fallbackCopyTextToClipboard(content);
    }
  } else {
    return fallbackCopyTextToClipboard(content);
  }
};
