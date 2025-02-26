// utils.js
"use strict";

export const Utils = {
  debounce: (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  },
  toTitleCase: (str) =>
    str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  capitalize: (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  pascalCase: (str) =>
    str.toLowerCase().split(/\s+/).map(Utils.capitalize).join(''),
  naturalDisplay: (str) =>
    str.replace(/([a-z])([A-Z])/g, '$1 $2'),
  sanitizeString: (str) =>
    str.replace(/[^a-zA-Z0-9_]/g, '')
};

export const decodeHTMLEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
