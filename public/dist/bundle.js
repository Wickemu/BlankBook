/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/***/ (function(module) {

/*!
* sweetalert2 v11.17.2
* Released under the MIT License.
*/
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  function _assertClassBrand(e, t, n) {
    if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
    throw new TypeError("Private element is not present on this object");
  }
  function _checkPrivateRedeclaration(e, t) {
    if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldGet2(s, a) {
    return s.get(_assertClassBrand(s, a));
  }
  function _classPrivateFieldInitSpec(e, t, a) {
    _checkPrivateRedeclaration(e, t), t.set(e, a);
  }
  function _classPrivateFieldSet2(s, a, r) {
    return s.set(_assertClassBrand(s, a), r), r;
  }

  const RESTORE_FOCUS_TIMEOUT = 100;

  /** @type {GlobalState} */
  const globalState = {};
  const focusPreviousActiveElement = () => {
    if (globalState.previousActiveElement instanceof HTMLElement) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  };

  /**
   * Restore previous active (focused) element
   *
   * @param {boolean} returnFocus
   * @returns {Promise<void>}
   */
  const restoreActiveElement = returnFocus => {
    return new Promise(resolve => {
      if (!returnFocus) {
        return resolve();
      }
      const x = window.scrollX;
      const y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(() => {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      window.scrollTo(x, y);
    });
  };

  const swalPrefix = 'swal2-';

  /**
   * @typedef {Record<SwalClass, string>} SwalClasses
   */

  /**
   * @typedef {'success' | 'warning' | 'info' | 'question' | 'error'} SwalIcon
   * @typedef {Record<SwalIcon, string>} SwalIcons
   */

  /** @type {SwalClass[]} */
  const classNames = ['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error', 'draggable', 'dragging'];
  const swalClasses = classNames.reduce((acc, className) => {
    acc[className] = swalPrefix + className;
    return acc;
  }, /** @type {SwalClasses} */{});

  /** @type {SwalIcon[]} */
  const icons = ['success', 'warning', 'info', 'question', 'error'];
  const iconTypes = icons.reduce((acc, icon) => {
    acc[icon] = swalPrefix + icon;
    return acc;
  }, /** @type {SwalIcons} */{});

  const consolePrefix = 'SweetAlert2:';

  /**
   * Capitalize the first letter of a string
   *
   * @param {string} str
   * @returns {string}
   */
  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

  /**
   * Standardize console warnings
   *
   * @param {string | string[]} message
   */
  const warn = message => {
    console.warn(`${consolePrefix} ${typeof message === 'object' ? message.join(' ') : message}`);
  };

  /**
   * Standardize console errors
   *
   * @param {string} message
   */
  const error = message => {
    console.error(`${consolePrefix} ${message}`);
  };

  /**
   * Private global state for `warnOnce`
   *
   * @type {string[]}
   * @private
   */
  const previousWarnOnceMessages = [];

  /**
   * Show a console warning, but only if it hasn't already been shown
   *
   * @param {string} message
   */
  const warnOnce = message => {
    if (!previousWarnOnceMessages.includes(message)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };

  /**
   * Show a one-time console warning about deprecated params/methods
   *
   * @param {string} deprecatedParam
   * @param {string?} useInstead
   */
  const warnAboutDeprecation = function (deprecatedParam) {
    let useInstead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ''}`);
  };

  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   *
   * @param {Function | any} arg
   * @returns {any}
   */
  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;

  /**
   * @param {any} arg
   * @returns {boolean}
   */
  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';

  /**
   * @param {any} arg
   * @returns {Promise<any>}
   */
  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);

  /**
   * @param {any} arg
   * @returns {boolean}
   */
  const isPromise = arg => arg && Promise.resolve(arg) === arg;

  /**
   * Gets the popup container which contains the backdrop and the popup itself.
   *
   * @returns {HTMLElement | null}
   */
  const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);

  /**
   * @param {string} selectorString
   * @returns {HTMLElement | null}
   */
  const elementBySelector = selectorString => {
    const container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  /**
   * @param {string} className
   * @returns {HTMLElement | null}
   */
  const elementByClass = className => {
    return elementBySelector(`.${className}`);
  };

  /**
   * @returns {HTMLElement | null}
   */
  const getPopup = () => elementByClass(swalClasses.popup);

  /**
   * @returns {HTMLElement | null}
   */
  const getIcon = () => elementByClass(swalClasses.icon);

  /**
   * @returns {HTMLElement | null}
   */
  const getIconContent = () => elementByClass(swalClasses['icon-content']);

  /**
   * @returns {HTMLElement | null}
   */
  const getTitle = () => elementByClass(swalClasses.title);

  /**
   * @returns {HTMLElement | null}
   */
  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);

  /**
   * @returns {HTMLElement | null}
   */
  const getImage = () => elementByClass(swalClasses.image);

  /**
   * @returns {HTMLElement | null}
   */
  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);

  /**
   * @returns {HTMLElement | null}
   */
  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getConfirmButton = () => (/** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`));

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getCancelButton = () => (/** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`));

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getDenyButton = () => (/** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`));

  /**
   * @returns {HTMLElement | null}
   */
  const getInputLabel = () => elementByClass(swalClasses['input-label']);

  /**
   * @returns {HTMLElement | null}
   */
  const getLoader = () => elementBySelector(`.${swalClasses.loader}`);

  /**
   * @returns {HTMLElement | null}
   */
  const getActions = () => elementByClass(swalClasses.actions);

  /**
   * @returns {HTMLElement | null}
   */
  const getFooter = () => elementByClass(swalClasses.footer);

  /**
   * @returns {HTMLElement | null}
   */
  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);

  /**
   * @returns {HTMLElement | null}
   */
  const getCloseButton = () => elementByClass(swalClasses.close);

  // https://github.com/jkup/focusable/blob/master/index.js
  const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
  /**
   * @returns {HTMLElement[]}
   */
  const getFocusableElements = () => {
    const popup = getPopup();
    if (!popup) {
      return [];
    }
    /** @type {NodeListOf<HTMLElement>} */
    const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
    const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
    // sort according to tabindex
    .sort((a, b) => {
      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
      if (tabindexA > tabindexB) {
        return 1;
      } else if (tabindexA < tabindexB) {
        return -1;
      }
      return 0;
    });

    /** @type {NodeListOf<HTMLElement>} */
    const otherFocusableElements = popup.querySelectorAll(focusable);
    const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(el => el.getAttribute('tabindex') !== '-1');
    return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter(el => isVisible$1(el));
  };

  /**
   * @returns {boolean}
   */
  const isModal = () => {
    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
  };

  /**
   * @returns {boolean}
   */
  const isToast = () => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    return hasClass(popup, swalClasses.toast);
  };

  /**
   * @returns {boolean}
   */
  const isLoading = () => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    return popup.hasAttribute('data-loading');
  };

  /**
   * Securely set innerHTML of an element
   * https://github.com/sweetalert2/sweetalert2/issues/1926
   *
   * @param {HTMLElement} elem
   * @param {string} html
   */
  const setInnerHtml = (elem, html) => {
    elem.textContent = '';
    if (html) {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(html, `text/html`);
      const head = parsed.querySelector('head');
      if (head) {
        Array.from(head.childNodes).forEach(child => {
          elem.appendChild(child);
        });
      }
      const body = parsed.querySelector('body');
      if (body) {
        Array.from(body.childNodes).forEach(child => {
          if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
            elem.appendChild(child.cloneNode(true)); // https://github.com/sweetalert2/sweetalert2/issues/2507
          } else {
            elem.appendChild(child);
          }
        });
      }
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {boolean}
   */
  const hasClass = (elem, className) => {
    if (!className) {
      return false;
    }
    const classList = className.split(/\s+/);
    for (let i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }
    return true;
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   */
  const removeCustomClasses = (elem, params) => {
    Array.from(elem.classList).forEach(className => {
      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
        elem.classList.remove(className);
      }
    });
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   * @param {string} className
   */
  const applyCustomClass = (elem, params, className) => {
    removeCustomClasses(elem, params);
    if (!params.customClass) {
      return;
    }
    const customClass = params.customClass[(/** @type {keyof SweetAlertCustomClass} */className)];
    if (!customClass) {
      return;
    }
    if (typeof customClass !== 'string' && !customClass.forEach) {
      warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
      return;
    }
    addClass(elem, customClass);
  };

  /**
   * @param {HTMLElement} popup
   * @param {import('./renderers/renderInput').InputClass | SweetAlertInput} inputClass
   * @returns {HTMLInputElement | null}
   */
  const getInput$1 = (popup, inputClass) => {
    if (!inputClass) {
      return null;
    }
    switch (inputClass) {
      case 'select':
      case 'textarea':
      case 'file':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
      case 'checkbox':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
      case 'radio':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
      case 'range':
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
      default:
        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
   */
  const focusInput = input => {
    input.focus();

    // place cursor at end of text in text input
    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      const val = input.value;
      input.value = '';
      input.value = val;
    }
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   * @param {boolean} condition
   */
  const toggleClass = (target, classList, condition) => {
    if (!target || !classList) {
      return;
    }
    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }
    classList.forEach(className => {
      if (Array.isArray(target)) {
        target.forEach(elem => {
          if (condition) {
            elem.classList.add(className);
          } else {
            elem.classList.remove(className);
          }
        });
      } else {
        if (condition) {
          target.classList.add(className);
        } else {
          target.classList.remove(className);
        }
      }
    });
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   */
  const addClass = (target, classList) => {
    toggleClass(target, classList, true);
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   */
  const removeClass = (target, classList) => {
    toggleClass(target, classList, false);
  };

  /**
   * Get direct child of an element by class name
   *
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {HTMLElement | undefined}
   */
  const getDirectChildByClass = (elem, className) => {
    const children = Array.from(elem.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child instanceof HTMLElement && hasClass(child, className)) {
        return child;
      }
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} property
   * @param {*} value
   */
  const applyNumericalStyle = (elem, property, value) => {
    if (value === `${parseInt(value)}`) {
      value = parseInt(value);
    }
    if (value || parseInt(value) === 0) {
      elem.style.setProperty(property, typeof value === 'number' ? `${value}px` : value);
    } else {
      elem.style.removeProperty(property);
    }
  };

  /**
   * @param {HTMLElement | null} elem
   * @param {string} display
   */
  const show = function (elem) {
    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    if (!elem) {
      return;
    }
    elem.style.display = display;
  };

  /**
   * @param {HTMLElement | null} elem
   */
  const hide = elem => {
    if (!elem) {
      return;
    }
    elem.style.display = 'none';
  };

  /**
   * @param {HTMLElement | null} elem
   * @param {string} display
   */
  const showWhenInnerHtmlPresent = function (elem) {
    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
    if (!elem) {
      return;
    }
    new MutationObserver(() => {
      toggle(elem, elem.innerHTML, display);
    }).observe(elem, {
      childList: true,
      subtree: true
    });
  };

  /**
   * @param {HTMLElement} parent
   * @param {string} selector
   * @param {string} property
   * @param {string} value
   */
  const setStyle = (parent, selector, property, value) => {
    /** @type {HTMLElement | null} */
    const el = parent.querySelector(selector);
    if (el) {
      el.style.setProperty(property, value);
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {any} condition
   * @param {string} display
   */
  const toggle = function (elem, condition) {
    let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
    if (condition) {
      show(elem, display);
    } else {
      hide(elem);
    }
  };

  /**
   * borrowed from jquery $(elem).is(':visible') implementation
   *
   * @param {HTMLElement | null} elem
   * @returns {boolean}
   */
  const isVisible$1 = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));

  /**
   * @returns {boolean}
   */
  const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());

  /**
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);

  /**
   * borrowed from https://stackoverflow.com/a/46352119
   *
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const hasCssAnimation = elem => {
    const style = window.getComputedStyle(elem);
    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };

  /**
   * @param {number} timer
   * @param {boolean} reset
   */
  const animateTimerProgressBar = function (timer) {
    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const timerProgressBar = getTimerProgressBar();
    if (!timerProgressBar) {
      return;
    }
    if (isVisible$1(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }
      setTimeout(() => {
        timerProgressBar.style.transition = `width ${timer / 1000}s linear`;
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  const stopTimerProgressBar = () => {
    const timerProgressBar = getTimerProgressBar();
    if (!timerProgressBar) {
      return;
    }
    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
    timerProgressBar.style.width = `${timerProgressBarPercent}%`;
  };

  /**
   * Detect Node env
   *
   * @returns {boolean}
   */
  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

  const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses['html-container']}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses['progress-steps']}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses['html-container']}" id="${swalClasses['html-container']}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses['validation-message']}" id="${swalClasses['validation-message']}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses['timer-progress-bar-container']}">
     <div class="${swalClasses['timer-progress-bar']}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, '');

  /**
   * @returns {boolean}
   */
  const resetOldContainer = () => {
    const oldContainer = getContainer();
    if (!oldContainer) {
      return false;
    }
    oldContainer.remove();
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };
  const resetValidationMessage$1 = () => {
    globalState.currentInstance.resetValidationMessage();
  };
  const addInputChangeListeners = () => {
    const popup = getPopup();
    const input = getDirectChildByClass(popup, swalClasses.input);
    const file = getDirectChildByClass(popup, swalClasses.file);
    /** @type {HTMLInputElement} */
    const range = popup.querySelector(`.${swalClasses.range} input`);
    /** @type {HTMLOutputElement} */
    const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
    const select = getDirectChildByClass(popup, swalClasses.select);
    /** @type {HTMLInputElement} */
    const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
    input.oninput = resetValidationMessage$1;
    file.onchange = resetValidationMessage$1;
    select.onchange = resetValidationMessage$1;
    checkbox.onchange = resetValidationMessage$1;
    textarea.oninput = resetValidationMessage$1;
    range.oninput = () => {
      resetValidationMessage$1();
      rangeOutput.value = range.value;
    };
    range.onchange = () => {
      resetValidationMessage$1();
      rangeOutput.value = range.value;
    };
  };

  /**
   * @param {string | HTMLElement} target
   * @returns {HTMLElement}
   */
  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

  /**
   * @param {SweetAlertOptions} params
   */
  const setupAccessibility = params => {
    const popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  /**
   * @param {HTMLElement} targetElement
   */
  const setupRTL = targetElement => {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };

  /**
   * Add modal + backdrop + no-war message for Russians to DOM
   *
   * @param {SweetAlertOptions} params
   */
  const init = params => {
    // Clean up the old popup container if it exists
    const oldContainerExisted = resetOldContainer();
    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }
    const container = document.createElement('div');
    container.className = swalClasses.container;
    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }
    setInnerHtml(container, sweetHTML);
    container.dataset['swal2Theme'] = params.theme;
    const targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  /**
   * @param {HTMLElement | object | string} param
   * @param {HTMLElement} target
   */
  const parseHtmlToContainer = (param, target) => {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param);
    }

    // Object
    else if (typeof param === 'object') {
      handleObject(param, target);
    }

    // Plain string
    else if (param) {
      setInnerHtml(target, param);
    }
  };

  /**
   * @param {any} param
   * @param {HTMLElement} target
   */
  const handleObject = (param, target) => {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param);
    }

    // For other objects use their string representation
    else {
      setInnerHtml(target, param.toString());
    }
  };

  /**
   * @param {HTMLElement} target
   * @param {any} elem
   */
  const handleJqueryElem = (target, elem) => {
    target.textContent = '';
    if (0 in elem) {
      for (let i = 0; i in elem; i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderActions = (instance, params) => {
    const actions = getActions();
    const loader = getLoader();
    if (!actions || !loader) {
      return;
    }

    // Actions (buttons) wrapper
    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
      hide(actions);
    } else {
      show(actions);
    }

    // Custom class
    applyCustomClass(actions, params, 'actions');

    // Render all the buttons
    renderButtons(actions, loader, params);

    // Loader
    setInnerHtml(loader, params.loaderHtml || '');
    applyCustomClass(loader, params, 'loader');
  };

  /**
   * @param {HTMLElement} actions
   * @param {HTMLElement} loader
   * @param {SweetAlertOptions} params
   */
  function renderButtons(actions, loader, params) {
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    if (!confirmButton || !denyButton || !cancelButton) {
      return;
    }

    // Render buttons
    renderButton(confirmButton, 'confirm', params);
    renderButton(denyButton, 'deny', params);
    renderButton(cancelButton, 'cancel', params);
    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
    if (params.reverseButtons) {
      if (params.toast) {
        actions.insertBefore(cancelButton, confirmButton);
        actions.insertBefore(denyButton, confirmButton);
      } else {
        actions.insertBefore(cancelButton, loader);
        actions.insertBefore(denyButton, loader);
        actions.insertBefore(confirmButton, loader);
      }
    }
  }

  /**
   * @param {HTMLElement} confirmButton
   * @param {HTMLElement} denyButton
   * @param {HTMLElement} cancelButton
   * @param {SweetAlertOptions} params
   */
  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    if (!params.buttonsStyling) {
      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
      return;
    }
    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);

    // Buttons background colors
    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
      addClass(confirmButton, swalClasses['default-outline']);
    }
    if (params.denyButtonColor) {
      denyButton.style.backgroundColor = params.denyButtonColor;
      addClass(denyButton, swalClasses['default-outline']);
    }
    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
      addClass(cancelButton, swalClasses['default-outline']);
    }
  }

  /**
   * @param {HTMLElement} button
   * @param {'confirm' | 'deny' | 'cancel'} buttonType
   * @param {SweetAlertOptions} params
   */
  function renderButton(button, buttonType, params) {
    const buttonName = /** @type {'Confirm' | 'Deny' | 'Cancel'} */capitalizeFirstLetter(buttonType);
    toggle(button, params[`show${buttonName}Button`], 'inline-block');
    setInnerHtml(button, params[`${buttonType}ButtonText`] || ''); // Set caption text
    button.setAttribute('aria-label', params[`${buttonType}ButtonAriaLabel`] || ''); // ARIA label

    // Add buttons custom classes
    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, `${buttonType}Button`);
  }

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderCloseButton = (instance, params) => {
    const closeButton = getCloseButton();
    if (!closeButton) {
      return;
    }
    setInnerHtml(closeButton, params.closeButtonHtml || '');

    // Custom class
    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel || '');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderContainer = (instance, params) => {
    const container = getContainer();
    if (!container) {
      return;
    }
    handleBackdropParam(container, params.backdrop);
    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow);

    // Custom class
    applyCustomClass(container, params, 'container');
  };

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['backdrop']} backdrop
   */
  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['position']} position
   */
  function handlePositionParam(container, position) {
    if (!position) {
      return;
    }
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['grow']} grow
   */
  function handleGrowParam(container, grow) {
    if (!grow) {
      return;
    }
    addClass(container, swalClasses[`grow-${grow}`]);
  }

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateProps = {
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  /// <reference path="../../../../sweetalert2.d.ts"/>


  /** @type {InputClass[]} */
  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderInput = (instance, params) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const innerParams = privateProps.innerParams.get(instance);
    const rerender = !innerParams || params.input !== innerParams.input;
    inputClasses.forEach(inputClass => {
      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
      if (!inputContainer) {
        return;
      }

      // set attributes
      setAttributes(inputClass, params.inputAttributes);

      // set class
      inputContainer.className = swalClasses[inputClass];
      if (rerender) {
        hide(inputContainer);
      }
    });
    if (params.input) {
      if (rerender) {
        showInput(params);
      }
      // set custom class
      setCustomClass(params);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const showInput = params => {
    if (!params.input) {
      return;
    }
    if (!renderInputType[params.input]) {
      error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(' | ')}, got "${params.input}"`);
      return;
    }
    const inputContainer = getInputContainer(params.input);
    if (!inputContainer) {
      return;
    }
    const input = renderInputType[params.input](inputContainer, params);
    show(inputContainer);

    // input autofocus
    if (params.inputAutoFocus) {
      setTimeout(() => {
        focusInput(input);
      });
    }
  };

  /**
   * @param {HTMLInputElement} input
   */
  const removeAttributes = input => {
    for (let i = 0; i < input.attributes.length; i++) {
      const attrName = input.attributes[i].name;
      if (!['id', 'type', 'value', 'style'].includes(attrName)) {
        input.removeAttribute(attrName);
      }
    }
  };

  /**
   * @param {InputClass} inputClass
   * @param {SweetAlertOptions['inputAttributes']} inputAttributes
   */
  const setAttributes = (inputClass, inputAttributes) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const input = getInput$1(popup, inputClass);
    if (!input) {
      return;
    }
    removeAttributes(input);
    for (const attr in inputAttributes) {
      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const setCustomClass = params => {
    if (!params.input) {
      return;
    }
    const inputContainer = getInputContainer(params.input);
    if (inputContainer) {
      applyCustomClass(inputContainer, params, 'input');
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions} params
   */
  const setInputPlaceholder = (input, params) => {
    if (!input.placeholder && params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  /**
   * @param {Input} input
   * @param {Input} prependTo
   * @param {SweetAlertOptions} params
   */
  const setInputLabel = (input, prependTo, params) => {
    if (params.inputLabel) {
      const label = document.createElement('label');
      const labelClass = swalClasses['input-label'];
      label.setAttribute('for', input.id);
      label.className = labelClass;
      if (typeof params.customClass === 'object') {
        addClass(label, params.customClass.inputLabel);
      }
      label.innerText = params.inputLabel;
      prependTo.insertAdjacentElement('beforebegin', label);
    }
  };

  /**
   * @param {SweetAlertInput} inputType
   * @returns {HTMLElement | undefined}
   */
  const getInputContainer = inputType => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    return getDirectChildByClass(popup, swalClasses[(/** @type {SwalClass} */inputType)] || swalClasses.input);
  };

  /**
   * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions['inputValue']} inputValue
   */
  const checkAndSetInputValue = (input, inputValue) => {
    if (['string', 'number'].includes(typeof inputValue)) {
      input.value = `${inputValue}`;
    } else if (!isPromise(inputValue)) {
      warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
    }
  };

  /** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
  const renderInputType = {};

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType['datetime-local'] = renderInputType.time = renderInputType.week = renderInputType.month = /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
  (input, params) => {
    checkAndSetInputValue(input, params.inputValue);
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.file = (input, params) => {
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    return input;
  };

  /**
   * @param {HTMLInputElement} range
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.range = (range, params) => {
    const rangeInput = range.querySelector('input');
    const rangeOutput = range.querySelector('output');
    checkAndSetInputValue(rangeInput, params.inputValue);
    rangeInput.type = params.input;
    checkAndSetInputValue(rangeOutput, params.inputValue);
    setInputLabel(rangeInput, range, params);
    return range;
  };

  /**
   * @param {HTMLSelectElement} select
   * @param {SweetAlertOptions} params
   * @returns {HTMLSelectElement}
   */
  renderInputType.select = (select, params) => {
    select.textContent = '';
    if (params.inputPlaceholder) {
      const placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }
    setInputLabel(select, select, params);
    return select;
  };

  /**
   * @param {HTMLInputElement} radio
   * @returns {HTMLInputElement}
   */
  renderInputType.radio = radio => {
    radio.textContent = '';
    return radio;
  };

  /**
   * @param {HTMLLabelElement} checkboxContainer
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.checkbox = (checkboxContainer, params) => {
    const checkbox = getInput$1(getPopup(), 'checkbox');
    checkbox.value = '1';
    checkbox.checked = Boolean(params.inputValue);
    const label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder || params.inputLabel);
    return checkbox;
  };

  /**
   * @param {HTMLTextAreaElement} textarea
   * @param {SweetAlertOptions} params
   * @returns {HTMLTextAreaElement}
   */
  renderInputType.textarea = (textarea, params) => {
    checkAndSetInputValue(textarea, params.inputValue);
    setInputPlaceholder(textarea, params);
    setInputLabel(textarea, textarea, params);

    /**
     * @param {HTMLElement} el
     * @returns {number}
     */
    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

    // https://github.com/sweetalert2/sweetalert2/issues/2291
    setTimeout(() => {
      // https://github.com/sweetalert2/sweetalert2/issues/1699
      if ('MutationObserver' in window) {
        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
        const textareaResizeHandler = () => {
          // check if texarea is still in document (i.e. popup wasn't closed in the meantime)
          if (!document.body.contains(textarea)) {
            return;
          }
          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
          if (textareaWidth > initialPopupWidth) {
            getPopup().style.width = `${textareaWidth}px`;
          } else {
            applyNumericalStyle(getPopup(), 'width', params.width);
          }
        };
        new MutationObserver(textareaResizeHandler).observe(textarea, {
          attributes: true,
          attributeFilter: ['style']
        });
      }
    });
    return textarea;
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderContent = (instance, params) => {
    const htmlContainer = getHtmlContainer();
    if (!htmlContainer) {
      return;
    }
    showWhenInnerHtmlPresent(htmlContainer);
    applyCustomClass(htmlContainer, params, 'htmlContainer');

    // Content as HTML
    if (params.html) {
      parseHtmlToContainer(params.html, htmlContainer);
      show(htmlContainer, 'block');
    }

    // Content as plain text
    else if (params.text) {
      htmlContainer.textContent = params.text;
      show(htmlContainer, 'block');
    }

    // No content
    else {
      hide(htmlContainer);
    }
    renderInput(instance, params);
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderFooter = (instance, params) => {
    const footer = getFooter();
    if (!footer) {
      return;
    }
    showWhenInnerHtmlPresent(footer);
    toggle(footer, params.footer, 'block');
    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    }

    // Custom class
    applyCustomClass(footer, params, 'footer');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderIcon = (instance, params) => {
    const innerParams = privateProps.innerParams.get(instance);
    const icon = getIcon();
    if (!icon) {
      return;
    }

    // if the given icon already rendered, apply the styling without re-rendering the icon
    if (innerParams && params.icon === innerParams.icon) {
      // Custom or default content
      setContent(icon, params);
      applyStyles(icon, params);
      return;
    }
    if (!params.icon && !params.iconHtml) {
      hide(icon);
      return;
    }
    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
      error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
      hide(icon);
      return;
    }
    show(icon);

    // Custom or default content
    setContent(icon, params);
    applyStyles(icon, params);

    // Animate icon
    addClass(icon, params.showClass && params.showClass.icon);

    // Re-adjust the success icon on system theme change
    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQueryList.addEventListener('change', adjustSuccessIconBackgroundColor);
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const applyStyles = (icon, params) => {
    for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
      if (params.icon !== iconType) {
        removeClass(icon, iconClassName);
      }
    }
    addClass(icon, params.icon && iconTypes[params.icon]);

    // Icon color
    setColor(icon, params);

    // Success icon background color
    adjustSuccessIconBackgroundColor();

    // Custom class
    applyCustomClass(icon, params, 'icon');
  };

  // Adjust success icon background color to match the popup background color
  const adjustSuccessIconBackgroundColor = () => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    /** @type {NodeListOf<HTMLElement>} */
    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
    for (let i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };
  const successIconHtml = `
  <div class="swal2-success-circular-line-left"></div>
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
  <div class="swal2-success-circular-line-right"></div>
`;
  const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setContent = (icon, params) => {
    if (!params.icon && !params.iconHtml) {
      return;
    }
    let oldContent = icon.innerHTML;
    let newContent = '';
    if (params.iconHtml) {
      newContent = iconContent(params.iconHtml);
    } else if (params.icon === 'success') {
      newContent = successIconHtml;
      oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
    } else if (params.icon === 'error') {
      newContent = errorIconHtml;
    } else if (params.icon) {
      const defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      newContent = iconContent(defaultIconHtml[params.icon]);
    }
    if (oldContent.trim() !== newContent.trim()) {
      setInnerHtml(icon, newContent);
    }
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setColor = (icon, params) => {
    if (!params.iconColor) {
      return;
    }
    icon.style.color = params.iconColor;
    icon.style.borderColor = params.iconColor;
    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
      setStyle(icon, sel, 'background-color', params.iconColor);
    }
    setStyle(icon, '.swal2-success-ring', 'border-color', params.iconColor);
  };

  /**
   * @param {string} content
   * @returns {string}
   */
  const iconContent = content => `<div class="${swalClasses['icon-content']}">${content}</div>`;

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderImage = (instance, params) => {
    const image = getImage();
    if (!image) {
      return;
    }
    if (!params.imageUrl) {
      hide(image);
      return;
    }
    show(image, '');

    // Src, alt
    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt || '');

    // Width, height
    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight);

    // Class
    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  let dragging = false;
  let mousedownX = 0;
  let mousedownY = 0;
  let initialX = 0;
  let initialY = 0;

  /**
   * @param {HTMLElement} popup
   */
  const addDraggableListeners = popup => {
    popup.addEventListener('mousedown', down);
    document.body.addEventListener('mousemove', move);
    popup.addEventListener('mouseup', up);
    popup.addEventListener('touchstart', down);
    document.body.addEventListener('touchmove', move);
    popup.addEventListener('touchend', up);
  };

  /**
   * @param {HTMLElement} popup
   */
  const removeDraggableListeners = popup => {
    popup.removeEventListener('mousedown', down);
    document.body.removeEventListener('mousemove', move);
    popup.removeEventListener('mouseup', up);
    popup.removeEventListener('touchstart', down);
    document.body.removeEventListener('touchmove', move);
    popup.removeEventListener('touchend', up);
  };

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  const down = event => {
    const popup = getPopup();
    if (event.target === popup || getIcon().contains(/** @type {HTMLElement} */event.target)) {
      dragging = true;
      const clientXY = getClientXY(event);
      mousedownX = clientXY.clientX;
      mousedownY = clientXY.clientY;
      initialX = parseInt(popup.style.insetInlineStart) || 0;
      initialY = parseInt(popup.style.insetBlockStart) || 0;
      addClass(popup, 'swal2-dragging');
    }
  };

  /**
   * @param {MouseEvent | TouchEvent} event
   */
  const move = event => {
    const popup = getPopup();
    if (dragging) {
      let {
        clientX,
        clientY
      } = getClientXY(event);
      popup.style.insetInlineStart = `${initialX + (clientX - mousedownX)}px`;
      popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
    }
  };
  const up = () => {
    const popup = getPopup();
    dragging = false;
    removeClass(popup, 'swal2-dragging');
  };

  /**
   * @param {MouseEvent | TouchEvent} event
   * @returns {{ clientX: number, clientY: number }}
   */
  const getClientXY = event => {
    let clientX = 0,
      clientY = 0;
    if (event.type.startsWith('mouse')) {
      clientX = /** @type {MouseEvent} */event.clientX;
      clientY = /** @type {MouseEvent} */event.clientY;
    } else if (event.type.startsWith('touch')) {
      clientX = /** @type {TouchEvent} */event.touches[0].clientX;
      clientY = /** @type {TouchEvent} */event.touches[0].clientY;
    }
    return {
      clientX,
      clientY
    };
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderPopup = (instance, params) => {
    const container = getContainer();
    const popup = getPopup();
    if (!container || !popup) {
      return;
    }

    // Width
    // https://github.com/sweetalert2/sweetalert2/issues/2170
    if (params.toast) {
      applyNumericalStyle(container, 'width', params.width);
      popup.style.width = '100%';
      const loader = getLoader();
      if (loader) {
        popup.insertBefore(loader, getIcon());
      }
    } else {
      applyNumericalStyle(popup, 'width', params.width);
    }

    // Padding
    applyNumericalStyle(popup, 'padding', params.padding);

    // Color
    if (params.color) {
      popup.style.color = params.color;
    }

    // Background
    if (params.background) {
      popup.style.background = params.background;
    }
    hide(getValidationMessage());

    // Classes
    addClasses$1(popup, params);
    if (params.draggable && !params.toast) {
      addClass(popup, swalClasses.draggable);
      addDraggableListeners(popup);
    } else {
      removeClass(popup, swalClasses.draggable);
      removeDraggableListeners(popup);
    }
  };

  /**
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses$1 = (popup, params) => {
    const showClass = params.showClass || {};
    // Default Class + showClass when updating Swal.update({})
    popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ''}`;
    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    }

    // Custom class
    applyCustomClass(popup, params, 'popup');
    // TODO: remove in the next major
    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    }

    // Icon class (#1842)
    if (params.icon) {
      addClass(popup, swalClasses[`icon-${params.icon}`]);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderProgressSteps = (instance, params) => {
    const progressStepsContainer = getProgressSteps();
    if (!progressStepsContainer) {
      return;
    }
    const {
      progressSteps,
      currentProgressStep
    } = params;
    if (!progressSteps || progressSteps.length === 0 || currentProgressStep === undefined) {
      hide(progressStepsContainer);
      return;
    }
    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    if (currentProgressStep >= progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }
    progressSteps.forEach((step, index) => {
      const stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);
      if (index === currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }
      if (index !== progressSteps.length - 1) {
        const lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  /**
   * @param {string} step
   * @returns {HTMLLIElement}
   */
  const createStepElement = step => {
    const stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  /**
   * @param {SweetAlertOptions} params
   * @returns {HTMLLIElement}
   */
  const createLineElement = params => {
    const lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);
    if (params.progressStepsDistance) {
      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
    }
    return lineEl;
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderTitle = (instance, params) => {
    const title = getTitle();
    if (!title) {
      return;
    }
    showWhenInnerHtmlPresent(title);
    toggle(title, params.title || params.titleText, 'block');
    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }
    if (params.titleText) {
      title.innerText = params.titleText;
    }

    // Custom class
    applyCustomClass(title, params, 'title');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const render = (instance, params) => {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderProgressSteps(instance, params);
    renderIcon(instance, params);
    renderImage(instance, params);
    renderTitle(instance, params);
    renderCloseButton(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);
    const popup = getPopup();
    if (typeof params.didRender === 'function' && popup) {
      params.didRender(popup);
    }
    globalState.eventEmitter.emit('didRender', popup);
  };

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */
  const isVisible = () => {
    return isVisible$1(getPopup());
  };

  /*
   * Global function to click 'Confirm' button
   */
  const clickConfirm = () => {
    var _dom$getConfirmButton;
    return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
  };

  /*
   * Global function to click 'Deny' button
   */
  const clickDeny = () => {
    var _dom$getDenyButton;
    return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
  };

  /*
   * Global function to click 'Cancel' button
   */
  const clickCancel = () => {
    var _dom$getCancelButton;
    return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
  };

  /** @typedef {'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'} DismissReason */

  /** @type {Record<DismissReason, DismissReason>} */
  const DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  /**
   * @param {GlobalState} globalState
   */
  const removeKeydownHandler = globalState => {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }
  };

  /**
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {*} dismissWith
   */
  const addKeydownHandler = (globalState, innerParams, dismissWith) => {
    removeKeydownHandler(globalState);
    if (!innerParams.toast) {
      globalState.keydownHandler = e => keydownHandler(innerParams, e, dismissWith);
      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  };

  /**
   * @param {number} index
   * @param {number} increment
   */
  const setFocus = (index, increment) => {
    var _dom$getPopup;
    const focusableElements = getFocusableElements();
    // search for visible elements and select the next possible match
    if (focusableElements.length) {
      index = index + increment;

      // rollover to first item
      if (index === focusableElements.length) {
        index = 0;

        // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }
      focusableElements[index].focus();
      return;
    }
    // no visible focusable elements, focus the popup
    (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
  };
  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {KeyboardEvent} event
   * @param {Function} dismissWith
   */
  const keydownHandler = (innerParams, event, dismissWith) => {
    if (!innerParams) {
      return; // This instance has already been destroyed
    }

    // Ignore keydown during IME composition
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    // https://github.com/sweetalert2/sweetalert2/issues/720
    // https://github.com/sweetalert2/sweetalert2/issues/2406
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (innerParams.stopKeydownPropagation) {
      event.stopPropagation();
    }

    // ENTER
    if (event.key === 'Enter') {
      handleEnter(event, innerParams);
    }

    // TAB
    else if (event.key === 'Tab') {
      handleTab(event);
    }

    // ARROWS - switch focus between buttons
    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
      handleArrows(event.key);
    }

    // ESC
    else if (event.key === 'Escape') {
      handleEsc(event, innerParams, dismissWith);
    }
  };

  /**
   * @param {KeyboardEvent} event
   * @param {SweetAlertOptions} innerParams
   */
  const handleEnter = (event, innerParams) => {
    // https://github.com/sweetalert2/sweetalert2/issues/2386
    if (!callIfFunction(innerParams.allowEnterKey)) {
      return;
    }
    const input = getInput$1(getPopup(), innerParams.input);
    if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
      if (['textarea', 'file'].includes(innerParams.input)) {
        return; // do not submit
      }
      clickConfirm();
      event.preventDefault();
    }
  };

  /**
   * @param {KeyboardEvent} event
   */
  const handleTab = event => {
    const targetElement = event.target;
    const focusableElements = getFocusableElements();
    let btnIndex = -1;
    for (let i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    // Cycle to the next button
    if (!event.shiftKey) {
      setFocus(btnIndex, 1);
    }

    // Cycle to the prev button
    else {
      setFocus(btnIndex, -1);
    }
    event.stopPropagation();
    event.preventDefault();
  };

  /**
   * @param {string} key
   */
  const handleArrows = key => {
    const actions = getActions();
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    if (!actions || !confirmButton || !denyButton || !cancelButton) {
      return;
    }
    /** @type HTMLElement[] */
    const buttons = [confirmButton, denyButton, cancelButton];
    if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
      return;
    }
    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
    let buttonToFocus = document.activeElement;
    if (!buttonToFocus) {
      return;
    }
    for (let i = 0; i < actions.children.length; i++) {
      buttonToFocus = buttonToFocus[sibling];
      if (!buttonToFocus) {
        return;
      }
      if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
        break;
      }
    }
    if (buttonToFocus instanceof HTMLButtonElement) {
      buttonToFocus.focus();
    }
  };

  /**
   * @param {KeyboardEvent} event
   * @param {SweetAlertOptions} innerParams
   * @param {Function} dismissWith
   */
  const handleEsc = (event, innerParams, dismissWith) => {
    if (callIfFunction(innerParams.allowEscapeKey)) {
      event.preventDefault();
      dismissWith(DismissReason.esc);
    }
  };

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateMethods = {
    swalPromiseResolve: new WeakMap(),
    swalPromiseReject: new WeakMap()
  };

  // From https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  const setAriaHidden = () => {
    const container = getContainer();
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.contains(container)) {
        return;
      }
      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden') || '');
      }
      el.setAttribute('aria-hidden', 'true');
    });
  };
  const unsetAriaHidden = () => {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden') || '');
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  // @ts-ignore
  const isSafariOrIOS = typeof window !== 'undefined' && !!window.GestureEvent; // true for Safari desktop + all iOS browsers https://stackoverflow.com/a/70585394

  /**
   * Fix iOS scrolling
   * http://stackoverflow.com/q/39626302
   */
  const iOSfix = () => {
    if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
      const offset = document.body.scrollTop;
      document.body.style.top = `${offset * -1}px`;
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
    }
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1246
   */
  const lockBodyScroll = () => {
    const container = getContainer();
    if (!container) {
      return;
    }
    /** @type {boolean} */
    let preventTouchMove;
    /**
     * @param {TouchEvent} event
     */
    container.ontouchstart = event => {
      preventTouchMove = shouldPreventTouchMove(event);
    };
    /**
     * @param {TouchEvent} event
     */
    container.ontouchmove = event => {
      if (preventTouchMove) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  };

  /**
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const shouldPreventTouchMove = event => {
    const target = event.target;
    const container = getContainer();
    const htmlContainer = getHtmlContainer();
    if (!container || !htmlContainer) {
      return false;
    }
    if (isStylus(event) || isZoom(event)) {
      return false;
    }
    if (target === container) {
      return true;
    }
    if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== 'INPUT' &&
    // #1603
    target.tagName !== 'TEXTAREA' &&
    // #2266
    !(isScrollable(htmlContainer) &&
    // #1944
    htmlContainer.contains(target))) {
      return true;
    }
    return false;
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1786
   *
   * @param {*} event
   * @returns {boolean}
   */
  const isStylus = event => {
    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1891
   *
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const isZoom = event => {
    return event.touches && event.touches.length > 1;
  };
  const undoIOSfix = () => {
    if (hasClass(document.body, swalClasses.iosfix)) {
      const offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  /**
   * Measure scrollbar width for padding body during modal show/hide
   * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
   *
   * @returns {number}
   */
  const measureScrollbar = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  /**
   * Remember state in cases where opening and handling a modal will fiddle with it.
   * @type {number | null}
   */
  let previousBodyPadding = null;

  /**
   * @param {string} initialBodyOverflow
   */
  const replaceScrollbarWithPadding = initialBodyOverflow => {
    // for queues, do not do this more than once
    if (previousBodyPadding !== null) {
      return;
    }
    // if the body has overflow
    if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === 'scroll' // https://github.com/sweetalert2/sweetalert2/issues/2663
    ) {
      // add padding so the content doesn't shift after removal of scrollbar
      previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
    }
  };
  const undoReplaceScrollbarWithPadding = () => {
    if (previousBodyPadding !== null) {
      document.body.style.paddingRight = `${previousBodyPadding}px`;
      previousBodyPadding = null;
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} container
   * @param {boolean} returnFocus
   * @param {Function} didClose
   */
  function removePopupAndResetState(instance, container, returnFocus, didClose) {
    if (isToast()) {
      triggerDidCloseAndDispose(instance, didClose);
    } else {
      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
      removeKeydownHandler(globalState);
    }

    // workaround for https://github.com/sweetalert2/sweetalert2/issues/2088
    // for some reason removing the container in Safari will scroll the document to bottom
    if (isSafariOrIOS) {
      container.setAttribute('style', 'display:none !important');
      container.removeAttribute('class');
      container.innerHTML = '';
    } else {
      container.remove();
    }
    if (isModal()) {
      undoReplaceScrollbarWithPadding();
      undoIOSfix();
      unsetAriaHidden();
    }
    removeBodyClasses();
  }

  /**
   * Remove SweetAlert2 classes from body
   */
  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
  }

  /**
   * Instance method to close sweetAlert
   *
   * @param {any} resolveValue
   */
  function close(resolveValue) {
    resolveValue = prepareResolveValue(resolveValue);
    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    const didClose = triggerClosePopup(this);
    if (this.isAwaitingPromise) {
      // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
      if (!resolveValue.isDismissed) {
        handleAwaitingPromise(this);
        swalPromiseResolve(resolveValue);
      }
    } else if (didClose) {
      // Resolve Swal promise
      swalPromiseResolve(resolveValue);
    }
  }
  const triggerClosePopup = instance => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return false;
    }
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    const backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(instance, popup, innerParams);
    return true;
  };

  /**
   * @param {any} error
   */
  function rejectPromise(error) {
    const rejectPromise = privateMethods.swalPromiseReject.get(this);
    handleAwaitingPromise(this);
    if (rejectPromise) {
      // Reject Swal promise
      rejectPromise(error);
    }
  }

  /**
   * @param {SweetAlert} instance
   */
  const handleAwaitingPromise = instance => {
    if (instance.isAwaitingPromise) {
      delete instance.isAwaitingPromise;
      // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335
      if (!privateProps.innerParams.get(instance)) {
        instance._destroy();
      }
    }
  };

  /**
   * @param {any} resolveValue
   * @returns {SweetAlertResult}
   */
  const prepareResolveValue = resolveValue => {
    // When user calls Swal.close()
    if (typeof resolveValue === 'undefined') {
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      };
    }
    return Object.assign({
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    }, resolveValue);
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} innerParams
   */
  const handlePopupAnimation = (instance, popup, innerParams) => {
    var _globalState$eventEmi;
    const container = getContainer();
    // If animation is supported, animate
    const animationIsSupported = hasCssAnimation(popup);
    if (typeof innerParams.willClose === 'function') {
      innerParams.willClose(popup);
    }
    (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit('willClose', popup);
    if (animationIsSupported) {
      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} popup
   * @param {HTMLElement} container
   * @param {boolean} returnFocus
   * @param {Function} didClose
   */
  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
    /**
     * @param {AnimationEvent | TransitionEvent} e
     */
    const swalCloseAnimationFinished = function (e) {
      if (e.target === popup) {
        var _globalState$swalClos;
        (_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
        delete globalState.swalCloseEventFinishedCallback;
        popup.removeEventListener('animationend', swalCloseAnimationFinished);
        popup.removeEventListener('transitionend', swalCloseAnimationFinished);
      }
    };
    popup.addEventListener('animationend', swalCloseAnimationFinished);
    popup.addEventListener('transitionend', swalCloseAnimationFinished);
  };

  /**
   * @param {SweetAlert} instance
   * @param {Function} didClose
   */
  const triggerDidCloseAndDispose = (instance, didClose) => {
    setTimeout(() => {
      var _globalState$eventEmi2;
      if (typeof didClose === 'function') {
        didClose.bind(instance.params)();
      }
      (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit('didClose');
      // instance might have been destroyed already
      if (instance._destroy) {
        instance._destroy();
      }
    });
  };

  /**
   * Shows loader (spinner), this is useful with AJAX requests.
   * By default the loader be shown instead of the "Confirm" button.
   *
   * @param {HTMLButtonElement | null} [buttonToReplace]
   */
  const showLoading = buttonToReplace => {
    let popup = getPopup();
    if (!popup) {
      new Swal();
    }
    popup = getPopup();
    if (!popup) {
      return;
    }
    const loader = getLoader();
    if (isToast()) {
      hide(getIcon());
    } else {
      replaceButton(popup, buttonToReplace);
    }
    show(loader);
    popup.setAttribute('data-loading', 'true');
    popup.setAttribute('aria-busy', 'true');
    popup.focus();
  };

  /**
   * @param {HTMLElement} popup
   * @param {HTMLButtonElement | null} [buttonToReplace]
   */
  const replaceButton = (popup, buttonToReplace) => {
    const actions = getActions();
    const loader = getLoader();
    if (!actions || !loader) {
      return;
    }
    if (!buttonToReplace && isVisible$1(getConfirmButton())) {
      buttonToReplace = getConfirmButton();
    }
    show(actions);
    if (buttonToReplace) {
      hide(buttonToReplace);
      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
      actions.insertBefore(loader, buttonToReplace);
    }
    addClass([popup, actions], swalClasses.loading);
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptionsAndValue = (instance, params) => {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].some(i => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      showLoading(getConfirmButton());
      handleInputValue(instance, params);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} innerParams
   * @returns {SweetAlertInputValue}
   */
  const getInputValue = (instance, innerParams) => {
    const input = instance.getInput();
    if (!input) {
      return null;
    }
    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);
      case 'radio':
        return getRadioValue(input);
      case 'file':
        return getFileValue(input);
      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  /**
   * @param {HTMLInputElement} input
   * @returns {number}
   */
  const getCheckboxValue = input => input.checked ? 1 : 0;

  /**
   * @param {HTMLInputElement} input
   * @returns {string | null}
   */
  const getRadioValue = input => input.checked ? input.value : null;

  /**
   * @param {HTMLInputElement} input
   * @returns {FileList | File | null}
   */
  const getFileValue = input => input.files && input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptions = (instance, params) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    /**
     * @param {Record<string, any>} inputOptions
     */
    const processInputOptions = inputOptions => {
      if (params.input === 'select') {
        populateSelectOptions(popup, formatInputOptions(inputOptions), params);
      } else if (params.input === 'radio') {
        populateRadioOptions(popup, formatInputOptions(inputOptions), params);
      }
    };
    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading(getConfirmButton());
      asPromise(params.inputOptions).then(inputOptions => {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (typeof params.inputOptions === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputValue = (instance, params) => {
    const input = instance.getInput();
    if (!input) {
      return;
    }
    hide(input);
    asPromise(params.inputValue).then(inputValue => {
      input.value = params.input === 'number' ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
      show(input);
      input.focus();
      instance.hideLoading();
    }).catch(err => {
      error(`Error in inputValue promise: ${err}`);
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };

  /**
   * @param {HTMLElement} popup
   * @param {InputOptionFlattened[]} inputOptions
   * @param {SweetAlertOptions} params
   */
  function populateSelectOptions(popup, inputOptions, params) {
    const select = getDirectChildByClass(popup, swalClasses.select);
    if (!select) {
      return;
    }
    /**
     * @param {HTMLElement} parent
     * @param {string} optionLabel
     * @param {string} optionValue
     */
    const renderOption = (parent, optionLabel, optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      setInnerHtml(option, optionLabel);
      option.selected = isSelected(optionValue, params.inputValue);
      parent.appendChild(option);
    };
    inputOptions.forEach(inputOption => {
      const optionValue = inputOption[0];
      const optionLabel = inputOption[1];
      // <optgroup> spec:
      // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
      // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
      // check whether this is a <optgroup>
      if (Array.isArray(optionLabel)) {
        // if it is an array, then it is an <optgroup>
        const optgroup = document.createElement('optgroup');
        optgroup.label = optionValue;
        optgroup.disabled = false; // not configurable for now
        select.appendChild(optgroup);
        optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
      } else {
        // case of <option>
        renderOption(select, optionLabel, optionValue);
      }
    });
    select.focus();
  }

  /**
   * @param {HTMLElement} popup
   * @param {InputOptionFlattened[]} inputOptions
   * @param {SweetAlertOptions} params
   */
  function populateRadioOptions(popup, inputOptions, params) {
    const radio = getDirectChildByClass(popup, swalClasses.radio);
    if (!radio) {
      return;
    }
    inputOptions.forEach(inputOption => {
      const radioValue = inputOption[0];
      const radioLabel = inputOption[1];
      const radioInput = document.createElement('input');
      const radioLabelElement = document.createElement('label');
      radioInput.type = 'radio';
      radioInput.name = swalClasses.radio;
      radioInput.value = radioValue;
      if (isSelected(radioValue, params.inputValue)) {
        radioInput.checked = true;
      }
      const label = document.createElement('span');
      setInnerHtml(label, radioLabel);
      label.className = swalClasses.label;
      radioLabelElement.appendChild(radioInput);
      radioLabelElement.appendChild(label);
      radio.appendChild(radioLabelElement);
    });
    const radios = radio.querySelectorAll('input');
    if (radios.length) {
      radios[0].focus();
    }
  }

  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   *
   * @param {Record<string, any>} inputOptions
   * @typedef {string[]} InputOptionFlattened
   * @returns {InputOptionFlattened[]}
   */
  const formatInputOptions = inputOptions => {
    /** @type {InputOptionFlattened[]} */
    const result = [];
    if (inputOptions instanceof Map) {
      inputOptions.forEach((value, key) => {
        let valueFormatted = value;
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(key => {
        let valueFormatted = inputOptions[key];
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    }
    return result;
  };

  /**
   * @param {string} optionValue
   * @param {SweetAlertInputValue} inputValue
   * @returns {boolean}
   */
  const isSelected = (optionValue, inputValue) => {
    return !!inputValue && inputValue.toString() === optionValue.toString();
  };

  /**
   * @param {SweetAlert} instance
   */
  const handleConfirmButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.input) {
      handleConfirmOrDenyWithInput(instance, 'confirm');
    } else {
      confirm(instance, true);
    }
  };

  /**
   * @param {SweetAlert} instance
   */
  const handleDenyButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.returnInputValueOnDeny) {
      handleConfirmOrDenyWithInput(instance, 'deny');
    } else {
      deny(instance, false);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {Function} dismissWith
   */
  const handleCancelButtonClick = (instance, dismissWith) => {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  /**
   * @param {SweetAlert} instance
   * @param {'confirm' | 'deny'} type
   */
  const handleConfirmOrDenyWithInput = (instance, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams.input) {
      error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
      return;
    }
    const input = instance.getInput();
    const inputValue = getInputValue(instance, innerParams);
    if (innerParams.inputValidator) {
      handleInputValidator(instance, inputValue, type);
    } else if (input && !input.checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
    } else if (type === 'deny') {
      deny(instance, inputValue);
    } else {
      confirm(instance, inputValue);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertInputValue} inputValue
   * @param {'confirm' | 'deny'} type
   */
  const handleInputValidator = (instance, inputValue, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableInput();
    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
    validationPromise.then(validationMessage => {
      instance.enableButtons();
      instance.enableInput();
      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else if (type === 'deny') {
        deny(instance, inputValue);
      } else {
        confirm(instance, inputValue);
      }
    });
  };

  /**
   * @param {SweetAlert} instance
   * @param {any} value
   */
  const deny = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnDeny) {
      showLoading(getDenyButton());
    }
    if (innerParams.preDeny) {
      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
      preDenyPromise.then(preDenyValue => {
        if (preDenyValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          instance.close({
            isDenied: true,
            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
          });
        }
      }).catch(error => rejectWith(instance || undefined, error));
    } else {
      instance.close({
        isDenied: true,
        value
      });
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {any} value
   */
  const succeedWith = (instance, value) => {
    instance.close({
      isConfirmed: true,
      value
    });
  };

  /**
   *
   * @param {SweetAlert} instance
   * @param {string} error
   */
  const rejectWith = (instance, error) => {
    instance.rejectPromise(error);
  };

  /**
   *
   * @param {SweetAlert} instance
   * @param {any} value
   */
  const confirm = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnConfirm) {
      showLoading();
    }
    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
      preConfirmPromise.then(preConfirmValue => {
        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      }).catch(error => rejectWith(instance || undefined, error));
    } else {
      succeedWith(instance, value);
    }
  };

  /**
   * Hides loader and shows back the button which was hidden by .showLoading()
   */
  function hideLoading() {
    // do nothing if popup is closed
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      return;
    }
    const domCache = privateProps.domCache.get(this);
    hide(domCache.loader);
    if (isToast()) {
      if (innerParams.icon) {
        show(getIcon());
      }
    } else {
      showRelatedButton(domCache);
    }
    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.denyButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }
  const showRelatedButton = domCache => {
    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
    if (buttonToReplace.length) {
      show(buttonToReplace[0], 'inline-block');
    } else if (allButtonsAreHidden()) {
      hide(domCache.actions);
    }
  };

  /**
   * Gets the input DOM node, this method works with input parameter.
   *
   * @returns {HTMLInputElement | null}
   */
  function getInput() {
    const innerParams = privateProps.innerParams.get(this);
    const domCache = privateProps.domCache.get(this);
    if (!domCache) {
      return null;
    }
    return getInput$1(domCache.popup, innerParams.input);
  }

  /**
   * @param {SweetAlert} instance
   * @param {string[]} buttons
   * @param {boolean} disabled
   */
  function setButtonsDisabled(instance, buttons, disabled) {
    const domCache = privateProps.domCache.get(instance);
    buttons.forEach(button => {
      domCache[button].disabled = disabled;
    });
  }

  /**
   * @param {HTMLInputElement | null} input
   * @param {boolean} disabled
   */
  function setInputDisabled(input, disabled) {
    const popup = getPopup();
    if (!popup || !input) {
      return;
    }
    if (input.type === 'radio') {
      /** @type {NodeListOf<HTMLInputElement>} */
      const radios = popup.querySelectorAll(`[name="${swalClasses.radio}"]`);
      for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }

  /**
   * Enable all the buttons
   * @this {SweetAlert}
   */
  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
  }

  /**
   * Disable all the buttons
   * @this {SweetAlert}
   */
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
  }

  /**
   * Enable the input field
   * @this {SweetAlert}
   */
  function enableInput() {
    setInputDisabled(this.getInput(), false);
  }

  /**
   * Disable the input field
   * @this {SweetAlert}
   */
  function disableInput() {
    setInputDisabled(this.getInput(), true);
  }

  /**
   * Show block with validation message
   *
   * @param {string} error
   * @this {SweetAlert}
   */
  function showValidationMessage(error) {
    const domCache = privateProps.domCache.get(this);
    const params = privateProps.innerParams.get(this);
    setInnerHtml(domCache.validationMessage, error);
    domCache.validationMessage.className = swalClasses['validation-message'];
    if (params.customClass && params.customClass.validationMessage) {
      addClass(domCache.validationMessage, params.customClass.validationMessage);
    }
    show(domCache.validationMessage);
    const input = this.getInput();
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  }

  /**
   * Hide block with validation message
   *
   * @this {SweetAlert}
   */
  function resetValidationMessage() {
    const domCache = privateProps.domCache.get(this);
    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }
    const input = this.getInput();
    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      removeClass(input, swalClasses.inputerror);
    }
  }

  const defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconColor: undefined,
    iconHtml: undefined,
    template: undefined,
    toast: false,
    draggable: false,
    animation: true,
    theme: 'light',
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: {},
    target: 'body',
    color: undefined,
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    preConfirm: undefined,
    preDeny: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    denyButtonText: 'No',
    denyButtonAriaLabel: '',
    denyButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusDeny: false,
    focusCancel: false,
    returnFocus: true,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    loaderHtml: '',
    showLoaderOnConfirm: false,
    showLoaderOnDeny: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputLabel: '',
    inputValue: '',
    inputOptions: {},
    inputAutoFocus: true,
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    returnInputValueOnDeny: false,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    willOpen: undefined,
    didOpen: undefined,
    didRender: undefined,
    willClose: undefined,
    didClose: undefined,
    didDestroy: undefined,
    scrollbarPadding: true
  };
  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'draggable', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'theme', 'willClose'];

  /** @type {Record<string, string | undefined>} */
  const deprecatedParams = {
    allowEnterKey: undefined
  };
  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'draggable', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];

  /**
   * Is valid parameter
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isValidParameter = paramName => {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };

  /**
   * Is valid parameter for Swal.update() method
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isUpdatableParameter = paramName => {
    return updatableParams.indexOf(paramName) !== -1;
  };

  /**
   * Is deprecated parameter
   *
   * @param {string} paramName
   * @returns {string | undefined}
   */
  const isDeprecatedParameter = paramName => {
    return deprecatedParams[paramName];
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsValid = param => {
    if (!isValidParameter(param)) {
      warn(`Unknown parameter "${param}"`);
    }
  };

  /**
   * @param {string} param
   */
  const checkIfToastParamIsValid = param => {
    if (toastIncompatibleParams.includes(param)) {
      warn(`The parameter "${param}" is incompatible with toasts`);
    }
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsDeprecated = param => {
    const isDeprecated = isDeprecatedParameter(param);
    if (isDeprecated) {
      warnAboutDeprecation(param, isDeprecated);
    }
  };

  /**
   * Show relevant warnings for given params
   *
   * @param {SweetAlertOptions} params
   */
  const showWarningsForParams = params => {
    if (params.backdrop === false && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }
    if (params.theme && !['light', 'dark', 'auto', 'borderless'].includes(params.theme)) {
      warn(`Invalid theme "${params.theme}". Expected "light", "dark", "auto", or "borderless"`);
    }
    for (const param in params) {
      checkIfParamIsValid(param);
      if (params.toast) {
        checkIfToastParamIsValid(param);
      }
      checkIfParamIsDeprecated(param);
    }
  };

  /**
   * Updates popup parameters.
   *
   * @param {SweetAlertOptions} params
   */
  function update(params) {
    const container = getContainer();
    const popup = getPopup();
    const innerParams = privateProps.innerParams.get(this);
    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
      return;
    }
    const validUpdatableParams = filterValidParams(params);
    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
    showWarningsForParams(updatedParams);
    container.dataset['swal2Theme'] = updatedParams.theme;
    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: Object.assign({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const filterValidParams = params => {
    const validUpdatableParams = {};
    Object.keys(params).forEach(param => {
      if (isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn(`Invalid parameter to update: ${param}`);
      }
    });
    return validUpdatableParams;
  };

  /**
   * Dispose the current SweetAlert2 instance
   */
  function _destroy() {
    const domCache = privateProps.domCache.get(this);
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
      return; // This instance has already been destroyed
    }

    // Check if there is another Swal closing
    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    }
    if (typeof innerParams.didDestroy === 'function') {
      innerParams.didDestroy();
    }
    globalState.eventEmitter.emit('didDestroy');
    disposeSwal(this);
  }

  /**
   * @param {SweetAlert} instance
   */
  const disposeSwal = instance => {
    disposeWeakMaps(instance);
    // Unset this.params so GC will dispose it (#1569)
    delete instance.params;
    // Unset globalState props so GC will dispose globalState (#1569)
    delete globalState.keydownHandler;
    delete globalState.keydownTarget;
    // Unset currentInstance
    delete globalState.currentInstance;
  };

  /**
   * @param {SweetAlert} instance
   */
  const disposeWeakMaps = instance => {
    // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
    if (instance.isAwaitingPromise) {
      unsetWeakMaps(privateProps, instance);
      instance.isAwaitingPromise = true;
    } else {
      unsetWeakMaps(privateMethods, instance);
      unsetWeakMaps(privateProps, instance);
      delete instance.isAwaitingPromise;
      // Unset instance methods
      delete instance.disableButtons;
      delete instance.enableButtons;
      delete instance.getInput;
      delete instance.disableInput;
      delete instance.enableInput;
      delete instance.hideLoading;
      delete instance.disableLoading;
      delete instance.showValidationMessage;
      delete instance.resetValidationMessage;
      delete instance.close;
      delete instance.closePopup;
      delete instance.closeModal;
      delete instance.closeToast;
      delete instance.rejectPromise;
      delete instance.update;
      delete instance._destroy;
    }
  };

  /**
   * @param {object} obj
   * @param {SweetAlert} instance
   */
  const unsetWeakMaps = (obj, instance) => {
    for (const i in obj) {
      obj[i].delete(instance);
    }
  };

  var instanceMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _destroy: _destroy,
    close: close,
    closeModal: close,
    closePopup: close,
    closeToast: close,
    disableButtons: disableButtons,
    disableInput: disableInput,
    disableLoading: hideLoading,
    enableButtons: enableButtons,
    enableInput: enableInput,
    getInput: getInput,
    handleAwaitingPromise: handleAwaitingPromise,
    hideLoading: hideLoading,
    rejectPromise: rejectPromise,
    resetValidationMessage: resetValidationMessage,
    showValidationMessage: showValidationMessage,
    update: update
  });

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {DomCache} domCache
   * @param {Function} dismissWith
   */
  const handlePopupClick = (innerParams, domCache, dismissWith) => {
    if (innerParams.toast) {
      handleToastClick(innerParams, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache);

      // Ignore click events that had mousedown on the container but mouseup on the popup
      handleContainerMousedown(domCache);
      handleModalClick(innerParams, domCache, dismissWith);
    }
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {DomCache} domCache
   * @param {Function} dismissWith
   */
  const handleToastClick = (innerParams, domCache, dismissWith) => {
    // Closing toast by internal click
    domCache.popup.onclick = () => {
      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
        return;
      }
      dismissWith(DismissReason.close);
    };
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @returns {boolean}
   */
  const isAnyButtonShown = innerParams => {
    return !!(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
  };
  let ignoreOutsideClick = false;

  /**
   * @param {DomCache} domCache
   */
  const handleModalMousedown = domCache => {
    domCache.popup.onmousedown = () => {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = () => {};
        // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup
        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  /**
   * @param {DomCache} domCache
   */
  const handleContainerMousedown = domCache => {
    domCache.container.onmousedown = e => {
      // prevent the modal text from being selected on double click on the container (allowOutsideClick: false)
      if (e.target === domCache.container) {
        e.preventDefault();
      }
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = () => {};
        // We also need to check if the mouseup target is a child of the popup
        if (e.target === domCache.popup || e.target instanceof HTMLElement && domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  /**
   * @param {SweetAlertOptions} innerParams
   * @param {DomCache} domCache
   * @param {Function} dismissWith
   */
  const handleModalClick = (innerParams, domCache, dismissWith) => {
    domCache.container.onclick = e => {
      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }
      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
  const argsToParams = args => {
    const params = {};
    if (typeof args[0] === 'object' && !isElement(args[0])) {
      Object.assign(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach((name, index) => {
        const arg = args[index];
        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
        }
      });
    }
    return params;
  };

  /**
   * Main method to create a new SweetAlert2 popup
   *
   * @param  {...SweetAlertOptions} args
   * @returns {Promise<SweetAlertResult>}
   */
  function fire() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return new this(...args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlert}
   */
  function mixin(mixinParams) {
    class MixinSwal extends this {
      _main(params, priorityMixinParams) {
        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
      }
    }
    // @ts-ignore
    return MixinSwal;
  }

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   *
   * @returns {number | undefined}
   */
  const getTimerLeft = () => {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };

  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const stopTimer = () => {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const resumeTimer = () => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const toggleTimer = () => {
    const timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };

  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @param {number} ms
   * @returns {number | undefined}
   */
  const increaseTimer = ms => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.increase(ms);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };

  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   *
   * @returns {boolean}
   */
  const isTimerRunning = () => {
    return !!(globalState.timeout && globalState.timeout.isRunning());
  };

  let bodyClickListenerAdded = false;
  const clickHandlers = {};

  /**
   * @param {string} attr
   */
  function bindClickHandler() {
    let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
    clickHandlers[attr] = this;
    if (!bodyClickListenerAdded) {
      document.body.addEventListener('click', bodyClickListener);
      bodyClickListenerAdded = true;
    }
  }
  const bodyClickListener = event => {
    for (let el = event.target; el && el !== document; el = el.parentNode) {
      for (const attr in clickHandlers) {
        const template = el.getAttribute(attr);
        if (template) {
          clickHandlers[attr].fire({
            template
          });
          return;
        }
      }
    }
  };

  // Source: https://gist.github.com/mudge/5830382?permalink_comment_id=2691957#gistcomment-2691957

  class EventEmitter {
    constructor() {
      /** @type {Events} */
      this.events = {};
    }

    /**
     * @param {string} eventName
     * @returns {EventHandlers}
     */
    _getHandlersByEventName(eventName) {
      if (typeof this.events[eventName] === 'undefined') {
        // not Set because we need to keep the FIFO order
        // https://github.com/sweetalert2/sweetalert2/pull/2763#discussion_r1748990334
        this.events[eventName] = [];
      }
      return this.events[eventName];
    }

    /**
     * @param {string} eventName
     * @param {EventHandler} eventHandler
     */
    on(eventName, eventHandler) {
      const currentHandlers = this._getHandlersByEventName(eventName);
      if (!currentHandlers.includes(eventHandler)) {
        currentHandlers.push(eventHandler);
      }
    }

    /**
     * @param {string} eventName
     * @param {EventHandler} eventHandler
     */
    once(eventName, eventHandler) {
      var _this = this;
      /**
       * @param {Array} args
       */
      const onceFn = function () {
        _this.removeListener(eventName, onceFn);
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        eventHandler.apply(_this, args);
      };
      this.on(eventName, onceFn);
    }

    /**
     * @param {string} eventName
     * @param {Array} args
     */
    emit(eventName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      this._getHandlersByEventName(eventName).forEach(
      /**
       * @param {EventHandler} eventHandler
       */
      eventHandler => {
        try {
          eventHandler.apply(this, args);
        } catch (error) {
          console.error(error);
        }
      });
    }

    /**
     * @param {string} eventName
     * @param {EventHandler} eventHandler
     */
    removeListener(eventName, eventHandler) {
      const currentHandlers = this._getHandlersByEventName(eventName);
      const index = currentHandlers.indexOf(eventHandler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
      }
    }

    /**
     * @param {string} eventName
     */
    removeAllListeners(eventName) {
      if (this.events[eventName] !== undefined) {
        // https://github.com/sweetalert2/sweetalert2/pull/2763#discussion_r1749239222
        this.events[eventName].length = 0;
      }
    }
    reset() {
      this.events = {};
    }
  }

  globalState.eventEmitter = new EventEmitter();

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  const on = (eventName, eventHandler) => {
    globalState.eventEmitter.on(eventName, eventHandler);
  };

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  const once = (eventName, eventHandler) => {
    globalState.eventEmitter.once(eventName, eventHandler);
  };

  /**
   * @param {string} [eventName]
   * @param {EventHandler} [eventHandler]
   */
  const off = (eventName, eventHandler) => {
    // Remove all handlers for all events
    if (!eventName) {
      globalState.eventEmitter.reset();
      return;
    }
    if (eventHandler) {
      // Remove a specific handler
      globalState.eventEmitter.removeListener(eventName, eventHandler);
    } else {
      // Remove all handlers for a specific event
      globalState.eventEmitter.removeAllListeners(eventName);
    }
  };

  var staticMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    argsToParams: argsToParams,
    bindClickHandler: bindClickHandler,
    clickCancel: clickCancel,
    clickConfirm: clickConfirm,
    clickDeny: clickDeny,
    enableLoading: showLoading,
    fire: fire,
    getActions: getActions,
    getCancelButton: getCancelButton,
    getCloseButton: getCloseButton,
    getConfirmButton: getConfirmButton,
    getContainer: getContainer,
    getDenyButton: getDenyButton,
    getFocusableElements: getFocusableElements,
    getFooter: getFooter,
    getHtmlContainer: getHtmlContainer,
    getIcon: getIcon,
    getIconContent: getIconContent,
    getImage: getImage,
    getInputLabel: getInputLabel,
    getLoader: getLoader,
    getPopup: getPopup,
    getProgressSteps: getProgressSteps,
    getTimerLeft: getTimerLeft,
    getTimerProgressBar: getTimerProgressBar,
    getTitle: getTitle,
    getValidationMessage: getValidationMessage,
    increaseTimer: increaseTimer,
    isDeprecatedParameter: isDeprecatedParameter,
    isLoading: isLoading,
    isTimerRunning: isTimerRunning,
    isUpdatableParameter: isUpdatableParameter,
    isValidParameter: isValidParameter,
    isVisible: isVisible,
    mixin: mixin,
    off: off,
    on: on,
    once: once,
    resumeTimer: resumeTimer,
    showLoading: showLoading,
    stopTimer: stopTimer,
    toggleTimer: toggleTimer
  });

  class Timer {
    /**
     * @param {Function} callback
     * @param {number} delay
     */
    constructor(callback, delay) {
      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }

    /**
     * @returns {number}
     */
    start() {
      if (!this.running) {
        this.running = true;
        this.started = new Date();
        this.id = setTimeout(this.callback, this.remaining);
      }
      return this.remaining;
    }

    /**
     * @returns {number}
     */
    stop() {
      if (this.started && this.running) {
        this.running = false;
        clearTimeout(this.id);
        this.remaining -= new Date().getTime() - this.started.getTime();
      }
      return this.remaining;
    }

    /**
     * @param {number} n
     * @returns {number}
     */
    increase(n) {
      const running = this.running;
      if (running) {
        this.stop();
      }
      this.remaining += n;
      if (running) {
        this.start();
      }
      return this.remaining;
    }

    /**
     * @returns {number}
     */
    getTimerLeft() {
      if (this.running) {
        this.stop();
        this.start();
      }
      return this.remaining;
    }

    /**
     * @returns {boolean}
     */
    isRunning() {
      return this.running;
    }
  }

  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const getTemplateParams = params => {
    const template = typeof params.template === 'string' ? (/** @type {HTMLTemplateElement} */document.querySelector(params.template)) : params.template;
    if (!template) {
      return {};
    }
    /** @type {DocumentFragment} */
    const templateContent = template.content;
    showWarningsForElements(templateContent);
    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, any>}
   */
  const getSwalParams = templateContent => {
    /** @type {Record<string, any>} */
    const result = {};
    /** @type {HTMLElement[]} */
    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
    swalParams.forEach(param => {
      showWarningsForAttributes(param, ['name', 'value']);
      const paramName = /** @type {keyof SweetAlertOptions} */param.getAttribute('name');
      const value = param.getAttribute('value');
      if (!paramName || !value) {
        return;
      }
      if (typeof defaultParams[paramName] === 'boolean') {
        result[paramName] = value !== 'false';
      } else if (typeof defaultParams[paramName] === 'object') {
        result[paramName] = JSON.parse(value);
      } else {
        result[paramName] = value;
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, any>}
   */
  const getSwalFunctionParams = templateContent => {
    /** @type {Record<string, any>} */
    const result = {};
    /** @type {HTMLElement[]} */
    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
    swalFunctions.forEach(param => {
      const paramName = /** @type {keyof SweetAlertOptions} */param.getAttribute('name');
      const value = param.getAttribute('value');
      if (!paramName || !value) {
        return;
      }
      result[paramName] = new Function(`return ${value}`)();
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, any>}
   */
  const getSwalButtons = templateContent => {
    /** @type {Record<string, any>} */
    const result = {};
    /** @type {HTMLElement[]} */
    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
    swalButtons.forEach(button => {
      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
      const type = button.getAttribute('type');
      if (!type || !['confirm', 'cancel', 'deny'].includes(type)) {
        return;
      }
      result[`${type}ButtonText`] = button.innerHTML;
      result[`show${capitalizeFirstLetter(type)}Button`] = true;
      if (button.hasAttribute('color')) {
        result[`${type}ButtonColor`] = button.getAttribute('color');
      }
      if (button.hasAttribute('aria-label')) {
        result[`${type}ButtonAriaLabel`] = button.getAttribute('aria-label');
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Pick<SweetAlertOptions, 'imageUrl' | 'imageWidth' | 'imageHeight' | 'imageAlt'>}
   */
  const getSwalImage = templateContent => {
    const result = {};
    /** @type {HTMLElement | null} */
    const image = templateContent.querySelector('swal-image');
    if (image) {
      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
      if (image.hasAttribute('src')) {
        result.imageUrl = image.getAttribute('src') || undefined;
      }
      if (image.hasAttribute('width')) {
        result.imageWidth = image.getAttribute('width') || undefined;
      }
      if (image.hasAttribute('height')) {
        result.imageHeight = image.getAttribute('height') || undefined;
      }
      if (image.hasAttribute('alt')) {
        result.imageAlt = image.getAttribute('alt') || undefined;
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, any>}
   */
  const getSwalIcon = templateContent => {
    const result = {};
    /** @type {HTMLElement | null} */
    const icon = templateContent.querySelector('swal-icon');
    if (icon) {
      showWarningsForAttributes(icon, ['type', 'color']);
      if (icon.hasAttribute('type')) {
        result.icon = icon.getAttribute('type');
      }
      if (icon.hasAttribute('color')) {
        result.iconColor = icon.getAttribute('color');
      }
      result.iconHtml = icon.innerHTML;
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {Record<string, any>}
   */
  const getSwalInput = templateContent => {
    /** @type {Record<string, any>} */
    const result = {};
    /** @type {HTMLElement | null} */
    const input = templateContent.querySelector('swal-input');
    if (input) {
      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
      result.input = input.getAttribute('type') || 'text';
      if (input.hasAttribute('label')) {
        result.inputLabel = input.getAttribute('label');
      }
      if (input.hasAttribute('placeholder')) {
        result.inputPlaceholder = input.getAttribute('placeholder');
      }
      if (input.hasAttribute('value')) {
        result.inputValue = input.getAttribute('value');
      }
    }
    /** @type {HTMLElement[]} */
    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
    if (inputOptions.length) {
      result.inputOptions = {};
      inputOptions.forEach(option => {
        showWarningsForAttributes(option, ['value']);
        const optionValue = option.getAttribute('value');
        if (!optionValue) {
          return;
        }
        const optionName = option.innerHTML;
        result.inputOptions[optionValue] = optionName;
      });
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @param {string[]} paramNames
   * @returns {Record<string, any>}
   */
  const getSwalStringParams = (templateContent, paramNames) => {
    /** @type {Record<string, any>} */
    const result = {};
    for (const i in paramNames) {
      const paramName = paramNames[i];
      /** @type {HTMLElement | null} */
      const tag = templateContent.querySelector(paramName);
      if (tag) {
        showWarningsForAttributes(tag, []);
        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   */
  const showWarningsForElements = templateContent => {
    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    Array.from(templateContent.children).forEach(el => {
      const tagName = el.tagName.toLowerCase();
      if (!allowedElements.includes(tagName)) {
        warn(`Unrecognized element <${tagName}>`);
      }
    });
  };

  /**
   * @param {HTMLElement} el
   * @param {string[]} allowedAttributes
   */
  const showWarningsForAttributes = (el, allowedAttributes) => {
    Array.from(el.attributes).forEach(attribute => {
      if (allowedAttributes.indexOf(attribute.name) === -1) {
        warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(', ')}` : 'To set the value, use HTML within the element.'}`]);
      }
    });
  };

  const SHOW_CLASS_TIMEOUT = 10;

  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param {SweetAlertOptions} params
   */
  const openPopup = params => {
    const container = getContainer();
    const popup = getPopup();
    if (typeof params.willOpen === 'function') {
      params.willOpen(popup);
    }
    globalState.eventEmitter.emit('willOpen', popup);
    const bodyStyles = window.getComputedStyle(document.body);
    const initialBodyOverflow = bodyStyles.overflowY;
    addClasses(container, popup, params);

    // scrolling is 'hidden' until animation is done, after that 'auto'
    setTimeout(() => {
      setScrollingVisibility(container, popup);
    }, SHOW_CLASS_TIMEOUT);
    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }
    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }
    if (typeof params.didOpen === 'function') {
      setTimeout(() => params.didOpen(popup));
    }
    globalState.eventEmitter.emit('didOpen', popup);
    removeClass(container, swalClasses['no-transition']);
  };

  /**
   * @param {AnimationEvent} event
   */
  const swalOpenAnimationFinished = event => {
    const popup = getPopup();
    if (event.target !== popup) {
      return;
    }
    const container = getContainer();
    popup.removeEventListener('animationend', swalOpenAnimationFinished);
    popup.removeEventListener('transitionend', swalOpenAnimationFinished);
    container.style.overflowY = 'auto';
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   */
  const setScrollingVisibility = (container, popup) => {
    if (hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener('animationend', swalOpenAnimationFinished);
      popup.addEventListener('transitionend', swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  /**
   * @param {HTMLElement} container
   * @param {boolean} scrollbarPadding
   * @param {string} initialBodyOverflow
   */
  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
    iOSfix();
    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      replaceScrollbarWithPadding(initialBodyOverflow);
    }

    // sweetalert2/issues/1247
    setTimeout(() => {
      container.scrollTop = 0;
    });
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses = (container, popup, params) => {
    addClass(container, params.showClass.backdrop);
    if (params.animation) {
      // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
      popup.style.setProperty('opacity', '0', 'important');
      show(popup, 'grid');
      setTimeout(() => {
        // Animate popup right after showing it
        addClass(popup, params.showClass.popup);
        // and remove the opacity workaround
        popup.style.removeProperty('opacity');
      }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062
    } else {
      show(popup, 'grid');
    }
    addClass([document.documentElement, document.body], swalClasses.shown);
    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var defaultInputValidators = {
    /**
     * @param {string} string
     * @param {string} [validationMessage]
     * @returns {Promise<string | void>}
     */
    email: (string, validationMessage) => {
      return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    /**
     * @param {string} string
     * @param {string} [validationMessage]
     * @returns {Promise<string | void>}
     */
    url: (string, validationMessage) => {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (params.inputValidator) {
      return;
    }
    if (params.input === 'email') {
      params.inputValidator = defaultInputValidators['email'];
    }
    if (params.input === 'url') {
      params.inputValidator = defaultInputValidators['url'];
    }
  }

  /**
   * @param {SweetAlertOptions} params
   */
  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }

  /**
   * Set type, text and actions on popup
   *
   * @param {SweetAlertOptions} params
   */
  function setParameters(params) {
    setDefaultInputValidators(params);

    // showLoaderOnConfirm && preConfirm
    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    }
    validateCustomTargetElement(params);

    // Replace newlines with <br> in title
    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }
    init(params);
  }

  /** @type {SweetAlert} */
  let currentInstance;
  var _promise = /*#__PURE__*/new WeakMap();
  class SweetAlert {
    /**
     * @param {...any} args
     * @this {SweetAlert}
     */
    constructor() {
      /**
       * @type {Promise<SweetAlertResult>}
       */
      _classPrivateFieldInitSpec(this, _promise, void 0);
      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      }
      currentInstance = this;

      // @ts-ignore
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const outerParams = Object.freeze(this.constructor.argsToParams(args));

      /** @type {Readonly<SweetAlertOptions>} */
      this.params = outerParams;

      /** @type {boolean} */
      this.isAwaitingPromise = false;
      _classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
    }
    _main(userParams) {
      let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      showWarningsForParams(Object.assign({}, mixinParams, userParams));
      if (globalState.currentInstance) {
        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
        const {
          isAwaitingPromise
        } = globalState.currentInstance;
        globalState.currentInstance._destroy();
        if (!isAwaitingPromise) {
          swalPromiseResolve({
            isDismissed: true
          });
        }
        if (isModal()) {
          unsetAriaHidden();
        }
      }
      globalState.currentInstance = currentInstance;
      const innerParams = prepareParams(userParams, mixinParams);
      setParameters(innerParams);
      Object.freeze(innerParams);

      // clear the previous timer
      if (globalState.timeout) {
        globalState.timeout.stop();
        delete globalState.timeout;
      }

      // clear the restore focus timeout
      clearTimeout(globalState.restoreFocusTimeout);
      const domCache = populateDomCache(currentInstance);
      render(currentInstance, innerParams);
      privateProps.innerParams.set(currentInstance, innerParams);
      return swalPromise(currentInstance, domCache, innerParams);
    }

    // `catch` cannot be the name of a module export, so we define our thenable methods here instead
    then(onFulfilled) {
      return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
    }
    finally(onFinally) {
      return _classPrivateFieldGet2(_promise, this).finally(onFinally);
    }
  }

  /**
   * @param {SweetAlert} instance
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {Promise}
   */
  const swalPromise = (instance, domCache, innerParams) => {
    return new Promise((resolve, reject) => {
      // functions to handle all closings/dismissals
      /**
       * @param {DismissReason} dismiss
       */
      const dismissWith = dismiss => {
        instance.close({
          isDismissed: true,
          dismiss
        });
      };
      privateMethods.swalPromiseResolve.set(instance, resolve);
      privateMethods.swalPromiseReject.set(instance, reject);
      domCache.confirmButton.onclick = () => {
        handleConfirmButtonClick(instance);
      };
      domCache.denyButton.onclick = () => {
        handleDenyButtonClick(instance);
      };
      domCache.cancelButton.onclick = () => {
        handleCancelButtonClick(instance, dismissWith);
      };
      domCache.closeButton.onclick = () => {
        dismissWith(DismissReason.close);
      };
      handlePopupClick(innerParams, domCache, dismissWith);
      addKeydownHandler(globalState, innerParams, dismissWith);
      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams);

      // Scroll container to top on open (#1247, #1946)
      setTimeout(() => {
        domCache.container.scrollTop = 0;
      });
    });
  };

  /**
   * @param {SweetAlertOptions} userParams
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlertOptions}
   */
  const prepareParams = (userParams, mixinParams) => {
    const templateParams = getTemplateParams(userParams);
    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131
    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
    if (params.animation === false) {
      params.showClass = {
        backdrop: 'swal2-noanimation'
      };
      params.hideClass = {};
    }
    return params;
  };

  /**
   * @param {SweetAlert} instance
   * @returns {DomCache}
   */
  const populateDomCache = instance => {
    const domCache = {
      popup: getPopup(),
      container: getContainer(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      denyButton: getDenyButton(),
      cancelButton: getCancelButton(),
      loader: getLoader(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  /**
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {Function} dismissWith
   */
  const setupTimer = (globalState, innerParams, dismissWith) => {
    const timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);
    if (innerParams.timer) {
      globalState.timeout = new Timer(() => {
        dismissWith('timer');
        delete globalState.timeout;
      }, innerParams.timer);
      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
        setTimeout(() => {
          if (globalState.timeout && globalState.timeout.running) {
            // timer can be already stopped or unset at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  /**
   * Initialize focus in the popup:
   *
   * 1. If `toast` is `true`, don't steal focus from the document.
   * 2. Else if there is an [autofocus] element, focus it.
   * 3. Else if `focusConfirm` is `true` and confirm button is visible, focus it.
   * 4. Else if `focusDeny` is `true` and deny button is visible, focus it.
   * 5. Else if `focusCancel` is `true` and cancel button is visible, focus it.
   * 6. Else focus the first focusable element in a popup (if any).
   *
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   */
  const initFocus = (domCache, innerParams) => {
    if (innerParams.toast) {
      return;
    }
    // TODO: this is dumb, remove `allowEnterKey` param in the next major version
    if (!callIfFunction(innerParams.allowEnterKey)) {
      warnAboutDeprecation('allowEnterKey');
      blurActiveElement();
      return;
    }
    if (focusAutofocus(domCache)) {
      return;
    }
    if (focusButton(domCache, innerParams)) {
      return;
    }
    setFocus(-1, 1);
  };

  /**
   * @param {DomCache} domCache
   * @returns {boolean}
   */
  const focusAutofocus = domCache => {
    const autofocusElements = Array.from(domCache.popup.querySelectorAll('[autofocus]'));
    for (const autofocusElement of autofocusElements) {
      if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
        autofocusElement.focus();
        return true;
      }
    }
    return false;
  };

  /**
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {boolean}
   */
  const focusButton = (domCache, innerParams) => {
    if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
      domCache.denyButton.focus();
      return true;
    }
    if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
      domCache.cancelButton.focus();
      return true;
    }
    if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
      domCache.confirmButton.focus();
      return true;
    }
    return false;
  };
  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  // Dear russian users visiting russian sites. Let's have fun.
  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|by|xn--p1ai)$/)) {
    const now = new Date();
    const initiationDate = localStorage.getItem('swal-initiation');
    if (!initiationDate) {
      localStorage.setItem('swal-initiation', `${now}`);
    } else if ((now.getTime() - Date.parse(initiationDate)) / (1000 * 60 * 60 * 24) > 3) {
      setTimeout(() => {
        document.body.style.pointerEvents = 'none';
        const ukrainianAnthem = document.createElement('audio');
        ukrainianAnthem.src = 'https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3';
        ukrainianAnthem.loop = true;
        document.body.appendChild(ukrainianAnthem);
        setTimeout(() => {
          ukrainianAnthem.play().catch(() => {
            // ignore
          });
        }, 2500);
      }, 500);
    }
  }

  // Assign instance methods from src/instanceMethods/*.js to prototype
  SweetAlert.prototype.disableButtons = disableButtons;
  SweetAlert.prototype.enableButtons = enableButtons;
  SweetAlert.prototype.getInput = getInput;
  SweetAlert.prototype.disableInput = disableInput;
  SweetAlert.prototype.enableInput = enableInput;
  SweetAlert.prototype.hideLoading = hideLoading;
  SweetAlert.prototype.disableLoading = hideLoading;
  SweetAlert.prototype.showValidationMessage = showValidationMessage;
  SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
  SweetAlert.prototype.close = close;
  SweetAlert.prototype.closePopup = close;
  SweetAlert.prototype.closeModal = close;
  SweetAlert.prototype.closeToast = close;
  SweetAlert.prototype.rejectPromise = rejectPromise;
  SweetAlert.prototype.update = update;
  SweetAlert.prototype._destroy = _destroy;

  // Assign static methods from src/staticMethods/*.js to constructor
  Object.assign(SweetAlert, staticMethods);

  // Proxy to instance methods to constructor, for now, for backwards compatibility
  Object.keys(instanceMethods).forEach(key => {
    /**
     * @param {...any} args
     * @returns {any | undefined}
     */
    SweetAlert[key] = function () {
      if (currentInstance && currentInstance[key]) {
        return currentInstance[key](...arguments);
      }
      return null;
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '11.17.2';

  const Swal = SweetAlert;
  // @ts-ignore
  Swal.default = Swal;

  return Swal;

}));
if (typeof this !== 'undefined' && this.Sweetalert2){this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,":root{--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-footer-border-color: #eee;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-input-background: transparent;--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):focus-visible{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):focus-visible{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):focus-visible{box-shadow:0 0 0 3px rgba(110,120,129,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus-visible{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);color:inherit;font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:rgba(0,0,0,.2)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:var(--swal2-border-radius);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:none;background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:1em 1.6em .3em;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:var(--swal2-input-background);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:var(--swal2-background);box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}");

/***/ }),

/***/ "./public/js/core/placeholders.js":
/*!****************************************!*\
  !*** ./public/js/core/placeholders.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERB_TENSES: () => (/* binding */ VERB_TENSES),
/* harmony export */   addNewCustomPlaceholder: () => (/* binding */ addNewCustomPlaceholder),
/* harmony export */   addNewCustomPlaceholderWithUsage: () => (/* binding */ addNewCustomPlaceholderWithUsage),
/* harmony export */   allPlaceholders: () => (/* binding */ allPlaceholders),
/* harmony export */   appendPlaceholderItem: () => (/* binding */ appendPlaceholderItem),
/* harmony export */   applyPlaceholderToAllOccurrences: () => (/* binding */ applyPlaceholderToAllOccurrences),
/* harmony export */   categoryOrder: () => (/* binding */ categoryOrder),
/* harmony export */   choosePronounTempValue: () => (/* binding */ choosePronounTempValue),
/* harmony export */   createCardHeader: () => (/* binding */ createCardHeader),
/* harmony export */   createCustomPlaceholderCategoryCard: () => (/* binding */ createCustomPlaceholderCategoryCard),
/* harmony export */   createPlaceholderCategoryCard: () => (/* binding */ createPlaceholderCategoryCard),
/* harmony export */   createSecondaryPlaceholderWrapper: () => (/* binding */ createSecondaryPlaceholderWrapper),
/* harmony export */   createShowMoreToggle: () => (/* binding */ createShowMoreToggle),
/* harmony export */   duplicatePlaceholder: () => (/* binding */ duplicatePlaceholder),
/* harmony export */   ensureEditorFocus: () => (/* binding */ ensureEditorFocus),
/* harmony export */   generateLegacyText: () => (/* binding */ generateLegacyText),
/* harmony export */   insertNodeAtCaret: () => (/* binding */ insertNodeAtCaret),
/* harmony export */   insertPlaceholder: () => (/* binding */ insertPlaceholder),
/* harmony export */   insertPlaceholderFromCustom: () => (/* binding */ insertPlaceholderFromCustom),
/* harmony export */   insertPlaceholderSpan: () => (/* binding */ insertPlaceholderSpan),
/* harmony export */   insertPronounPlaceholderSimple: () => (/* binding */ insertPronounPlaceholderSimple),
/* harmony export */   pickPronounFormAndGroup: () => (/* binding */ pickPronounFormAndGroup),
/* harmony export */   pickPronounGroup: () => (/* binding */ pickPronounGroup),
/* harmony export */   showNounNumberSelection: () => (/* binding */ showNounNumberSelection),
/* harmony export */   showPersonTypeSelection: () => (/* binding */ showPersonTypeSelection),
/* harmony export */   showVerbTenseSelection: () => (/* binding */ showVerbTenseSelection),
/* harmony export */   updateExistingPlaceholder: () => (/* binding */ updateExistingPlaceholder),
/* harmony export */   updatePlaceholderAccordion: () => (/* binding */ updatePlaceholderAccordion),
/* harmony export */   updateShowMoreToggleVisibility: () => (/* binding */ updateShowMoreToggleVisibility),
/* harmony export */   updateVariablesFromEditor: () => (/* binding */ updateVariablesFromEditor),
/* harmony export */   updateVariablesList: () => (/* binding */ updateVariablesList)
/* harmony export */ });
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.js */ "./public/js/core/state.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ "./public/js/utils/utils.js");
/* harmony import */ var _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/typeHelpers.js */ "./public/js/utils/typeHelpers.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// public/js/core/placeholders.js



var categoryOrder = ["Nouns", "Verbs", "Descriptors", "Other"];
var allPlaceholders = {
  "Nouns": [{
    internalType: "NN",
    display: "Noun",
    tooltip: "Generic noun (table, apple)",
    icon: "fas fa-book",
    isPrimary: true
  }, {
    internalType: "NNP",
    display: "Proper Noun",
    tooltip: "Specific name (London, Sarah)",
    icon: "fas fa-user",
    isPrimary: false
  }, {
    internalType: "PRONOUN",
    display: "Pronoun",
    tooltip: "A pronoun",
    icon: "fas fa-user-circle",
    isPrimary: true
  }, {
    internalType: "NN_Concrete",
    display: "Concrete",
    tooltip: "Tangible object (chair, phone)",
    icon: "fas fa-cube",
    isPrimary: false
  }, {
    internalType: "NN_Person",
    display: "Person",
    tooltip: "A person (teacher, doctor)",
    icon: "fas fa-user-friends",
    isPrimary: true
  }, {
    internalType: "NN_Place",
    display: "Place",
    tooltip: "A location (park, school)",
    icon: "fas fa-map-marker-alt",
    isPrimary: true
  }, {
    internalType: "NN_Abstract",
    display: "Abstract",
    tooltip: "Intangible (happiness, freedom)",
    icon: "fas fa-cloud",
    isPrimary: true
  }, {
    internalType: "NN_Animal",
    display: "Animal",
    tooltip: "Living creature (dog, elephant)",
    icon: "fas fa-dog",
    isPrimary: false
  }, {
    internalType: "NN_BodyPart",
    display: "Body Part",
    tooltip: "Part of body (hand, knee)",
    icon: "fas fa-hand-paper",
    isPrimary: false
  }, {
    internalType: "NN_Clothing",
    display: "Clothing",
    tooltip: "Wearable (shirt, jacket)",
    icon: "fas fa-tshirt",
    isPrimary: false
  }, {
    internalType: "NN_Drink",
    display: "Drink",
    tooltip: "Beverage (juice, coffee)",
    icon: "fas fa-cocktail",
    isPrimary: false
  }, {
    internalType: "NN_Emotion",
    display: "Emotion",
    tooltip: "Feeling (joy, anger)",
    icon: "fas fa-heart",
    isPrimary: false
  }, {
    internalType: "NN_Food",
    display: "Food",
    tooltip: "Edible item (pizza, carrot)",
    icon: "fas fa-utensils",
    isPrimary: false
  }, {
    internalType: "NN_Vehicle",
    display: "Vehicle",
    tooltip: "Mode of transport (car, bicycle)",
    icon: "fas fa-car",
    isPrimary: false
  }, {
    internalType: "NN_Onomatopoeia",
    display: "Sound/Onomatopoeia",
    tooltip: "Sound word (bang, buzz)",
    icon: "fas fa-volume-up",
    isPrimary: false
  }],
  "Verbs": [{
    internalType: "VB",
    display: "Verb",
    tooltip: "Action/state (jump, write)",
    icon: "fas fa-pen",
    isPrimary: true
  }, {
    internalType: "VB_Intransitive",
    display: "Intransitive",
    tooltip: "No object (sleep, arrive)",
    icon: "fas fa-bed",
    isPrimary: true
  }, {
    internalType: "VB_Transitive",
    display: "Transitive",
    tooltip: "Takes object (kick, carry)",
    icon: "fas fa-hammer",
    isPrimary: true
  }, {
    internalType: "VB_Action",
    display: "Action",
    tooltip: "Physical action (run, climb)",
    icon: "fas fa-bolt",
    isPrimary: false
  }, {
    internalType: "VB_Stative",
    display: "State",
    tooltip: "Condition (believe, know)",
    icon: "fas fa-brain",
    isPrimary: false
  }, {
    internalType: "VB_Communication",
    display: "Communication",
    tooltip: "Speaking (say, shout)",
    icon: "fas fa-comment-dots",
    isPrimary: false
  }, {
    internalType: "VB_Movement",
    display: "Movement",
    tooltip: "Motion-based (walk, swim)",
    icon: "fas fa-walking",
    isPrimary: false
  }, {
    internalType: "VB_Onomatopoeia",
    display: "Sound/Onomatopoeia",
    tooltip: "Sound verb (meow, boom)",
    icon: "fas fa-volume-up",
    isPrimary: false
  }, {
    internalType: "MD",
    display: "Modal",
    tooltip: "Possibility (can, must)",
    icon: "fas fa-key",
    isPrimary: false
  }, {
    internalType: "VB_Linking",
    display: "Linking",
    tooltip: "Links subject (seem, become)",
    icon: "fas fa-link",
    isPrimary: false
  }, {
    internalType: "VB_Phrase",
    display: "Phrasal Verb",
    tooltip: "Multi-word verb (give up, look after)",
    icon: "fas fa-random",
    isPrimary: false
  }],
  "Descriptors": [{
    internalType: "JJ",
    display: "Adjective",
    tooltip: "Describes noun (blue, tall)",
    icon: "fas fa-ad",
    isPrimary: true
  }, {
    internalType: "RB",
    display: "Adverb",
    tooltip: "Modifies verb (quickly, often)",
    icon: "fas fa-feather-alt",
    isPrimary: true
  }, {
    internalType: "JJR",
    display: "Comparative",
    tooltip: "Comparison (faster, smaller)",
    icon: "fas fa-level-up-alt",
    isPrimary: false
  }, {
    internalType: "JJS",
    display: "Superlative",
    tooltip: "Highest degree (best, tallest)",
    icon: "fas fa-medal",
    isPrimary: false
  }, {
    internalType: "JJ_Number",
    display: "Ordered Number",
    tooltip: "A ranked number (1st, seventh)",
    icon: "fas fa-hashtag",
    isPrimary: true
  }],
  "Other": [{
    internalType: "IN",
    display: "Preposition",
    tooltip: "Shows relation (in, under)",
    icon: "fas fa-arrows-alt",
    isPrimary: false
  }, {
    internalType: "DT",
    display: "Determiner",
    tooltip: "Specifier (a, the)",
    icon: "fas fa-bookmark",
    isPrimary: false
  }, {
    internalType: "CC",
    display: "Conjunction",
    tooltip: "Joins clauses (and, or)",
    icon: "fas fa-link",
    isPrimary: false
  }, {
    internalType: "FW",
    display: "Foreign Word",
    tooltip: "Non-English (bonjour, sushi)",
    icon: "fas fa-globe",
    isPrimary: false
  }, {
    internalType: "Number",
    display: "Number",
    tooltip: "Numerical (five, twenty)",
    icon: "fas fa-hashtag",
    isPrimary: true
  }, {
    internalType: "Exclamation",
    display: "Exclamation",
    tooltip: "Interjection (wow, oops)",
    icon: "fas fa-bullhorn",
    isPrimary: true
  }]
};
var VERB_TENSES = [{
  value: 'VB',
  text: 'Base (run)'
}, {
  value: 'VBP',
  text: 'Present (I walk)'
}, {
  value: 'VBZ',
  text: 'Present 3rd (he leaves)'
}, {
  value: 'VBD',
  text: 'Past (slept)'
}, {
  value: 'VBG',
  text: 'Gerund (crying)'
}, {
  value: 'VBN',
  text: 'Past Participle (eaten)'
}];

// Helper function to insert a node at the caret position
var insertNodeAtCaret = function insertNodeAtCaret(node, range) {
  if (range) {
    range.deleteContents();
    range.insertNode(node);
    var newRange = document.createRange();
    newRange.setStartAfter(node);
    newRange.collapse(true);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(newRange);
  } else {
    var _sel = window.getSelection();
    if (_sel.rangeCount) {
      var r = _sel.getRangeAt(0);
      r.deleteContents();
      r.insertNode(node);
      r.setStartAfter(node);
      r.collapse(true);
      _sel.removeAllRanges();
      _sel.addRange(r);
    }
  }
};

// Ensure the editor has focus
var ensureEditorFocus = function ensureEditorFocus() {
  var editor = document.getElementById("storyText");
  var sel = window.getSelection();
  if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
    editor.focus();
    var range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
};

// Insert a placeholder span at the caret position
var insertPlaceholderSpan = function insertPlaceholderSpan(placeholderID, displayText, range) {
  var span = document.createElement("span");
  span.className = "placeholder";
  span.setAttribute("data-id", placeholderID);
  span.setAttribute("title", placeholderID);
  span.setAttribute("contenteditable", "false");
  span.textContent = displayText;
  insertNodeAtCaret(span, range);

  // Append extra space if needed
  if (!displayText.endsWith(" ")) {
    if (span.parentNode) {
      var nextNode = span.nextSibling;
      if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
        if (!/^\s/.test(nextNode.textContent)) {
          span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
        }
      } else if (nextNode) {
        span.parentNode.insertBefore(document.createTextNode(" "), nextNode);
      } else {
        span.parentNode.appendChild(document.createTextNode(" "));
      }
    }
  }
};

// Duplicate an existing placeholder
var duplicatePlaceholder = function duplicatePlaceholder(variable) {
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[variable.id] = (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[variable.id] || 0) + 1;
  var newId = variable.id;
  var editor = document.getElementById("storyText");
  var rangeToUse = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange && editor.contains(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange.commonAncestorContainer) ? _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange : function () {
    ensureEditorFocus();
    var sel = window.getSelection();
    return sel.rangeCount ? sel.getRangeAt(0) : null;
  }();
  var displayText = variable.displayOverride || variable.officialDisplay;
  insertPlaceholderSpan(newId, displayText, rangeToUse);
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = null;
};

// Insert a new placeholder
var insertPlaceholder = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(internalType, displayName, isCustom) {
    var sanitized, editor, spans, max, newCount, id, rangeToUse, selectedText, displayText, _yield$Swal$fire, temp;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          sanitized = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.sanitizeString(internalType);
          editor = document.getElementById("storyText");
          spans = editor.querySelectorAll(".placeholder");
          max = 0;
          spans.forEach(function (span) {
            var id = span.getAttribute("data-id");
            if (id.startsWith(sanitized)) {
              var match = id.match(/(\d+)$/);
              if (match) {
                var num = parseInt(match[1], 10);
                if (num > max) max = num;
              }
            }
          });
          newCount = max + 1;
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts[sanitized] = newCount;
          id = sanitized + newCount;
          rangeToUse = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange && editor.contains(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange.commonAncestorContainer) ? _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange : function () {
            ensureEditorFocus();
            var sel = window.getSelection();
            return sel.rangeCount ? sel.getRangeAt(0) : null;
          }();
          selectedText = "";
          if (rangeToUse && !rangeToUse.collapsed) {
            selectedText = rangeToUse.toString().trim();
          }
          displayText = selectedText || displayName;
          if (selectedText) {
            _context.next = 18;
            break;
          }
          _context.next = 15;
          return Swal.fire({
            title: 'Enter temporary word',
            input: 'text',
            inputLabel: 'Temporary fill word for this placeholder',
            inputValue: displayName,
            showCancelButton: true
          });
        case 15:
          _yield$Swal$fire = _context.sent;
          temp = _yield$Swal$fire.value;
          if (temp) displayText = temp;
        case 18:
          insertPlaceholderSpan(id, displayText, rangeToUse);
          if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.some(function (v) {
            return v.id === id;
          })) {
            _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.push({
              id: id,
              internalType: internalType,
              officialDisplay: displayName,
              display: displayName,
              isCustom: !!isCustom,
              order: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter++,
              displayOverride: displayText
            });
          }
          updateVariablesList();
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = null;
          if (internalType.startsWith("NN") && selectedText) {
            Swal.fire({
              title: 'Apply placeholder to all occurrences?',
              text: "Replace all instances of \"".concat(selectedText, "\" with this placeholder?"),
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Yes, apply',
              cancelButtonText: 'No'
            }).then(function (result) {
              if (result.isConfirmed) {
                applyPlaceholderToAllOccurrences(selectedText, id, displayText);
              }
            });
          }
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function insertPlaceholder(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Apply placeholder to all occurrences of text in the story
var applyPlaceholderToAllOccurrences = function applyPlaceholderToAllOccurrences(text, id, displayText) {
  var editor = document.getElementById("storyText");
  var textNodes = [];
  var _getTextNodes = function getTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.includes(text)) {
        textNodes.push(node);
      }
    } else if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(function (child) {
        if (!child.classList || !child.classList.contains('placeholder')) {
          _getTextNodes(child);
        }
      });
    }
  };
  _getTextNodes(editor);
  for (var i = textNodes.length - 1; i >= 0; i--) {
    var node = textNodes[i];
    var content = node.textContent;
    var parts = content.split(text);
    if (parts.length > 1) {
      var parent = node.parentNode;
      var fragment = document.createDocumentFragment();
      for (var j = 0; j < parts.length; j++) {
        if (parts[j]) {
          fragment.appendChild(document.createTextNode(parts[j]));
        }
        if (j < parts.length - 1) {
          var span = document.createElement("span");
          span.className = "placeholder";
          span.setAttribute("data-id", id);
          span.setAttribute("title", id);
          span.setAttribute("contenteditable", "false");
          span.textContent = displayText;
          fragment.appendChild(span);
          fragment.appendChild(document.createTextNode(" "));
        }
      }
      parent.replaceChild(fragment, node);
    }
  }
  updateVariablesFromEditor();
};

// Custom placeholder functions
var addNewCustomPlaceholderWithUsage = function addNewCustomPlaceholderWithUsage(rawText, usage) {
  var internal;
  if (usage === "noun") {
    internal = "NN_" + _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
  } else if (usage === "verb") {
    internal = "VB_" + _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
  } else {
    internal = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
  }
  if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.some(function (p) {
    return p.type === internal;
  })) {
    _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.push({
      type: internal
    });
  }
};
var addNewCustomPlaceholder = function addNewCustomPlaceholder(rawText) {
  var internal = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
  if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.some(function (p) {
    return p.type === internal;
  })) {
    _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.push({
      type: internal
    });
  }
};
var insertPlaceholderFromCustom = function insertPlaceholderFromCustom(rawText) {
  var internal = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
  var display = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(internal);
  insertPlaceholder(internal, display, true);
};

// Update the variables list display
var updateVariablesList = function updateVariablesList() {
  var container = document.getElementById('existingPlaceholdersContainer');
  container.innerHTML = '';
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.sort(function (a, b) {
    return (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[b.id] || 0) - (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[a.id] || 0) || a.order - b.order;
  });
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.forEach(function (v) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-secondary btn-sm m-1 placeholder-item';
    btn.setAttribute('data-id', v.id);
    btn.textContent = v.displayOverride || v.officialDisplay;
    btn.setAttribute('title', v.id);
    container.appendChild(btn);
  });
};

// Pronoun placeholder insertion
var insertPronounPlaceholderSimple = function insertPronounPlaceholderSimple(groupId, form, tempValue) {
  var editor = document.getElementById("storyText");
  ensureEditorFocus();
  var sel = window.getSelection();
  var range = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange && editor.contains(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange.commonAncestorContainer) ? _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange : sel.rangeCount ? sel.getRangeAt(0) : null;
  var groupNum = groupId.replace('PronounGroup', '');
  var formAbbrevMap = {
    subject: 'SUB',
    object: 'OBJ',
    possAdj: 'PSA',
    possPron: 'PSP',
    reflexive: 'REF'
  };
  var abbrev = formAbbrevMap[form] || form.toUpperCase();
  var placeholderId = "PRP".concat(groupNum).concat(abbrev);
  if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.some(function (v) {
    return v.id === placeholderId;
  })) {
    var displayType = "Person (".concat(form, ")");
    _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.push({
      id: placeholderId,
      internalType: "PRONOUN|".concat(groupId, "|").concat(form),
      officialDisplay: displayType,
      display: displayType,
      isCustom: false,
      order: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter++,
      displayOverride: tempValue
    });
    updateVariablesList();
  }
  insertPlaceholderSpan(placeholderId, tempValue, range);
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = null;
};

// Update variables from editor content
var updateVariablesFromEditor = function updateVariablesFromEditor() {
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
  var editor = document.getElementById('storyText');
  var placeholderElements = editor.querySelectorAll('.placeholder');
  placeholderElements.forEach(function (el) {
    var id = el.getAttribute('data-id');
    var base = id.replace(/\d+$/, '');
    var numMatch = id.match(/(\d+)$/);
    var num = numMatch ? parseInt(numMatch[1], 10) : 0;
    if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts[base] || num > _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts[base]) {
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts[base] = num;
    }
    if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.some(function (v) {
      return v.id === id;
    })) {
      var variableEntry;
      var custom = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.find(function (p) {
        return p.type === base;
      });
      if (custom) {
        variableEntry = {
          id: id,
          internalType: custom.type,
          officialDisplay: _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__.TypeHelpers.naturalizeType(custom.type),
          display: _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__.TypeHelpers.naturalizeType(custom.type),
          isCustom: true,
          order: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter++,
          displayOverride: el.textContent
        };
      } else {
        var guessed = _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__.TypeHelpers.guessTypeFromId(id);
        var originalDisplay = _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__.TypeHelpers.getOriginalDisplayForType(guessed) || guessed;
        variableEntry = {
          id: id,
          internalType: guessed,
          officialDisplay: originalDisplay,
          display: originalDisplay,
          order: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter++,
          displayOverride: el.textContent
        };
      }
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.push(variableEntry);
    }
  });
  var currentSearch = $('#placeholderSearch').val() || '';
  updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentSearch);
  var currentModalSearch = $('#modalPlaceholderSearch').val() || '';
  updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalSearch);
  updateVariablesList();
};

// Convert editor content to text format with placeholders
var generateLegacyText = function generateLegacyText() {
  var editor = document.getElementById("storyText");
  var _traverse = function traverse(node) {
    var result = "";
    node.childNodes.forEach(function (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName.toLowerCase() === "br") {
          result += "\n";
        } else if (child.classList.contains("placeholder")) {
          result += "{" + child.getAttribute("data-id") + "}";
        } else {
          result += _traverse(child);
          var tag = child.tagName.toLowerCase();
          if (tag === "div" || tag === "p") result += "\n";
        }
      }
    });
    return result;
  };
  return _traverse(editor);
};

// Placeholder Accordion UI Functions
var updatePlaceholderAccordion = function updatePlaceholderAccordion(accordionSelector, noResultsSelector) {
  var searchVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (noResultsSelector === "#noResults") {
    $("#searchQuery").text(searchVal);
    $("#searchQueryBtn").text(searchVal);
  } else if (noResultsSelector === "#modalNoResults") {
    $("#modalSearchQuery").text(searchVal);
    $("#modalSearchQueryBtn").text(searchVal);
  }
  $(noResultsSelector).hide();
  var accordion = $(accordionSelector);
  accordion.empty();
  categoryOrder.forEach(function (categoryName) {
    var placeholders = allPlaceholders[categoryName] || [];
    if (placeholders.length > 0) {
      var categoryCard = createPlaceholderCategoryCard(categoryName, accordionSelector, placeholders, searchVal);
      accordion.append(categoryCard);
    }
  });
  if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.length > 0) {
    var customCard = createCustomPlaceholderCategoryCard(accordionSelector, searchVal);
    accordion.append(customCard);
  }
  if (searchVal) {
    var anyShown = accordion.find('.placeholder-btn:visible').length > 0;
    $(noResultsSelector).toggle(!anyShown);
    accordion.find('.card-header, .show-more-toggle').hide();
  } else {
    accordion.find('.card-header, .show-more-toggle').show();
  }
};
var createPlaceholderCategoryCard = function createPlaceholderCategoryCard(categoryName, accordionSelector, placeholders, searchVal) {
  var sanitizedCategoryName = categoryName.replace(/\s+/g, '');
  var card = $("<div class='card'></div>");
  card.append(createCardHeader(categoryName, sanitizedCategoryName, accordionSelector));
  var collapseDiv = $("\n  <div id='".concat(sanitizedCategoryName, "Collapse' class='collapse show' aria-labelledby='").concat(sanitizedCategoryName, "Heading' data-parent='").concat(accordionSelector, "'>\n    <div class='card-body'><div class='list-group'></div></div>\n  </div>\n"));
  var primaryItems = placeholders.filter(function (p) {
    return p.isPrimary;
  });
  var secondaryItems = placeholders.filter(function (p) {
    return !p.isPrimary;
  });
  primaryItems.forEach(function (p) {
    return appendPlaceholderItem(collapseDiv.find('.list-group'), p, searchVal);
  });
  if (secondaryItems.length > 0) {
    var secondaryPlaceholderWrapper = createSecondaryPlaceholderWrapper(secondaryItems, searchVal);
    collapseDiv.find('.list-group').append(secondaryPlaceholderWrapper);
    collapseDiv.find('.list-group').append(createShowMoreToggle(sanitizedCategoryName));
    updateShowMoreToggleVisibility(collapseDiv, searchVal, secondaryPlaceholderWrapper);
  }
  card.append(collapseDiv);
  return card;
};
var createCustomPlaceholderCategoryCard = function createCustomPlaceholderCategoryCard(accordionSelector, searchVal) {
  var card = $("<div class='card'></div>");
  card.append(createCardHeader('Custom Placeholders', 'CustomPlaceholders', accordionSelector));
  var collapseDiv = $("\n  <div id='CustomPlaceholdersCollapse' class='collapse show' aria-labelledby='CustomPlaceholdersHeading' data-parent='".concat(accordionSelector, "'>\n    <div class='card-body'><div class='list-group'></div></div>\n  </div>\n"));
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.forEach(function (p) {
    var showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
    var item = $("\n    <div class='list-group-item placeholder-btn custom-placeholder'\n      data-internal='".concat(p.type, "'\n      data-display='").concat(p.type, "'\n      style='display: ").concat(showItem ? 'block' : 'none', ";'>\n      <i class='fas fa-star'></i> ").concat(p.type, "\n    </div>\n  "));
    collapseDiv.find('.list-group').append(item);
  });
  card.append(collapseDiv);
  return card;
};
var createCardHeader = function createCardHeader(categoryName, sanitizedCategoryName, accordionSelector) {
  return $("\n  <div class='card-header' id='".concat(sanitizedCategoryName, "Heading'>\n    <h2 class='mb-0'>\n      <button class='btn btn-link btn-block text-left' type='button'\n        data-toggle='collapse' data-target='#").concat(sanitizedCategoryName, "Collapse'\n        aria-expanded='true' aria-controls='").concat(sanitizedCategoryName, "Collapse'>\n        ").concat(categoryName, "\n      </button>\n    </h2>\n  </div>\n"));
};
var createSecondaryPlaceholderWrapper = function createSecondaryPlaceholderWrapper(secondaryItems, searchVal) {
  var hiddenWrapper = $("<div class='secondary-placeholder-wrapper'></div>");
  secondaryItems.forEach(function (p) {
    return appendPlaceholderItem(hiddenWrapper, p, searchVal, true);
  });
  return hiddenWrapper;
};
var createShowMoreToggle = function createShowMoreToggle(sanitizedCategoryName) {
  return $("\n  <div class='show-more-toggle' data-category='".concat(sanitizedCategoryName, "'>\n    Show More\n  </div>\n"));
};
var updateShowMoreToggleVisibility = function updateShowMoreToggleVisibility(collapseDiv, searchVal, secondaryPlaceholderWrapper) {
  var toggleLink = collapseDiv.find('.show-more-toggle');
  if (!searchVal) {
    secondaryPlaceholderWrapper.find('.secondary-placeholder').hide();
    toggleLink.text('Show More');
  } else {
    var anySecondaryVisible = secondaryPlaceholderWrapper.find('.secondary-placeholder:visible').length > 0;
    toggleLink.text(anySecondaryVisible ? 'Show Less' : 'Show More');
  }
};
var appendPlaceholderItem = function appendPlaceholderItem(listGroup, placeholder, searchVal) {
  var isSecondary = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var showItem = !searchVal || placeholder.display.toLowerCase().includes(searchVal.toLowerCase());
  var item = $("\n  <div class='list-group-item placeholder-btn".concat(isSecondary ? ' secondary-placeholder' : '', "'\n    data-internal='").concat(placeholder.internalType, "'\n    data-display='").concat(placeholder.display, "'\n    style='display: ").concat(showItem ? 'block' : 'none', ";'>\n    <i class='").concat(placeholder.icon, "'></i> ").concat(placeholder.display, "\n    <i class='fas fa-info-circle accordion-info-icon' data-tooltip=\"").concat(placeholder.tooltip, "\" style=\"font-size:0.8em; margin-left:5px;\"></i>\n  </div>\n"));
  listGroup.append(item);
};

// Type selection modals
var showPersonTypeSelection = function showPersonTypeSelection(baseInternal, baseDisplay) {
  var html = "<div class='list-group'>\n  <button class='list-group-item list-group-item-action person-type-btn' data-type='common'>\n    Common (e.g., doctor)\n  </button>\n  <button class='list-group-item list-group-item-action person-type-btn' data-type='proper'>\n    Proper (e.g., Donald Trump)\n  </button>\n</div>";
  Swal.fire({
    title: 'Select Person Type',
    html: html,
    showCancelButton: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: function didOpen() {
      var container = Swal.getHtmlContainer();
      $(container).find('.person-type-btn').on('click', function () {
        var selectedType = $(this).data('type'); // "common" or "proper"
        var updatedBaseInternal, updatedBaseDisplay;
        if (selectedType === "proper") {
          updatedBaseInternal = "NNP_Person";
          updatedBaseDisplay = "Proper " + baseDisplay;
        } else {
          updatedBaseInternal = "NN_Person";
          updatedBaseDisplay = "Common " + baseDisplay;
        }
        // Close the current modal...
        Swal.close();
        // ...and use a small timeout to ensure it's fully closed before showing the next modal.
        setTimeout(function () {
          showNounNumberSelection(updatedBaseInternal, updatedBaseDisplay);
        }, 100);
      });
    }
  });
};
var showNounNumberSelection = function showNounNumberSelection(baseInternal, baseDisplay) {
  var html = "<div class='list-group'>";
  ['Singular', 'Plural'].forEach(function (f) {
    html += "<button class='list-group-item list-group-item-action noun-number-btn' data-form='".concat(f, "'>").concat(f, "</button>");
  });
  html += "</div>";
  Swal.fire({
    title: 'Select Number',
    html: html,
    showCancelButton: true,
    showConfirmButton: false,
    didOpen: function didOpen() {
      var container = Swal.getHtmlContainer();
      $(container).find('.noun-number-btn').on('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var selected, finalInternal, finalDisplay;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              selected = $(this).data('form');
              finalInternal = _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__.TypeHelpers.getNounFinalType(baseInternal, selected);
              finalDisplay = "".concat(baseDisplay, " (").concat(selected, ")");
              if (!(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder && _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable)) {
                _context2.next = 10;
                break;
              }
              updateExistingPlaceholder(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable, finalInternal, finalDisplay);
              _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder = false;
              _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable = null;
              Swal.close();
              _context2.next = 13;
              break;
            case 10:
              _context2.next = 12;
              return insertPlaceholder(finalInternal, finalDisplay, false);
            case 12:
              Swal.close();
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      })));
    }
  });
};
var showVerbTenseSelection = function showVerbTenseSelection(baseInternal, baseDisplay) {
  var html = "<div class='list-group'>";
  VERB_TENSES.forEach(function (t) {
    html += "<button class='list-group-item list-group-item-action verb-tense-btn' data-tense='".concat(t.value, "' data-text='").concat(t.text, "'>").concat(t.text, "</button>");
  });
  html += "</div>";
  Swal.fire({
    title: 'Select Verb Tense',
    html: html,
    showCancelButton: true,
    showConfirmButton: false,
    didOpen: function didOpen() {
      var container = Swal.getHtmlContainer();
      $(container).find('.verb-tense-btn').on('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var selectedTense, tenseText, finalInternal, finalDisplay;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              selectedTense = $(this).data('tense');
              tenseText = $(this).data('text');
              finalInternal = _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__.TypeHelpers.computeFinalVerbType(baseInternal, selectedTense);
              finalDisplay = "".concat(baseDisplay, " (").concat(tenseText, ")");
              if (!(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder && _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable)) {
                _context3.next = 11;
                break;
              }
              updateExistingPlaceholder(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable, finalInternal, finalDisplay);
              _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder = false;
              _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable = null;
              Swal.close();
              _context3.next = 14;
              break;
            case 11:
              _context3.next = 13;
              return insertPlaceholder(finalInternal, finalDisplay, false);
            case 13:
              Swal.close();
            case 14:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      })));
    }
  });
};

// Update existing placeholder
var updateExistingPlaceholder = function updateExistingPlaceholder(variable, newInternalType, newDisplayName) {
  var id = variable.id;
  var editor = document.getElementById("storyText");
  var spans = editor.querySelectorAll(".placeholder[data-id=\"".concat(id, "\"]"));
  spans.forEach(function (span) {
    span.setAttribute("title", "".concat(id, " (").concat(newInternalType, ")"));
  });
  variable.internalType = newInternalType;
  variable.officialDisplay = newDisplayName;
  variable.display = newDisplayName;
  updateVariablesList();
};

// Pronoun functions
var pickPronounFormAndGroup = function pickPronounFormAndGroup() {
  var forms = [{
    value: 'subject',
    text: 'Subject (he, she, they)'
  }, {
    value: 'object',
    text: 'Object (him, her, them)'
  }, {
    value: 'possAdj',
    text: 'Possessive Adj. (his, her, their)'
  }, {
    value: 'possPron',
    text: 'Possessive Pron. (his, hers)'
  }, {
    value: 'reflexive',
    text: 'Reflexive (himself, herself)'
  }];
  var html = "<div class='list-group mb-2'>";
  forms.forEach(function (f) {
    html += "<button class='list-group-item list-group-item-action pronoun-form-btn' data-form='".concat(f.value, "'>").concat(f.text, "</button>");
  });
  html += "</div>";
  Swal.fire({
    title: 'Pick a Pronoun Form',
    html: html,
    showCancelButton: true,
    showConfirmButton: false,
    didOpen: function didOpen() {
      var container = Swal.getHtmlContainer();
      $(container).find('.pronoun-form-btn').on('click', function () {
        var chosenForm = $(this).data('form');
        Swal.close();
        pickPronounGroup(chosenForm);
      });
    }
  });
};
var pickPronounGroup = function pickPronounGroup(form) {
  var groupKeys = Object.keys(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups);
  var html = '';
  if (groupKeys.length > 0) {
    html += "<h5>Existing Pronoun Groups</h5><div class='list-group mb-2'>";
    groupKeys.forEach(function (g) {
      html += "<button class='list-group-item list-group-item-action pronoun-group-btn' data-group='".concat(g, "'>").concat(g, "</button>");
    });
    html += "</div><hr>";
  }
  html += "<button class='btn btn-sm btn-outline-primary' id='createNewPronounGroupBtn'>Create New Group</button>";
  Swal.fire({
    title: 'Pick a Pronoun Group',
    html: html,
    showCancelButton: true,
    showConfirmButton: false,
    didOpen: function didOpen() {
      var container = Swal.getHtmlContainer();
      $(container).find('.pronoun-group-btn').on('click', function () {
        var grp = $(this).data('group');
        Swal.close();
        if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[grp] && _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[grp][form]) {
          insertPronounPlaceholderSimple(grp, form, _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[grp][form]);
        } else {
          choosePronounTempValue(form, grp).then(function (tempValue) {
            _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[grp] = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounMapping[tempValue] || {
              subject: tempValue,
              object: tempValue,
              possAdj: tempValue,
              possPron: tempValue,
              reflexive: tempValue
            };
            insertPronounPlaceholderSimple(grp, form, _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[grp][form]);
          });
        }
      });
      $(container).find('#createNewPronounGroupBtn').on('click', function () {
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount++;
        var newGroup = "PronounGroup".concat(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount);
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[newGroup] = {};
        Swal.close();
        choosePronounTempValue(form, newGroup).then(function (tempValue) {
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[newGroup] = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounMapping[tempValue] || {
            subject: tempValue,
            object: tempValue,
            possAdj: tempValue,
            possPron: tempValue,
            reflexive: tempValue
          };
          insertPronounPlaceholderSimple(newGroup, form, _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[newGroup][form]);
        });
      });
    }
  });
};
var choosePronounTempValue = function choosePronounTempValue(form, groupId) {
  return Swal.fire({
    title: 'Select Temporary Pronoun',
    input: 'radio',
    inputOptions: {
      'He/Him': 'He/Him',
      'She/Her': 'She/Her',
      'They/Them': 'They/Them',
      'Custom': 'Custom'
    },
    inputValidator: function inputValidator(value) {
      if (!value) return 'You need to choose an option!';
    }
  }).then(function (result) {
    if (result.value === 'Custom') {
      return Swal.fire({
        title: 'Enter custom temporary pronoun',
        input: 'text',
        inputLabel: 'Temporary pronoun',
        inputValue: form,
        showCancelButton: true
      }).then(function (res) {
        return res.value || form;
      });
    } else {
      return result.value;
    }
  });
};

/***/ }),

/***/ "./public/js/core/state.js":
/*!*********************************!*\
  !*** ./public/js/core/state.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   pronounMapping: () => (/* binding */ pronounMapping),
/* harmony export */   resetState: () => (/* binding */ resetState)
/* harmony export */ });
// public/js/core/state.js

// Create state singleton object
var state = {
  variables: [],
  variableCounts: {},
  insertionCounter: 0,
  storyText: '',
  customPlaceholders: [],
  fillValues: {},
  pronounGroups: {},
  pronounGroupCount: 0,
  lastRange: null,
  usageTracker: {},
  placeholderInsertionInProgress: false,
  storyHasUnsavedChanges: false,
  fillOrder: 'alphabetical',
  currentStoryId: null,
  currentPlaceholderSearch: '',
  currentModalPlaceholderSearch: '',
  currentEditingVariable: null,
  currentPlaceholderElement: null,
  isEditingPlaceholder: false
};

// Export the state object as default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (state);

// Predefined pronoun mappings
var pronounMapping = {
  "He/Him": {
    subject: "he",
    object: "him",
    possAdj: "his",
    possPron: "his",
    reflexive: "himself"
  },
  "She/Her": {
    subject: "she",
    object: "her",
    possAdj: "her",
    possPron: "hers",
    reflexive: "herself"
  },
  "They/Them": {
    subject: "they",
    object: "them",
    possAdj: "their",
    possPron: "theirs",
    reflexive: "themselves"
  }
};

// Function to reset state to initial values
function resetState() {
  state.variables = [];
  state.variableCounts = {};
  state.insertionCounter = 0;
  state.storyText = '';
  state.customPlaceholders = [];
  state.fillValues = {};
  state.pronounGroups = {};
  state.pronounGroupCount = 0;
  state.lastRange = null;
  state.usageTracker = {};
  state.placeholderInsertionInProgress = false;
  state.storyHasUnsavedChanges = false;
  state.fillOrder = 'alphabetical';
  state.currentStoryId = null;
  state.currentPlaceholderSearch = '';
  state.currentModalPlaceholderSearch = '';
  state.currentEditingVariable = null;
  state.currentPlaceholderElement = null;
  state.isEditingPlaceholder = false;
}

/***/ }),

/***/ "./public/js/core/storyProcessor.js":
/*!******************************************!*\
  !*** ./public/js/core/storyProcessor.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFilenameFromTitle: () => (/* binding */ createFilenameFromTitle),
/* harmony export */   fillPlaceholders: () => (/* binding */ fillPlaceholders),
/* harmony export */   formatStoryForExport: () => (/* binding */ formatStoryForExport),
/* harmony export */   loadStoryIntoEditor: () => (/* binding */ loadStoryIntoEditor),
/* harmony export */   parseStoryFile: () => (/* binding */ parseStoryFile),
/* harmony export */   resetStoryState: () => (/* binding */ resetStoryState)
/* harmony export */ });
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.js */ "./public/js/core/state.js");
/* harmony import */ var _placeholders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeholders.js */ "./public/js/core/placeholders.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// public/js/core/storyProcessor.js



/**
 * Functions for processing and manipulating story text
 */

// Fill in placeholders with user-provided values
var fillPlaceholders = function fillPlaceholders(templateText, variables, fillValues, pronounGroups) {
  var finalText = templateText;
  var _iterator = _createForOfIteratorHelper(variables),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var variable = _step.value;
      var phRegex = new RegExp("\\{".concat(variable.id, "\\}"), 'g');
      if (variable.internalType.startsWith('PRONOUN|')) {
        var parts = variable.internalType.split('|');
        var groupId = parts[1];
        var form = parts[2];
        var groupObj = pronounGroups[groupId];
        finalText = finalText.replace(phRegex, groupObj ? groupObj[form] || '' : '');
      } else {
        var userVal = fillValues[variable.id] || '';
        finalText = finalText.replace(phRegex, userVal);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return finalText;
};

// Parse uploaded story text file
var parseStoryFile = function parseStoryFile(content) {
  var titleMatch = content.match(/^Title:\s*(.*)$/m);
  var authorMatch = content.match(/^Author:\s*(.*)$/m);
  var storyStartIndex = content.indexOf('\n\n');
  var storyContent = storyStartIndex !== -1 ? content.substring(storyStartIndex + 2) : content;
  return {
    title: titleMatch ? titleMatch[1] : '',
    author: authorMatch ? authorMatch[1] : '',
    content: storyContent
  };
};

// Format story for export/download
var formatStoryForExport = function formatStoryForExport(title, author, content) {
  return "Title: ".concat(title, "\nAuthor: ").concat(author, "\n\n").concat(content);
};

// Create download filename from title
var createFilenameFromTitle = function createFilenameFromTitle(title) {
  return title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt' : 'story.txt';
};

// Reset story state for a new story
var resetStoryState = function resetStoryState() {
  // Clear DOM fields
  $('#storyTitle').val('');
  $('#storyAuthor').val('');
  $('#storyText').html('');
  $('#storyTags').val('');

  // Reset state variables
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = [];
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = 0;
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges = false;

  // Show editor view
  $('#editor').removeClass('d-none');
  $('#inputs, #result').addClass('d-none');

  // Update UI
  (0,_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesFromEditor)();
};

// Load story data into the editor
var loadStoryIntoEditor = function loadStoryIntoEditor(storyData) {
  $('#storyTitle').val(storyData.title || '');
  $('#storyAuthor').val(storyData.author || '');
  $('#storyText').html(storyData.content || '');
  $('#storyTags').val(storyData.tags ? storyData.tags.join(', ') : '');

  // Reset state with the loaded story's data
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = storyData.variables || [];
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = storyData.variableCounts || {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = storyData.customPlaceholders || [];
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = storyData.fillValues || {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = storyData.pronounGroups || {};
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = storyData.pronounGroupCount || 0;
  _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges = false;

  // Update UI based on the loaded story
  (0,_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesFromEditor)();
};

/***/ }),

/***/ "./public/js/data/storage.js":
/*!***********************************!*\
  !*** ./public/js/data/storage.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Storage: () => (/* binding */ Storage)
/* harmony export */ });
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/state.js */ "./public/js/core/state.js");
/* harmony import */ var _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/placeholders.js */ "./public/js/core/placeholders.js");
/* harmony import */ var _ui_forms_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/forms.js */ "./public/js/ui/forms.js");
// public/js/data/storage.js




// Define the base URL for all API calls - UPDATED to be dynamic
var API_BASE_URL = function () {
  // If we're running on localhost with a specific port, use it with port 3000
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  // For all other cases (production), use the same origin with correct port
  return "".concat(window.location.protocol, "//").concat(window.location.hostname, ":3000");
}();
console.log("Using API base URL: ".concat(API_BASE_URL));
var Storage = {
  handleAjaxError: function handleAjaxError(xhr, statusText, errorThrown, customErrorMessage) {
    var errorMessage = customErrorMessage || 'Failed to perform action';
    if (xhr.status) {
      errorMessage += ". Server responded with status: ".concat(xhr.status, " ").concat(xhr.statusText);
    } else if (statusText) {
      errorMessage += ". Status text: ".concat(statusText);
    } else if (errorThrown) {
      errorMessage += ". Error: ".concat(errorThrown);
    }
    Swal.fire('Error', errorMessage, 'error');
    console.error("AJAX Error:", errorMessage, xhr);
  },
  addCurrentStoryToSavedStories: function addCurrentStoryToSavedStories() {
    var story = {
      storyTitle: $('#storyTitle').val(),
      storyAuthor: $('#storyAuthor').val(),
      storyText: $('#storyText').html(),
      variables: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
      pronounGroups: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
      variableCounts: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
      pronounGroupCount: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
      customPlaceholders: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
      tags: $('#storyTags').val() ? $('#storyTags').val().split(',').map(function (s) {
        return s.trim();
      }) : [],
      savedAt: new Date().toISOString(),
      password: data.password || null
    };
    $.ajax({
      url: "".concat(API_BASE_URL, "/api/savestory"),
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(story),
      success: function success() {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Story saved to site!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: function error(xhr, statusText, errorThrown) {
        if (xhr.status === 409) {
          Swal.fire({
            title: 'Story exists',
            text: 'A story with this title already exists. Overwrite?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, overwrite',
            cancelButtonText: 'No'
          }).then(function (result) {
            if (result.isConfirmed) {
              // Create a new story object with the overwrite flag
              var storyWithOverwrite = {
                storyTitle: data.title,
                storyAuthor: data.author,
                storyText: $('#storyText').html(),
                variables: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
                pronounGroups: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
                variableCounts: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
                pronounGroupCount: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
                customPlaceholders: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
                tags: data.tags ? data.tags.split(',').map(function (s) {
                  return s.trim();
                }) : [],
                savedAt: new Date().toISOString(),
                password: data.password || null,
                overwrite: true // Add the overwrite flag
              };
              $.ajax({
                url: "".concat(API_BASE_URL, "/api/savestory"),
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(storyWithOverwrite),
                success: function success() {
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Story overwritten!',
                    showConfirmButton: false,
                    timer: 1500
                  });
                },
                error: function error(xhrOverwrite, statusTextOverwrite, errorThrownOverwrite) {
                  Storage.handleAjaxError(xhrOverwrite, statusTextOverwrite, errorThrownOverwrite, 'Failed to overwrite story');
                }
              });
            }
          });
        } else {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save story');
        }
      }
    });
  },
  addCompletedStoryToSavedStories: function addCompletedStoryToSavedStories() {
    var story = {
      storyTitle: $('#displayTitle').text(),
      storyAuthor: $('#displayAuthor').text(),
      storyText: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyText,
      variables: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
      pronounGroups: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
      variableCounts: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
      pronounGroupCount: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
      customPlaceholders: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
      tags: $('#displayTags').text() ? $('#displayTags').text().split(',').map(function (s) {
        return s.trim();
      }) : [],
      savedAt: new Date().toISOString(),
      password: data.password || null
    };
    $.ajax({
      url: "".concat(API_BASE_URL, "/api/savestory"),
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(story),
      success: function success() {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Completed story saved to site!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: function error(xhr, statusText, errorThrown) {
        if (xhr.status === 409) {
          Swal.fire({
            title: 'Story exists',
            text: 'A story with this title already exists. Overwrite?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, overwrite',
            cancelButtonText: 'No'
          }).then(function (result) {
            if (result.isConfirmed) {
              story.overwrite = true;
              $.ajax({
                url: "".concat(API_BASE_URL, "/api/savestory"),
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(story),
                success: function success() {
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Completed story overwritten!',
                    showConfirmButton: false,
                    timer: 1500
                  });
                },
                error: function error(xhrOverwrite, statusTextOverwrite, errorThrownOverwrite) {
                  Storage.handleAjaxError(xhrOverwrite, statusTextOverwrite, errorThrownOverwrite, 'Failed to overwrite completed story');
                }
              });
            }
          });
        } else {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save completed story');
        }
      }
    });
  },
  loadSavedStoriesList: function loadSavedStoriesList() {
    var tag = $('#filterTag').val();
    var sort = $('#sortOption').val();
    $.ajax({
      url: "".concat(API_BASE_URL, "/api/getstories?tag=").concat(encodeURIComponent(tag || ''), "&sort=").concat(encodeURIComponent(sort || 'date_desc')),
      method: 'GET',
      success: function success(stories) {
        // Store the fetched stories globally for later reference
        window.savedStories = stories;
        var $listContainer = $('#savedStoriesList').empty();
        if (!stories.length) {
          $listContainer.append('<p>No stories saved yet.</p>');
          return;
        }
        stories.forEach(function (story, index) {
          var dateObj = new Date(story.savedAt);
          var dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
          var tags = story.tags && story.tags.length ? story.tags.join(', ') : 'No tags';
          var ratingDisplay = story.ratingCount ? "Rating: ".concat(story.rating.toFixed(1), " (").concat(story.ratingCount, " votes)") : 'No ratings';
          var lockIndicator = story.locked ? "<i class=\"fas fa-lock\" title=\"Password Protected\"></i> " : '';
          var item = $("\n                      <div class=\"list-group-item p-2\">\n                        <div class=\"d-flex justify-content-between align-items-center\">\n                          <div>\n                            <strong>".concat(lockIndicator).concat(story.storyTitle || 'Untitled', "</strong><br>\n                            <small>").concat(story.storyAuthor || 'Unknown', " | ").concat(dateStr, "</small><br>\n                            <small>").concat(tags, " | ").concat(ratingDisplay, "</small>\n                          </div>\n                          <div>\n                            <button class=\"btn btn-sm btn-secondary editSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Edit Story\">\n                              <i class=\"fas fa-edit\"></i>\n                            </button>\n                            <button class=\"btn btn-sm btn-success loadSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Play Story\">\n                              <i class=\"fas fa-play\"></i>\n                            </button>\n                            <button class=\"btn btn-sm btn-danger deleteSavedStoryBtn\" data-title=\"").concat(story.storyTitle, "\" aria-label=\"Delete Story\">\n                              <i class=\"fas fa-trash-alt\"></i>\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                    "));
          $listContainer.append(item);
        });
      },
      error: function error(xhr, statusText, errorThrown) {
        Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load saved stories list');
      }
    });
  },
  createSavedStoryListItem: function createSavedStoryListItem(story, index, dateStr) {
    return $("\n            <div class=\"list-group-item p-2\">\n              <div class=\"d-flex justify-content-between align-items-center\">\n                <div>\n                  <strong>".concat(story.storyTitle || 'Untitled', "</strong><br>\n                  <small>").concat(story.storyAuthor || 'Unknown', " | ").concat(dateStr, "</small>\n                </div>\n                <div>\n                  <button class=\"btn btn-sm btn-secondary editSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Edit Story\">\n                    <i class=\"fas fa-edit\"></i>\n                  </button>\n                  <button class=\"btn btn-sm btn-success loadSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Play Story\">\n                    <i class=\"fas fa-play\"></i>\n                  </button>\n                  <button class=\"btn btn-sm btn-danger deleteSavedStoryBtn\" data-title=\"").concat(story.storyTitle, "\" aria-label=\"Delete Story\">\n                    <i class=\"fas fa-trash-alt\"></i>\n                  </button>\n                </div>\n              </div>\n            </div>\n        "));
  },
  loadSavedStory: function loadSavedStory(index) {
    var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "edit";
    var stories = window.savedStories || [];
    var story = stories[index];
    if (!story) {
      Swal.fire('Error', 'Story not found.', 'error');
      return;
    }
    // NEW: If the story is locked, prompt for the password.
    if (story.locked) {
      Swal.fire({
        title: 'Enter Password',
        input: 'password',
        inputPlaceholder: 'Password',
        showCancelButton: true,
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      }).then(function (result) {
        if (result.value) {
          $.ajax({
            url: "".concat(API_BASE_URL, "/api/unlockstory"),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              storyId: story._id,
              password: result.value
            }),
            success: function success(unlockedStory) {
              Storage.populateEditorWithStory(unlockedStory, mode);
              _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentStoryId = unlockedStory._id || null;
              $('#displayStoryId').text(_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentStoryId);
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Story loaded!',
                showConfirmButton: false,
                timer: 1500
              });
            },
            error: function error(xhr, statusText, errorThrown) {
              Storage.handleAjaxError(xhr, statusText, errorThrown, 'Incorrect password or failed to unlock story');
            }
          });
        }
      });
    } else {
      Storage.populateEditorWithStory(story, mode);
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentStoryId = story._id || null;
      $('#displayStoryId').text(_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentStoryId);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Story loaded!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  },
  populateEditorWithStory: function populateEditorWithStory(story, mode) {
    $('#storyTitle').val(story.storyTitle);
    $('#storyAuthor').val(story.storyAuthor);
    $('#storyText').html(decodeHTMLEntities(story.storyText));
    // NEW: Populate tags input if editing a story.
    if (story.tags && story.tags.length) {
      $('#storyTags').val(story.tags.join(', '));
    }
    // Also store rating info in a display area (if desired)
    if (mode === "play" && story.ratingCount) {
      $('#ratingSection').show();
    } else {
      $('#ratingSection').hide();
    }
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = story.fillValues || {};
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = story.pronounGroups || {};
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = story.pronounGroupCount || 0;
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = story.customPlaceholders || [];
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesFromEditor)();
    if (mode === "edit") {
      $('#editor').removeClass('d-none');
      $('#inputs, #result').addClass('d-none');
    } else if (mode === "play") {
      (0,_ui_forms_js__WEBPACK_IMPORTED_MODULE_2__.buildFillForm)();
      $('#inputs').removeClass('d-none');
      $('#editor, #result').addClass('d-none');
    }
  },
  deleteSavedStory: function deleteSavedStory(title) {
    $.ajax({
      url: "".concat(API_BASE_URL, "/api/deletestory"),
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({
        storyTitle: title
      }),
      success: function success() {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Story deleted!',
          showConfirmButton: false,
          timer: 1500
        });
        Storage.loadSavedStoriesList();
      },
      error: function error(xhr, statusText, errorThrown) {
        Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to delete story');
      }
    });
  }
};

/***/ }),

/***/ "./public/js/handlers/events.js":
/*!**************************************!*\
  !*** ./public/js/handlers/events.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initEvents: () => (/* binding */ initEvents)
/* harmony export */ });
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/state.js */ "./public/js/core/state.js");
/* harmony import */ var _data_storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/storage.js */ "./public/js/data/storage.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils.js */ "./public/js/utils/utils.js");
/* harmony import */ var _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/typeHelpers.js */ "./public/js/utils/typeHelpers.js");
/* harmony import */ var _core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/placeholders.js */ "./public/js/core/placeholders.js");
/* harmony import */ var _ui_forms_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/forms.js */ "./public/js/ui/forms.js");
/* harmony import */ var _core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/storyProcessor.js */ "./public/js/core/storyProcessor.js");
/* harmony import */ var _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/domUtils.js */ "./public/js/utils/domUtils.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_8__);
// public/js/handlers/events.js








 // Ensure Swal is imported if used

// Handle placeholder button click
var handlePlaceholderClick = function handlePlaceholderClick(internalType, displayName) {
  if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder && _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable) {
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updateExistingPlaceholder)(_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable, internalType, displayName);
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder = false;
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable = null;
    $('#placeholderModal').modal('hide');
  } else {
    if (internalType === "PRONOUN") {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.pickPronounFormAndGroup)();
      $('#placeholderSearch').val('');
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
      return;
    }
    if (internalType.startsWith("NN")) {
      if (internalType === "NN_Person") {
        (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showPersonTypeSelection)(internalType, displayName);
        $('#placeholderSearch').val('');
        (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
        return;
      }
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showNounNumberSelection)(internalType, displayName);
      $('#placeholderSearch').val('');
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
      return;
    }
    if (internalType.startsWith("VB") || internalType === "MD") {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showVerbTenseSelection)(internalType, displayName);
      $('#placeholderSearch').val('');
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
      return;
    }
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.insertPlaceholder)(internalType, displayName, false);
    $('#placeholderSearch').val('');
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
  }
};

// Handle create new story button click
var handleCreateNewStory = function handleCreateNewStory(e) {
  e.preventDefault();
  if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges) {
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.confirmDialog({
      title: 'Unsaved changes',
      text: 'Your story has unsaved changes. Would you like to save it to the site before starting a new one?',
      showDenyButton: true,
      confirmButtonText: 'Save and start new',
      denyButtonText: 'Discard changes'
    }).then(function (result) {
      if (result.isConfirmed) {
        _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.addCurrentStoryToSavedStories();
        setTimeout(_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.resetStoryState, 1000);
      } else if (result.isDenied) {
        _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.confirmDialog({
          title: 'Are you sure?',
          text: 'This will discard your current unsaved story.',
          confirmButtonText: 'Yes, start new'
        }).then(function (res) {
          if (res.isConfirmed) (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.resetStoryState)();
        });
      }
    });
  } else {
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.confirmDialog({
      title: 'Are you sure?',
      text: 'This will discard your current story.',
      confirmButtonText: 'Yes, start new'
    }).then(function (res) {
      if (res.isConfirmed) (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.resetStoryState)();
    });
  }
};

// Handle generate story button click
var handleGenerateStory = function handleGenerateStory() {
  // Use the form validation function from forms.js
  if (!(0,_ui_forms_js__WEBPACK_IMPORTED_MODULE_5__.validateInputForm)()) {
    return; // Validation failed
  }

  // Generate the final story with replacements
  var _final = (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.generateLegacyText)();
  _final = (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.fillPlaceholders)(_final, _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables, _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues, _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups);

  // Update the result display
  $('#finalStory').text(_final);
  $('#displayTitle').text($('#storyTitle').val());
  $('#displayAuthor').text($('#storyAuthor').val());
  $('#displayTags').text($('#storyTags').val());
  $('#result').removeClass('d-none');
  $('#inputs').addClass('d-none');
};

// Handle save story to site button
var handleSaveStoryToSite = function handleSaveStoryToSite() {
  sweetalert2__WEBPACK_IMPORTED_MODULE_8___default().fire({
    title: 'Save Story',
    html: "\n      <input type=\"text\" id=\"swalTitle\" class=\"swal2-input\" placeholder=\"Story Title\" value=\"".concat($('#storyTitle').val(), "\">\n      <input type=\"text\" id=\"swalAuthor\" class=\"swal2-input\" placeholder=\"Author\" value=\"").concat($('#storyAuthor').val(), "\">\n      <input type=\"text\" id=\"swalTags\" class=\"swal2-input\" placeholder=\"Tags (comma separated)\" value=\"").concat($('#storyTags').val(), "\">\n      <input type=\"password\" id=\"swalPassword\" class=\"swal2-input\" placeholder=\"Password (optional)\">\n      <div id=\"preexistingTagsContainer\" style=\"text-align:left; margin-top:10px;\"></div>\n    "),
    didOpen: function didOpen() {
      loadPreexistingTags();
    },
    showCancelButton: true,
    confirmButtonText: 'Save',
    preConfirm: function preConfirm() {
      return {
        title: document.getElementById('swalTitle').value,
        author: document.getElementById('swalAuthor').value,
        tags: document.getElementById('swalTags').value,
        password: document.getElementById('swalPassword').value
      };
    }
  }).then(function (result) {
    if (result.isConfirmed) {
      var data = result.value;
      // Update fields in the editor
      $('#storyTitle').val(data.title);
      $('#storyAuthor').val(data.author);
      $('#storyTags').val(data.tags);
      var story = {
        storyTitle: data.title,
        storyAuthor: data.author,
        storyText: $('#storyText').html(),
        variables: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
        pronounGroups: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
        variableCounts: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
        pronounGroupCount: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
        customPlaceholders: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
        tags: data.tags ? data.tags.split(',').map(function (s) {
          return s.trim();
        }) : [],
        savedAt: new Date().toISOString(),
        password: data.password || null
      };
      $.ajax({
        url: '/api/savestory',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(story),
        success: function success() {
          _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showToast('Story saved to site!');
          _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges = false;
        },
        error: function error(xhr, statusText, errorThrown) {
          _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save story');
        }
      });
    }
  });
};

// Load preexisting tags for tag selector
var loadPreexistingTags = function loadPreexistingTags() {
  $.ajax({
    url: '/api/gettags',
    method: 'GET',
    success: function success(tags) {
      var container = $('#preexistingTagsContainer');
      container.empty();
      if (tags.length > 0) {
        container.append('<p>Select a tag:</p>');
        tags.forEach(function (tag) {
          var btn = $('<button type="button" class="btn btn-sm btn-outline-secondary m-1 preexisting-tag-btn"></button>');
          btn.text(tag);
          btn.on('click', function () {
            var current = $('#swalTags').val();
            var tagsArr = current ? current.split(',').map(function (t) {
              return t.trim();
            }).filter(Boolean) : [];
            if (!tagsArr.includes(tag)) {
              tagsArr.push(tag);
              $('#swalTags').val(tagsArr.join(', '));
            }
          });
          container.append(btn);
        });
      }
    },
    error: function error(err) {
      console.error('Failed to load preexisting tags', err);
    }
  });
};

// Attach all event handlers
var initEvents = function initEvents() {
  // Placeholder button click handler
  $(document).on('click', '.placeholder-btn', function () {
    var internalType = $(this).data('internal');
    var displayName = $(this).data('display');
    handlePlaceholderClick(internalType, displayName);
  });

  // Fill info icon click handler
  $(document).on('click', '.fill-info-icon', function (e) {
    e.stopPropagation();
    var type = $(e.currentTarget).data('type');
    var tooltip = _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_3__.TypeHelpers.getTooltipForType(type);
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showToast(tooltip, 'info');
  });

  // Show more toggle event handler
  $(document).on('click', '.show-more-toggle', function () {
    var parentList = $(this).closest('.list-group');
    var hiddenItems = parentList.find('.secondary-placeholder-wrapper .secondary-placeholder');
    var link = $(this);
    link.text(link.text() === 'Show More' ? 'Show Less' : 'Show More');
    hiddenItems.toggle();
  });

  // Add copy to clipboard handler
  $('#copyStory').on('click', function () {
    var finalText = $('#finalStory').text();
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.copyTextToClipboard(finalText);
  });

  // Selection changes
  document.addEventListener('selectionchange', function () {
    var editor = document.getElementById("storyText");
    var sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = sel.getRangeAt(0);
    }
  });

  // Attach search handlers with a reduced debounce delay (50ms)
  $('#placeholderSearch').on('input', _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.debounce(function () {
    var searchVal = $(this).val();
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', searchVal);
    $('#addCustomPlaceholderBtn').text('Add "' + searchVal + '"');
  }, 50));
  $('#modalPlaceholderSearch').on('input', _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.debounce(function () {
    var searchVal = $(this).val();
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#modalPlaceholderAccordion', '#modalNoResults', searchVal);
    $('#modalAddCustomPlaceholderBtn').text('Add "' + searchVal + '"');
  }, 50));

  // Init accordions
  (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
  (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#modalPlaceholderAccordion', '#modalNoResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentModalPlaceholderSearch);

  // Filter tag input handler
  $('#filterTag').on('input', _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.debounce(function () {
    _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.loadSavedStoriesList();
  }, 300));

  // Sort option change handler
  $('#sortOption').on('change', function () {
    _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.loadSavedStoriesList();
  });

  // Alphabetical order button
  $('#alphabeticalOrderBtn').on('click', function () {
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder = 'alphabetical';
    $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
    $('#randomOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
    (0,_ui_forms_js__WEBPACK_IMPORTED_MODULE_5__.buildFillForm)();
  });

  // Random order button
  $('#randomOrderBtn').on('click', function () {
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder = 'random';
    $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
    $('#alphabeticalOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
    (0,_ui_forms_js__WEBPACK_IMPORTED_MODULE_5__.buildFillForm)();
  });

  // Tag autocomplete
  $("#filterTag").autocomplete({
    source: function source(request, response) {
      $.ajax({
        url: '/api/gettags',
        method: 'GET',
        dataType: 'json',
        success: function success(tags) {
          var filteredTags = $.ui.autocomplete.filter(tags, request.term);
          response(filteredTags);
        },
        error: function error(err) {
          console.error('Failed to load tags for autocomplete', err);
          response([]);
        }
      });
    },
    minLength: 1,
    select: function select(event, ui) {
      $("#filterTag").val(ui.item.value);
      $("#applyFilters").click();
      return false;
    }
  });

  // Apply filters button
  $('#applyFilters').on('click', function () {
    _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.loadSavedStoriesList();
  });

  // Share story button
  $('#shareStory').on('click', function () {
    var finalText = $('#finalStory').text();
    var title = $('#displayTitle').text();
    var author = $('#displayAuthor').text();
    var content = (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.formatStoryForExport)(title, author, finalText);
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.copyToClipboard(content).then(function (success) {
      if (success) {
        _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showToast('Story copied to clipboard!');
      } else {
        _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showError('Copy Failed', 'Failed to copy story. Please copy manually.');
      }
    });
  });

  // Story editor input event
  $('#storyText').on('input', function () {
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updateVariablesFromEditor)();
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges = true;
  });

  // Upload story button
  $('#uploadStoryBtn').on('click', function () {
    $('#uploadStory').click();
  });
  $('#uploadStory').on('change', function () {
    var file = this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var content = e.target.result;
      var storyData = (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.parseStoryFile)(content);
      $('#storyTitle').val(storyData.title);
      $('#storyAuthor').val(storyData.author);
      $('#storyText').html(storyData.content);

      // Reset state
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = 0;
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = {};
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = {};
      _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = [];
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updateVariablesFromEditor)();
    };
    reader.readAsText(file);
  });

  // Start game button
  $('#startGame').on('click', function () {
    var content = $('#storyText').html();
    if (!content.trim()) {
      _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showError('Empty Story', 'Please write a story before continuing.');
      return;
    }
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updateVariablesFromEditor)();
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyText = (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.generateLegacyText)();
    if (!_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.length) {
      _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showError('No Placeholders', 'No placeholders found in the story.');
      return;
    }
    (0,_ui_forms_js__WEBPACK_IMPORTED_MODULE_5__.buildFillForm)();
    $('#inputs').removeClass('d-none');
    $('#editor').addClass('d-none');
  });

  // Generate story button
  $('#generateStory').on('click', handleGenerateStory);

  // Create new story buttons
  $('#createNewStory2, #createNewStory').on('click', handleCreateNewStory);

  // Story editing flow buttons
  $('#editStoryEntries').on('click', function () {
    (0,_ui_forms_js__WEBPACK_IMPORTED_MODULE_5__.buildFillForm)();
    $('#result').addClass('d-none');
    $('#inputs').removeClass('d-none');
  });
  $('#backToEditor, #backToEditor2').on('click', function () {
    $('#result, #inputs').addClass('d-none');
    $('#editor').removeClass('d-none');
  });

  // Save story to site button
  $('#saveStoryToSite').on('click', handleSaveStoryToSite);

  // Download story button
  $('#downloadStory').on('click', function () {
    var finalText = $('#finalStory').text();
    var title = $('#displayTitle').text();
    var author = $('#displayAuthor').text();
    var content = (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.formatStoryForExport)(title, author, finalText);
    var fileName = (0,_core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_6__.createFilenameFromTitle)(title);
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.downloadTextFile(content, fileName);
  });

  // Saved stories buttons
  $('#mySavedStoriesBtn').on('click', function () {
    _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.loadSavedStoriesList();
    $('#savedStoriesModal').modal('show');
  });
  $(document).on('click', '.loadSavedStoryBtn', function () {
    var index = $(this).data('index');
    $('#savedStoriesModal').modal('hide');
    _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.loadSavedStory(index, "play");
  });
  $(document).on('click', '.editSavedStoryBtn', function () {
    var index = $(this).data('index');
    $('#savedStoriesModal').modal('hide');
    _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.loadSavedStory(index, "edit");
  });
  $(document).on('click', '.deleteSavedStoryBtn', function () {
    var title = $(this).data('title');
    _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.confirmDialog({
      title: 'Delete Story?',
      text: 'Are you sure you want to delete this saved story?',
      confirmButtonText: 'Yes, delete it!'
    }).then(function (result) {
      if (result.isConfirmed) _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.deleteSavedStory(title);
    });
  });

  // Rating submission
  $('#submitRating').on('click', function () {
    var rating = parseInt($('#storyRating').val(), 10);
    if (!_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentStoryId) {
      _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showError('Error', 'Story ID not found.');
      return;
    }
    $.ajax({
      url: '/api/rateStory',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        storyId: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentStoryId,
        rating: rating
      }),
      success: function success(data) {
        _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_7__.showToast("Thank you for rating! New average: ".concat(data.rating.toFixed(1), " (").concat(data.ratingCount, " votes)"));
      },
      error: function error(xhr, statusText, errorThrown) {
        _data_storage_js__WEBPACK_IMPORTED_MODULE_1__.Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to rate story');
      }
    });
  });

  // Editor key handling for placeholders
  $('#storyText').on('keydown', function (e) {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var range = sel.getRangeAt(0);
      if (e.key === "ArrowRight") {
        var node = sel.anchorNode;
        if (node.nodeType === Node.TEXT_NODE && node.parentNode.classList.contains('placeholder')) {
          if (sel.anchorOffset >= node.nodeValue.length) {
            e.preventDefault();
            var placeholder = node.parentNode;
            var newRange = document.createRange();
            newRange.setStartAfter(placeholder);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        }
      }
      if (e.key === "Backspace") {
        var _node = sel.anchorNode;
        if (_node.nodeType === Node.TEXT_NODE && _node.parentNode.classList.contains('placeholder') && sel.anchorOffset === 0) {
          e.preventDefault();
          var _placeholder = _node.parentNode;
          var _newRange = document.createRange();
          _newRange.setStartBefore(_placeholder);
          _newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(_newRange);
        }
      }
    }
  });

  // Add placeholder button
  $('#addPlaceholderBtn').on('click', function () {
    $('#placeholderModal').modal('show');
  });

  // Click handler for existing placeholders
  document.getElementById('existingPlaceholdersContainer').addEventListener('click', function (e) {
    var btn = e.target.closest('.placeholder-item');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var variable = _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.find(function (v) {
      return v.id === id;
    });
    if (variable) (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.duplicatePlaceholder)(variable);
  });

  // Add custom placeholder button
  $('#addCustomPlaceholderBtn').on('click', function () {
    var raw = $('#placeholderSearch').val();
    var usage = $('input[name="customPlaceholderType"]:checked').val() || "generic";
    if (usage === "noun") {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.addNewCustomPlaceholderWithUsage)(raw, "noun");
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showNounNumberSelection)("NN_" + _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.pascalCase(raw), _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(raw));
    } else if (usage === "verb") {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.addNewCustomPlaceholderWithUsage)(raw, "verb");
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showVerbTenseSelection)("VB_" + _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.pascalCase(raw), _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(raw));
    } else {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.addNewCustomPlaceholder)(raw);
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.insertPlaceholderFromCustom)(raw);
    }
    $('#placeholderSearch').val('');
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#placeholderAccordion', '#noResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderSearch);
  });

  // Modal add custom placeholder button
  $('#modalAddCustomPlaceholderBtn').on('click', function () {
    var raw = $('#modalPlaceholderSearch').val();
    var usage = $('input[name="modalCustomPlaceholderType"]:checked').val() || "generic";
    if (usage === "noun") {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.addNewCustomPlaceholderWithUsage)(raw, "noun");
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showNounNumberSelection)("NN_" + _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.pascalCase(raw), _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(raw));
    } else if (usage === "verb") {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.addNewCustomPlaceholderWithUsage)(raw, "verb");
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.showVerbTenseSelection)("VB_" + _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.pascalCase(raw), _utils_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(raw));
    } else {
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.addNewCustomPlaceholder)(raw);
      (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.insertPlaceholderFromCustom)(raw);
    }
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#modalPlaceholderAccordion', '#modalNoResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentModalPlaceholderSearch);
    $('#placeholderModal').modal('hide');
    $('#modalPlaceholderSearch').val('');
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__.updatePlaceholderAccordion)('#modalPlaceholderAccordion', '#modalNoResults', _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentModalPlaceholderSearch);
  });
};

/***/ }),

/***/ "./public/js/ui/forms.js":
/*!*******************************!*\
  !*** ./public/js/ui/forms.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildFillForm: () => (/* binding */ buildFillForm),
/* harmony export */   validateInputForm: () => (/* binding */ validateInputForm)
/* harmony export */ });
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/state.js */ "./public/js/core/state.js");
/* harmony import */ var _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/typeHelpers.js */ "./public/js/utils/typeHelpers.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// public/js/ui/forms.js



// ====================================================
// BUILD THE FILL-IN-THE-BLANK FORM
// ====================================================
var buildFillForm = function buildFillForm() {
  var form = $('#inputForm').empty();
  appendPronounGroupsToForm(form);
  appendNonPronounVariablesToForm(form);
};
var appendPronounGroupsToForm = function appendPronounGroupsToForm(form) {
  var groupSet = getPronounGroups();
  var sortedGroups = Array.from(groupSet).sort(function (a, b) {
    return a.localeCompare(b);
  });
  if (sortedGroups.length > 0) {
    form.append("<h4>Pronouns</h4>");
    sortedGroups.forEach(function (g) {
      var block = createPronounGroupBlock(g);
      form.append(block);
    });
    form.on('change', "input[type='radio']", handlePronounChoiceChange);
  }
};
var getPronounGroups = function getPronounGroups() {
  var groupSet = new Set();
  var _iterator = _createForOfIteratorHelper(_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var v = _step.value;
      if (v.internalType.startsWith('PRONOUN|')) {
        var parts = v.internalType.split('|');
        groupSet.add(parts[1]);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return groupSet;
};
var createPronounGroupBlock = function createPronounGroupBlock(groupName) {
  var block = $("\n      <div class='form-group'>\n        <label id='".concat(groupName, "-label' title=\"Hover to see internal ID\">\n          ").concat(groupName, " - Person (select pronoun)\n          <i class=\"fas fa-info-circle fill-info-icon\" data-type=\"").concat(groupName, "\" style=\"font-size:0.8em; margin-left:5px;\"></i>\n        </label>\n      </div>\n    "));
  var radios = "\n      <div class='form-check'>\n        <input type='radio' class='form-check-input' name='".concat(groupName, "-choice' value='HeHim'>\n        <label class='form-check-label'>He/Him</label>\n      </div>\n      <div class='form-check'>\n        <input type='radio' class='form-check-input' name='").concat(groupName, "-choice' value='SheHer'>\n        <label class='form-check-label'>She/Her</label>\n      </div>\n      <div class='form-check'>\n        <input type='radio' class='form-check-input' name='").concat(groupName, "-choice' value='TheyThem'>\n        <label class='form-check-label'>They/Them</label>\n      </div>\n      <div class='form-check mb-2'>\n        <input type='radio' class='form-check-input' name='").concat(groupName, "-choice' value='Custom'>\n        <label class='form-check-label'>Custom</label>\n      </div>\n      <input type='text' class='form-control form-control-sm d-none' id='").concat(groupName, "-custom'\n        placeholder='comma-separated: subject, object, possAdj, possPron, reflexive'>\n    ");
  block.append(radios);
  return block;
};
var handlePronounChoiceChange = function handlePronounChoiceChange() {
  var groupName = $(this).attr('name').replace('-choice', '');
  if ($(this).val() === 'Custom') {
    $("#".concat(groupName, "-custom")).removeClass('d-none');
  } else {
    $("#".concat(groupName, "-custom")).addClass('d-none');
  }
};
var appendNonPronounVariablesToForm = function appendNonPronounVariablesToForm(form) {
  var nonPronounVars = _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.filter(function (v) {
    return !v.internalType.startsWith('PRONOUN|');
  });
  if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder === 'alphabetical') {
    nonPronounVars.sort(function (a, b) {
      return a.officialDisplay.localeCompare(b.officialDisplay);
    });
  } else if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder === 'random') {
    nonPronounVars.sort(function () {
      return Math.random() - 0.5;
    });
  }
  nonPronounVars.forEach(function (variable) {
    var groupRow = createInputRow(variable);
    form.append(groupRow);
  });
};
var createInputRow = function createInputRow(variable) {
  var groupRow = $("\n      <div class=\"form-group input-row\">\n        <div class=\"row\">\n          <div class=\"col-sm-4\">\n            <label class=\"input-label\" title=\"Internal ID: ".concat(variable.id, "\">\n              ").concat(variable.officialDisplay, "\n            </label>\n          </div>\n          <div class=\"col-sm-8\">\n            <input type=\"text\"\n              class=\"form-control form-control-sm compact-input\"\n              name=\"").concat(variable.id, "\"\n              data-label=\"").concat(variable.officialDisplay, "\">\n          </div>\n        </div>\n      </div>\n    "));
  if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues[variable.id]) {
    groupRow.find('input').val(_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues[variable.id]);
  }
  return groupRow;
};

// Add the missing validateInputForm function to forms.js

var validateInputForm = function validateInputForm(formData) {
  // Input validation logic
  if (!formData.display || formData.display.trim() === '') {
    return {
      valid: false,
      message: 'Display name is required'
    };
  }
  if (!formData.internalType || formData.internalType.trim() === '') {
    return {
      valid: false,
      message: 'Internal type is required'
    };
  }
  return {
    valid: true
  };
};

/***/ }),

/***/ "./public/js/ui/menu.js":
/*!******************************!*\
  !*** ./public/js/ui/menu.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPlaceholderEditMenu: () => (/* binding */ getPlaceholderEditMenu),
/* harmony export */   getSelectionMenu: () => (/* binding */ getSelectionMenu),
/* harmony export */   handleDeletePlaceholder: () => (/* binding */ handleDeletePlaceholder),
/* harmony export */   handleEditOverride: () => (/* binding */ handleEditOverride),
/* harmony export */   handleEditPlaceholder: () => (/* binding */ handleEditPlaceholder),
/* harmony export */   handleNewPlaceholder: () => (/* binding */ handleNewPlaceholder),
/* harmony export */   handlePlaceholderClick: () => (/* binding */ handlePlaceholderClick),
/* harmony export */   handleReusePlaceholder: () => (/* binding */ handleReusePlaceholder),
/* harmony export */   handleTextSelection: () => (/* binding */ handleTextSelection),
/* harmony export */   hideAllMenus: () => (/* binding */ hideAllMenus),
/* harmony export */   hideMenu: () => (/* binding */ hideMenu),
/* harmony export */   initMenuSystem: () => (/* binding */ initMenuSystem),
/* harmony export */   initMenus: () => (/* binding */ initMenus),
/* harmony export */   positionMenu: () => (/* binding */ positionMenu)
/* harmony export */ });
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/state.js */ "./public/js/core/state.js");
/* harmony import */ var _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/placeholders.js */ "./public/js/core/placeholders.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Start of Selection
// public/js/ui/menu.js



// Menu element references
var selectionMenu;
var placeholderEditMenu;

// Helper function to position menu near an element
var positionMenu = function positionMenu(menu, rect) {
  menu.style.display = 'block';
  var menuWidth = menu.offsetWidth;
  var menuHeight = menu.offsetHeight;
  var offset = 5;
  var desiredTop = rect.bottom + offset + menuHeight <= window.innerHeight ? window.scrollY + rect.bottom + offset : window.scrollY + rect.top - menuHeight - offset;
  var desiredLeft = window.scrollX + rect.left + rect.width / 2 - menuWidth / 2;
  desiredLeft = Math.max(window.scrollX + 5, Math.min(desiredLeft, window.scrollX + window.innerWidth - menuWidth - 5));
  menu.style.top = desiredTop + 'px';
  menu.style.left = desiredLeft + 'px';
};

// Hide a menu
var hideMenu = function hideMenu(menu) {
  menu.style.display = 'none';
};

// Hide all menus
var hideAllMenus = function hideAllMenus() {
  hideMenu(selectionMenu);
  hideMenu(placeholderEditMenu);
};

// Reset current editing state
var resetCurrentEditing = function resetCurrentEditing() {
  _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable = null;
  _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement = null;
};

// Initialize the context menus
var initMenus = function initMenus() {
  // Create selection menu for text selections
  selectionMenu = document.createElement('div');
  selectionMenu.id = 'textSelectionMenu';
  Object.assign(selectionMenu.style, {
    position: 'absolute',
    display: 'none',
    zIndex: '1000',
    background: '#fff',
    border: '1px solid #ccc',
    padding: '5px',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
  });
  selectionMenu.innerHTML = "\n        <button id=\"newPlaceholderBtn\" class=\"btn btn-sm btn-primary\">New Placeholder</button>\n        <button id=\"reusePlaceholderBtn\" class=\"btn btn-sm btn-secondary\">Reuse Placeholder</button>\n      ";
  document.body.appendChild(selectionMenu);

  // Create placeholder edit menu for modifying existing placeholders
  placeholderEditMenu = document.createElement('div');
  placeholderEditMenu.id = 'placeholderEditMenu';
  Object.assign(placeholderEditMenu.style, {
    position: 'absolute',
    display: 'none',
    zIndex: '1000',
    background: '#fff',
    border: '1px solid #ccc',
    padding: '5px',
    borderRadius: '4px',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
  });
  placeholderEditMenu.innerHTML = "\n        <button id=\"editPlaceholderBtn\" class=\"btn btn-sm btn-primary\">Change Placeholder</button>\n        <button id=\"editOverrideBtn\" class=\"btn btn-sm btn-secondary\">Change Override</button>\n        <button id=\"deletePlaceholderBtn\" class=\"btn btn-sm btn-danger\">Delete</button>\n      ";
  document.body.appendChild(placeholderEditMenu);

  // Attach event listeners
  attachMenuEventListeners();
};

// Handle text selection to show the selection menu
var handleTextSelection = function handleTextSelection() {
  setTimeout(function () {
    var sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      if (sel.anchorNode && sel.anchorNode.parentNode && !sel.anchorNode.parentNode.classList.contains('placeholder')) {
        _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = sel.getRangeAt(0);
        var rect = _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange.getBoundingClientRect();
        positionMenu(selectionMenu, rect);
      }
    } else {
      hideMenu(selectionMenu);
    }
  }, 0);
};

// Show the placeholder edit menu when a placeholder is clicked
var handlePlaceholderClick = function handlePlaceholderClick(e) {
  if (e.target.classList.contains('placeholder')) {
    // Stop propagation so that other handlers (e.g. selection menu) do not interfere
    e.stopPropagation();
    // Find the corresponding variable using the data-id attribute
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable = _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.find(function (v) {
      return v.id === e.target.getAttribute('data-id');
    });
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement = e.target;
    // Position the placeholder edit menu near the clicked element
    positionMenu(placeholderEditMenu, e.target.getBoundingClientRect());
  }
};

// Handle delete button click in placeholder edit menu
var handleDeletePlaceholder = function handleDeletePlaceholder() {
  hideMenu(placeholderEditMenu);
  if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement) {
    _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement.remove();
  }
  // Update the variables in the editor after deletion
  if (typeof _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesFromEditor === 'function') {
    (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesFromEditor)();
  }
  resetCurrentEditing();
};

// Handle edit placeholder button click
var handleEditPlaceholder = function handleEditPlaceholder() {
  hideMenu(placeholderEditMenu);
  _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEditingPlaceholder = true;
  // Open the modal so the user can select a new placeholder type
  $('#placeholderModal').modal('show');
  resetCurrentEditing();
};

// Handle edit override button click
var handleEditOverride = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _yield$Swal$fire, newOverride;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          hideMenu(placeholderEditMenu);
          _context.next = 3;
          return Swal.fire({
            title: 'Change Override',
            input: 'text',
            inputLabel: 'Enter new override text',
            inputValue: _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement ? _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement.textContent : ''
          });
        case 3:
          _yield$Swal$fire = _context.sent;
          newOverride = _yield$Swal$fire.value;
          if (newOverride !== undefined) {
            if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement) {
              _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentPlaceholderElement.textContent = newOverride;
            }
            if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable) {
              _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].currentEditingVariable.displayOverride = newOverride;
            }
            if (typeof _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesList === 'function') {
              (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.updateVariablesList)();
            }
          }
          resetCurrentEditing();
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function handleEditOverride() {
    return _ref.apply(this, arguments);
  };
}();

// Handle "New Placeholder" button click
var handleNewPlaceholder = function handleNewPlaceholder() {
  hideMenu(selectionMenu);
  $('#placeholderModal').modal('show');
};

// Handle "Reuse Placeholder" button click
var handleReusePlaceholder = function handleReusePlaceholder() {
  hideMenu(selectionMenu);
  if (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.length === 0) {
    Swal.fire('No existing placeholders', 'There are no placeholders to reuse yet.', 'info');
    return;
  }
  var sortedVariables = _toConsumableArray(_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables).sort(function (a, b) {
    return (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[b.id] || 0) - (_core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[a.id] || 0) || a.order - b.order;
  });
  var html = "<div id=\"reusePlaceholderContainer\" style=\"display: flex; flex-wrap: wrap;\">";
  sortedVariables.forEach(function (v) {
    var displayText = v.displayOverride || v.officialDisplay;
    html += "<button type=\"button\" \n                       class=\"btn btn-outline-secondary btn-sm m-1 reuse-placeholder-btn\" \n                       data-id=\"".concat(v.id, "\" \n                       title=\"").concat(v.id, "\">\n                 ").concat(displayText, "\n               </button>");
  });
  html += "</div>";
  Swal.fire({
    title: 'Select a placeholder to reuse',
    html: html,
    showCancelButton: true,
    showConfirmButton: false,
    didOpen: function didOpen() {
      var container = Swal.getHtmlContainer();
      var btns = container.querySelectorAll('.reuse-placeholder-btn');
      btns.forEach(function (button) {
        button.addEventListener('click', function () {
          var id = button.getAttribute('data-id');
          var variable = _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.find(function (v) {
            return v.id === id;
          });
          if (variable) (0,_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.duplicatePlaceholder)(variable);
          Swal.close();
        });
      });
    }
  });
};

// Attach event listeners to the menu elements
var attachMenuEventListeners = function attachMenuEventListeners() {
  // Click outside menus to close them
  document.addEventListener('click', function (e) {
    if (!selectionMenu.contains(e.target) && !placeholderEditMenu.contains(e.target)) {
      hideAllMenus();
    }
  });

  // Text selection events
  document.getElementById('storyText').addEventListener('mouseup', handleTextSelection);

  // Placeholder click events
  document.getElementById('storyText').addEventListener('click', handlePlaceholderClick);

  // Menu button event handlers
  document.getElementById('newPlaceholderBtn').addEventListener('click', handleNewPlaceholder);
  document.getElementById('reusePlaceholderBtn').addEventListener('click', handleReusePlaceholder);
  document.getElementById('editPlaceholderBtn').addEventListener('click', handleEditPlaceholder);
  document.getElementById('editOverrideBtn').addEventListener('click', handleEditOverride);
  document.getElementById('deletePlaceholderBtn').addEventListener('click', handleDeletePlaceholder);
};

// Export menu elements for external access if needed
var getSelectionMenu = function getSelectionMenu() {
  return selectionMenu;
};
var getPlaceholderEditMenu = function getPlaceholderEditMenu() {
  return placeholderEditMenu;
};

// Export the initialization of menus to be called from main.js
var initMenuSystem = function initMenuSystem() {
  // Create menus if they don't exist yet
  if (!selectionMenu || !placeholderEditMenu) {
    initMenus();
  }
};

/***/ }),

/***/ "./public/js/utils/domUtils.js":
/*!*************************************!*\
  !*** ./public/js/utils/domUtils.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearForm: () => (/* binding */ clearForm),
/* harmony export */   confirmDialog: () => (/* binding */ confirmDialog),
/* harmony export */   copyTextToClipboard: () => (/* binding */ copyTextToClipboard),
/* harmony export */   copyToClipboard: () => (/* binding */ copyToClipboard),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   downloadTextFile: () => (/* binding */ downloadTextFile),
/* harmony export */   fallbackCopyTextToClipboard: () => (/* binding */ fallbackCopyTextToClipboard),
/* harmony export */   getElementValue: () => (/* binding */ getElementValue),
/* harmony export */   getFormData: () => (/* binding */ getFormData),
/* harmony export */   setElementValue: () => (/* binding */ setElementValue),
/* harmony export */   showError: () => (/* binding */ showError),
/* harmony export */   showToast: () => (/* binding */ showToast),
/* harmony export */   showView: () => (/* binding */ showView),
/* harmony export */   toggleClass: () => (/* binding */ toggleClass),
/* harmony export */   toggleVisibility: () => (/* binding */ toggleVisibility)
/* harmony export */ });
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// public/js/utils/domUtils.js

/**
 * DOM utility functions for working with the story editor and UI
 */

// Show a confirmation dialog using SweetAlert
var confirmDialog = function confirmDialog(options) {
  var defaultOptions = {
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  };
  var finalOptions = _objectSpread(_objectSpread({}, defaultOptions), options);
  return Swal.fire(finalOptions);
};

// Show a toast notification
var showToast = function showToast(title) {
  var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var timer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1500;
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
var showError = function showError(title) {
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  Swal.fire({
    title: title,
    text: text,
    icon: 'error'
  });
};

// Toggle element visibility
var toggleVisibility = function toggleVisibility(selector, isVisible) {
  var element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) {
    element.style.display = isVisible ? '' : 'none';
  }
};

// Toggle class on element
var toggleClass = function toggleClass(selector, className, shouldAdd) {
  var element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) {
    if (shouldAdd) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
};

// Show/hide multiple elements by class
var showView = function showView(viewName) {
  // Hide all view containers
  document.querySelectorAll('.view-container').forEach(function (el) {
    el.classList.add('d-none');
  });

  // Show the requested view
  document.getElementById(viewName).classList.remove('d-none');
};

// Create element with attributes and content
var createElement = function createElement(tag) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var element = document.createElement(tag);

  // Set attributes
  for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && _typeof(value) === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      var eventName = key.substring(2).toLowerCase();
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
  children.forEach(function (child) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  return element;
};

// Get DOM element value safely (with default)
var getElementValue = function getElementValue(selector) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var element = document.querySelector(selector);
  if (!element) return defaultValue;
  if (element.type === 'checkbox') {
    return element.checked;
  } else if (element.type === 'radio') {
    var checkedEl = document.querySelector("".concat(selector, ":checked"));
    return checkedEl ? checkedEl.value : defaultValue;
  } else {
    return element.value || defaultValue;
  }
};

// Set DOM element value safely
var setElementValue = function setElementValue(selector, value) {
  var element = document.querySelector(selector);
  if (!element) return;
  if (element.type === 'checkbox') {
    element.checked = !!value;
  } else if (element.type === 'radio') {
    var radio = document.querySelector("".concat(selector, "[value=\"").concat(value, "\"]"));
    if (radio) radio.checked = true;
  } else {
    element.value = value;
  }
};

// Get form data as object
var getFormData = function getFormData(formSelector) {
  var form = document.querySelector(formSelector);
  if (!form) return {};
  var formData = new FormData(form);
  var data = {};
  var _iterator = _createForOfIteratorHelper(formData.entries()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        key = _step$value[0],
        value = _step$value[1];
      data[key] = value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return data;
};

// Clear form fields
var clearForm = function clearForm(formSelector) {
  var form = document.querySelector(formSelector);
  if (!form) return;
  form.reset();

  // Also clear any custom fields that might not be cleared by reset
  form.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select').forEach(function (el) {
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = false;
    } else {
      el.value = '';
    }
  });
};

// Copy text to clipboard
var copyToClipboard = function copyToClipboard(text) {
  return new Promise(function (resolve, reject) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        resolve(true);
      })["catch"](function (err) {
        console.error('Error copying text: ', err);
        var success = fallbackCopyTextToClipboard(text);
        resolve(success);
      });
    } else {
      var success = fallbackCopyTextToClipboard(text);
      resolve(success);
    }
  });
};

// Fallback method for copying text to clipboard
var fallbackCopyTextToClipboard = function fallbackCopyTextToClipboard(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    var successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    document.body.removeChild(textarea);
    return false;
  }
};

// Download text as file
var downloadTextFile = function downloadTextFile(content, filename) {
  var blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
};

// Advanced copy to clipboard function
var copyTextToClipboard = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(content) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!navigator.clipboard) {
            _context.next = 14;
            break;
          }
          _context.prev = 1;
          _context.next = 4;
          return navigator.clipboard.writeText(content);
        case 4:
          showToast('Copied to clipboard!');
          return _context.abrupt("return", true);
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error copying text: ', _context.t0);
          return _context.abrupt("return", fallbackCopyTextToClipboard(content));
        case 12:
          _context.next = 15;
          break;
        case 14:
          return _context.abrupt("return", fallbackCopyTextToClipboard(content));
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 8]]);
  }));
  return function copyTextToClipboard(_x) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./public/js/utils/typeHelpers.js":
/*!****************************************!*\
  !*** ./public/js/utils/typeHelpers.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TypeHelpers: () => (/* binding */ TypeHelpers)
/* harmony export */ });
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/state.js */ "./public/js/core/state.js");
/* harmony import */ var _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/placeholders.js */ "./public/js/core/placeholders.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./public/js/utils/utils.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// public/js/utils/typeHelpers.js




var TypeHelpers = {
  naturalizeType: function naturalizeType(type) {
    if (type.startsWith("NNPS")) {
      var sub = type.substring(4);
      if (sub.startsWith("_")) sub = sub.substring(1);
      sub = sub.replace(/\d+$/, '');
      if (sub.toLowerCase() === "person") {
        return "Person (proper, plural)";
      }
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(sub || "Proper Noun")) + " (Plural)";
    }
    if (type.startsWith("NNP")) {
      var _sub = type.substring(3);
      if (_sub.startsWith("_")) _sub = _sub.substring(1);
      _sub = _sub.replace(/\d+$/, '');
      if (_sub.toLowerCase() === "person") {
        return "Person (proper, singular)";
      }
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub || "Proper Noun")) + " (Singular)";
    }
    if (type.startsWith("NNS")) {
      var _sub2 = type.substring(3);
      if (_sub2.startsWith("_")) _sub2 = _sub2.substring(1);
      _sub2 = _sub2.replace(/\d+$/, '');
      if (_sub2.toLowerCase() === "person") {
        return "Person (common, plural)";
      }
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub2 || "Common Noun")) + " (Plural)";
    }
    if (type.startsWith("NN")) {
      var _sub3 = type.substring(2);
      if (_sub3.startsWith("_")) _sub3 = _sub3.substring(1);
      _sub3 = _sub3.replace(/\d+$/, '');
      if (_sub3.toLowerCase() === "person") {
        return "Person (common, singular)";
      }
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub3 || "Common Noun")) + " (Singular)";
    }
    if (type.startsWith("NNS")) {
      var _sub4 = type.substring(3);
      if (_sub4.startsWith("_")) _sub4 = _sub4.substring(1);
      _sub4 = _sub4.replace(/\d+$/, '');
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub4 || "Common Noun")) + " (Plural)";
    }
    if (type.startsWith("NN")) {
      var _sub5 = type.substring(2);
      if (_sub5.startsWith("_")) _sub5 = _sub5.substring(1);
      _sub5 = _sub5.replace(/\d+$/, '');
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub5 || "Common Noun")) + " (Singular)";
    }
    if (type === "Onomatopoeia") return "Onomatopoeia";
    if (type.startsWith("MD_")) {
      var tense = type.substring(3);
      var tenseNatural = "";
      switch (tense) {
        case "VB":
          tenseNatural = "Base (run)";
          break;
        case "VBP":
          tenseNatural = "Present (I walk)";
          break;
        case "VBZ":
          tenseNatural = "3rd Person (he leaves)";
          break;
        case "VBD":
          tenseNatural = "Past (slept)";
          break;
        case "VBG":
          tenseNatural = "Gerund (crying)";
          break;
        case "VBN":
          tenseNatural = "Past Participle (eaten)";
          break;
        default:
          tenseNatural = tense;
      }
      return "Modal Verb (" + tenseNatural + ")";
    }
    var verbTenseMap = {
      "VBZ": "3rd Person (he leaves)",
      "VBD": "Past Tense (slept)",
      "VBG": "Gerund (crying)",
      "VBN": "Past Participle (eaten)",
      "VBP": "Present (I walk)"
    };
    for (var _tense in verbTenseMap) {
      if (type.startsWith(_tense)) {
        var remainder = type.substring(_tense.length);
        var category = "";
        if (remainder.startsWith("_")) {
          category = remainder.substring(1);
        }
        return category ? _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(category) + " Verb (" + verbTenseMap[_tense] + ")" : "Verb (" + verbTenseMap[_tense] + ")";
      }
    }
    if (type.startsWith("VB")) {
      var rest = type.substring(2).replace(/^_+/, "");
      return rest ? _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(rest) + " Verb (Base Form)" : "Verb (Base Form)";
    }
    if (type.startsWith("JJ_")) {
      var _sub6 = type.substring(3);
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub6));
    }
    if (type.startsWith("JJS_")) {
      var _sub7 = type.substring(4);
      if (_sub7.toLowerCase() === "ordinal") {
        return "Ordinal Number";
      }
      return _utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_2__.Utils.naturalDisplay(_sub7)) + " Superlative Adjective";
    }
    if (type === "JJ") return "Adjective";
    if (type === "JJR") return "Comparative Adjective";
    if (type === "JJS") return "Superlative Adjective";
    if (type === "RB") return "Adverb";
    if (type === "RBR") return "Comparative Adverb";
    if (type === "RBS") return "Superlative Adverb";
    if (type === "WRB") return "WH-adverb";
    if (type === "CC") return "Coordinating Conjunction";
    if (type === "PDT") return "Pre-determiner";
    if (type === "WDT") return "WH-determiner";
    if (type === "FW") return "Foreign Word";
    if (type === "Number") return "Number";
    if (type === "Exclamation") return "Exclamation";
    return type;
  },
  getTooltipForType: function getTooltipForType(type) {
    var normalizedType = type.trim().toLowerCase();
    for (var category in _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.allPlaceholders) {
      var _iterator = _createForOfIteratorHelper(_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.allPlaceholders[category]),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          if (p.internalType.trim().toLowerCase() === normalizedType) {
            return p.tooltip;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    var verbTensePrefixes = ["VBZ", "VBD", "VBG", "VBN", "VBP"];
    for (var _i = 0, _verbTensePrefixes = verbTensePrefixes; _i < _verbTensePrefixes.length; _i++) {
      var prefix = _verbTensePrefixes[_i];
      if (normalizedType.startsWith(prefix.toLowerCase() + "_")) {
        var baseType = "vb_" + normalizedType.substring(prefix.length + 1);
        for (var _category in _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.allPlaceholders) {
          var _iterator2 = _createForOfIteratorHelper(_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.allPlaceholders[_category]),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _p = _step2.value;
              if (_p.internalType.trim().toLowerCase() === baseType) {
                return _p.tooltip;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    }
    return "No additional info available.";
  },
  getOriginalDisplayForType: function getOriginalDisplayForType(type) {
    for (var category in _core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.allPlaceholders) {
      var _iterator3 = _createForOfIteratorHelper(_core_placeholders_js__WEBPACK_IMPORTED_MODULE_1__.allPlaceholders[category]),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var p = _step3.value;
          if (p.internalType === type) {
            return p.display;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return type.startsWith("NN") ? TypeHelpers.naturalizeType(type) : type;
  },
  guessTypeFromId: function guessTypeFromId(id) {
    var base = id.replace(/\d+$/, '');
    var custom = _core_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.find(function (p) {
      return p.type === base;
    });
    if (custom) return custom.type;
    var pronounFixedRe = /^PRP(\d+)(SUB|OBJ|PSA|PSP|REF)$/;
    if (pronounFixedRe.test(id)) {
      var match = id.match(pronounFixedRe);
      var groupNum = match[1];
      var abbrev = match[2];
      var formMapReverse = {
        SUB: "subject",
        OBJ: "object",
        PSA: "possAdj",
        PSP: "possPron",
        REF: "reflexive"
      };
      return "PRONOUN|PronounGroup".concat(groupNum, "|").concat(formMapReverse[abbrev]);
    }
    var pronounRe = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)$/;
    if (pronounRe.test(base)) {
      var m = base.match(pronounRe);
      return "PRONOUN|".concat(m[1], "|").concat(m[2]);
    }
    return TypeHelpers.naturalizeType(base);
  },
  getNounFinalType: function getNounFinalType(baseInternal, number) {
    var baseTag = "",
      extra = "";
    if (baseInternal.indexOf("_") !== -1) {
      var parts = baseInternal.split("_");
      baseTag = parts[0];
      extra = parts.slice(1).join("_");
    } else {
      baseTag = baseInternal;
    }
    var finalTag = baseTag === "NN" ? number === "Singular" ? "NN" : "NNS" : baseTag === "NNP" ? number === "Singular" ? "NNP" : "NNPS" : number === "Singular" ? baseTag : baseTag + "S";
    return extra ? finalTag + "_" + extra : finalTag;
  },
  computeFinalVerbType: function computeFinalVerbType(baseInternal, tenseTag) {
    if (baseInternal === "MD") return "MD_" + tenseTag;
    var parts = baseInternal.split("_");
    var baseCategory = parts.slice(1).join("_");
    return baseCategory ? tenseTag + "_" + baseCategory : tenseTag;
  }
};

/***/ }),

/***/ "./public/js/utils/utils.js":
/*!**********************************!*\
  !*** ./public/js/utils/utils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utils: () => (/* binding */ Utils),
/* harmony export */   decodeHTMLEntities: () => (/* binding */ decodeHTMLEntities)
/* harmony export */ });
// public/js/utils/utils.js

var Utils = {
  debounce: function debounce(func, delay) {
    var timeout;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var context = this;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        return func.apply(context, args);
      }, delay);
    };
  },
  toTitleCase: function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
  capitalize: function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  pascalCase: function pascalCase(str) {
    return str.toLowerCase().split(/\s+/).map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
  },
  naturalDisplay: function naturalDisplay(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  },
  sanitizeString: function sanitizeString(str) {
    return str.replace(/[^a-zA-Z0-9_]/g, '');
  }
};
var decodeHTMLEntities = function decodeHTMLEntities(text) {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!***************************!*\
  !*** ./public/js/main.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/state.js */ "./public/js/core/state.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils.js */ "./public/js/utils/utils.js");
/* harmony import */ var _utils_typeHelpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/typeHelpers.js */ "./public/js/utils/typeHelpers.js");
/* harmony import */ var _data_storage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data/storage.js */ "./public/js/data/storage.js");
/* harmony import */ var _core_placeholders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/placeholders.js */ "./public/js/core/placeholders.js");
/* harmony import */ var _ui_forms_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui/forms.js */ "./public/js/ui/forms.js");
/* harmony import */ var _ui_menu_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui/menu.js */ "./public/js/ui/menu.js");
/* harmony import */ var _handlers_events_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./handlers/events.js */ "./public/js/handlers/events.js");
/* harmony import */ var _core_storyProcessor_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/storyProcessor.js */ "./public/js/core/storyProcessor.js");
/* harmony import */ var _utils_domUtils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/domUtils.js */ "./public/js/utils/domUtils.js");
// public/js/main.js











(function () {
  "use strict";

  // Make Utils and decodeHTMLEntities available on window for legacy code
  window.Utils = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils;
  window.decodeHTMLEntities = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.decodeHTMLEntities;

  // ====================================================
  // EVENT HANDLERS & DOCUMENT READY
  // ====================================================
  $(document).ready(function () {
    // Initialize the application
    (0,_ui_menu_js__WEBPACK_IMPORTED_MODULE_6__.initMenus)();
    (0,_handlers_events_js__WEBPACK_IMPORTED_MODULE_7__.initEvents)();
  });
})();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map