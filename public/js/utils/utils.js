// public/js/utils/utils.js
import { StringUtils, decodeHTMLEntities } from './StringUtils.js';

export { StringUtils, decodeHTMLEntities };

export const Utils = {
  debounce: (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  },
  // Re-export string utilities for backward compatibility
  ...StringUtils
};