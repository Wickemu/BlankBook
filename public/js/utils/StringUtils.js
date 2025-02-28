/**
 * A dedicated module for string manipulation utilities
 */
export const StringUtils = {
  /**
   * Converts a string to title case (first letter of each word capitalized)
   */
  toTitleCase: (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  
  /**
   * Capitalizes the first letter of a string
   */
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  
  /**
   * Converts a string to PascalCase
   */
  pascalCase: (str) => str.toLowerCase().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''),
  
  /**
   * Converts camelCase or PascalCase to a natural display format with spaces
   */
  naturalDisplay: (str) => str.replace(/([a-z])([A-Z])/g, '$1 $2'),
  
  /**
   * Removes all characters except alphanumerics and underscores
   */
  sanitizeString: (str) => str.replace(/[^a-zA-Z0-9_]/g, ''),
  
  /**
   * Extracts a subtype from a string by removing prefix and trailing numbers
   */
  extractSubtype: (type, prefixLength) => {
    let sub = type.substring(prefixLength);
    if (sub.startsWith("_")) sub = sub.substring(1);
    return sub.replace(/\d+$/, '');
  },
  
  /**
   * Escapes special characters in a string for use in a regular expression
   * @param {string} string - The string to escape
   * @returns {string} The escaped string safe for regex use
   */
  escapeRegExp: (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
};

/**
 * Decodes HTML entities in a string
 */
export const decodeHTMLEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}; 