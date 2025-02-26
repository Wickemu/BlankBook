/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../OneDrive/Development/HTML/BlankBook/public/js/state.js":
/*!***********************************************************************!*\
  !*** ../../../OneDrive/Development/HTML/BlankBook/public/js/state.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   pronounMapping: () => (/* binding */ pronounMapping),
/* harmony export */   resetState: () => (/* binding */ resetState)
/* harmony export */ });
// state.js

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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (state);
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
}

/***/ }),

/***/ "../../../OneDrive/Development/HTML/BlankBook/public/js/utils.js":
/*!***********************************************************************!*\
  !*** ../../../OneDrive/Development/HTML/BlankBook/public/js/utils.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Utils: () => (/* binding */ Utils),
/* harmony export */   decodeHTMLEntities: () => (/* binding */ decodeHTMLEntities)
/* harmony export */ });
// public/js/utils.js
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************************************************************!*\
  !*** ../../../OneDrive/Development/HTML/BlankBook/public/js/main.js ***!
  \**********************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _state_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.js */ "../../../OneDrive/Development/HTML/BlankBook/public/js/state.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "../../../OneDrive/Development/HTML/BlankBook/public/js/utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// public/js/main.js



(function () {
  "use strict";

  window.Utils = _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils;
  window.decodeHTMLEntities = _utils_js__WEBPACK_IMPORTED_MODULE_1__.decodeHTMLEntities;

  // ====================================================
  // 1. UTILITY FUNCTIONS
  // ====================================================

  //   const Utils = {
  //     debounce: (func, delay) => {
  //       let timeout;
  //       return function(...args) {
  //         const context = this;
  //         clearTimeout(timeout);
  //         timeout = setTimeout(() => func.apply(context, args), delay);
  //       };
  //     },
  //     toTitleCase: (str) =>
  //       str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  //     capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  //     pascalCase: (str) => str.toLowerCase().split(/\s+/).map(Utils.capitalize).join(''),
  //     naturalDisplay: (str) => str.replace(/([a-z])([A-Z])/g, '$1 $2'),
  //     sanitizeString: (str) => str.replace(/[^a-zA-Z0-9_]/g, '')
  //   };

  // ====================================================
  // 2. GLOBAL STATE State.VARIABLES
  // ====================================================

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

  // NEW: Global to store the current story's database ID when loaded.
  var currentStoryId = null;

  // NEW: Global State.variables to persist the current search values
  var currentPlaceholderSearch = '';
  var currentModalPlaceholderSearch = '';

  // ====================================================
  // 2a. Capture Selection Changes
  // ====================================================
  document.addEventListener('selectionchange', function () {
    var editor = document.getElementById("storyText");
    var sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = sel.getRangeAt(0);
    }
  });

  // ====================================================
  // 3. STORAGE HELPER FUNCTIONS (Server-side)
  // ====================================================
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
        variables: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
        pronounGroups: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
        variableCounts: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
        pronounGroupCount: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
        customPlaceholders: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
        tags: $('#storyTags').val() ? $('#storyTags').val().split(',').map(function (s) {
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
                  variables: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
                  pronounGroups: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
                  variableCounts: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
                  pronounGroupCount: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
                  customPlaceholders: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
                  tags: data.tags ? data.tags.split(',').map(function (s) {
                    return s.trim();
                  }) : [],
                  savedAt: new Date().toISOString(),
                  password: data.password || null,
                  overwrite: true // Add the overwrite flag
                };
                $.ajax({
                  url: '/api/savestory',
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
        storyText: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyText,
        variables: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
        pronounGroups: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
        variableCounts: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
        pronounGroupCount: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
        customPlaceholders: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
        tags: $('#displayTags').text() ? $('#displayTags').text().split(',').map(function (s) {
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
                  url: '/api/savestory',
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
        url: "/api/getstories?tag=".concat(encodeURIComponent(tag || ''), "&sort=").concat(encodeURIComponent(sort || 'date_desc')),
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
            var item = $("\n              <div class=\"list-group-item p-2\">\n                <div class=\"d-flex justify-content-between align-items-center\">\n                  <div>\n                    <strong>".concat(lockIndicator).concat(story.storyTitle || 'Untitled', "</strong><br>\n                    <small>").concat(story.storyAuthor || 'Unknown', " | ").concat(dateStr, "</small><br>\n                    <small>").concat(tags, " | ").concat(ratingDisplay, "</small>\n                  </div>\n                  <div>\n                    <button class=\"btn btn-sm btn-secondary editSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Edit Story\">\n                      <i class=\"fas fa-edit\"></i>\n                    </button>\n                    <button class=\"btn btn-sm btn-success loadSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Play Story\">\n                      <i class=\"fas fa-play\"></i>\n                    </button>\n                    <button class=\"btn btn-sm btn-danger deleteSavedStoryBtn\" data-title=\"").concat(story.storyTitle, "\" aria-label=\"Delete Story\">\n                      <i class=\"fas fa-trash-alt\"></i>\n                    </button>\n                  </div>\n                </div>\n              </div>\n            "));
            $listContainer.append(item);
          });
        },
        error: function error(xhr, statusText, errorThrown) {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to load saved stories list');
        }
      });
    },
    createSavedStoryListItem: function createSavedStoryListItem(story, index, dateStr) {
      return $("\n        <div class=\"list-group-item p-2\">\n          <div class=\"d-flex justify-content-between align-items-center\">\n            <div>\n              <strong>".concat(story.storyTitle || 'Untitled', "</strong><br>\n              <small>").concat(story.storyAuthor || 'Unknown', " | ").concat(dateStr, "</small>\n            </div>\n            <div>\n              <button class=\"btn btn-sm btn-secondary editSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Edit Story\">\n                <i class=\"fas fa-edit\"></i>\n              </button>\n              <button class=\"btn btn-sm btn-success loadSavedStoryBtn\" data-index=\"").concat(index, "\" aria-label=\"Play Story\">\n                <i class=\"fas fa-play\"></i>\n              </button>\n              <button class=\"btn btn-sm btn-danger deleteSavedStoryBtn\" data-title=\"").concat(story.storyTitle, "\" aria-label=\"Delete Story\">\n                <i class=\"fas fa-trash-alt\"></i>\n              </button>\n            </div>\n          </div>\n        </div>\n      "));
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
              url: '/api/unlockstory',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({
                storyId: story._id,
                password: result.value
              }),
              success: function success(unlockedStory) {
                Storage.populateEditorWithStory(unlockedStory, mode);
                currentStoryId = unlockedStory._id || null;
                $('#displayStoryId').text(currentStoryId);
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
        currentStoryId = story._id || null;
        $('#displayStoryId').text(currentStoryId);
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
      $('#storyText').html((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.decodeHTMLEntities)(story.storyText));
      if (story.tags && story.tags.length) {
        $('#storyTags').val(story.tags.join(', '));
      }
      if (mode === "play" && story.ratingCount) {
        $('#ratingSection').show();
      } else {
        $('#ratingSection').hide();
      }
      // Reset and update state with the saved story's values
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
      // --- FIX: Use the top-level keys from the saved story object ---
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = story.fillValues || {};
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = story.pronounGroups || {};
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = story.pronounGroupCount || 0;
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = story.customPlaceholders || [];
      updateVariablesFromEditor();
      if (mode === "edit") {
        $('#editor').removeClass('d-none');
        $('#inputs, #result').addClass('d-none');
      } else if (mode === "play") {
        buildFillForm();
        $('#inputs').removeClass('d-none');
        $('#editor, #result').addClass('d-none');
      }
    },
    deleteSavedStory: function deleteSavedStory(title) {
      $.ajax({
        url: '/api/deletestory',
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

  // ====================================================
  // 4. TYPE HELPER FUNCTIONS
  // ====================================================
  var TypeHelpers = {
    naturalizeType: function naturalizeType(type) {
      if (type.startsWith("NNPS")) {
        var sub = type.substring(4);
        if (sub.startsWith("_")) sub = sub.substring(1);
        sub = sub.replace(/\d+$/, '');
        if (sub.toLowerCase() === "person") {
          return "Person (proper, plural)";
        }
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(sub || "Proper Noun")) + " (Plural)";
      }
      if (type.startsWith("NNP")) {
        var _sub = type.substring(3);
        if (_sub.startsWith("_")) _sub = _sub.substring(1);
        _sub = _sub.replace(/\d+$/, '');
        if (_sub.toLowerCase() === "person") {
          return "Person (proper, singular)";
        }
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub || "Proper Noun")) + " (Singular)";
      }
      if (type.startsWith("NNS")) {
        var _sub2 = type.substring(3);
        if (_sub2.startsWith("_")) _sub2 = _sub2.substring(1);
        _sub2 = _sub2.replace(/\d+$/, '');
        if (_sub2.toLowerCase() === "person") {
          return "Person (common, plural)";
        }
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub2 || "Common Noun")) + " (Plural)";
      }
      if (type.startsWith("NN")) {
        var _sub3 = type.substring(2);
        if (_sub3.startsWith("_")) _sub3 = _sub3.substring(1);
        _sub3 = _sub3.replace(/\d+$/, '');
        if (_sub3.toLowerCase() === "person") {
          return "Person (common, singular)";
        }
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub3 || "Common Noun")) + " (Singular)";
      }
      if (type.startsWith("NNS")) {
        var _sub4 = type.substring(3);
        if (_sub4.startsWith("_")) _sub4 = _sub4.substring(1);
        _sub4 = _sub4.replace(/\d+$/, '');
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub4 || "Common Noun")) + " (Plural)";
      }
      if (type.startsWith("NN")) {
        var _sub5 = type.substring(2);
        if (_sub5.startsWith("_")) _sub5 = _sub5.substring(1);
        _sub5 = _sub5.replace(/\d+$/, '');
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub5 || "Common Noun")) + " (Singular)";
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
          return category ? _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(category) + " Verb (" + verbTenseMap[_tense] + ")" : "Verb (" + verbTenseMap[_tense] + ")";
        }
      }
      if (type.startsWith("VB")) {
        var rest = type.substring(2).replace(/^_+/, "");
        return rest ? _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(rest) + " Verb (Base Form)" : "Verb (Base Form)";
      }
      if (type.startsWith("JJ_")) {
        var _sub6 = type.substring(3);
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub6));
      }
      if (type.startsWith("JJS_")) {
        var _sub7 = type.substring(4);
        if (_sub7.toLowerCase() === "ordinal") {
          return "Ordinal Number";
        }
        return _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.toTitleCase(_utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(_sub7)) + " Superlative Adjective";
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
      for (var category in allPlaceholders) {
        var _iterator = _createForOfIteratorHelper(allPlaceholders[category]),
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
          for (var _category in allPlaceholders) {
            var _iterator2 = _createForOfIteratorHelper(allPlaceholders[_category]),
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
      for (var category in allPlaceholders) {
        var _iterator3 = _createForOfIteratorHelper(allPlaceholders[category]),
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
      var custom = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.find(function (p) {
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

  // ====================================================
  // 5. PLACEHOLDER DEFINITIONS & CATEGORY ORDER
  // ====================================================
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

  // ====================================================
  // 6. PLACEHOLDER & FORM HANDLING FUNCTIONS
  // ====================================================
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
  var insertPlaceholder = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(internalType, displayName, isCustom) {
      var sanitized, editor, spans, max, newCount, id, rangeToUse, selectedText, displayText, _yield$Swal$fire, temp;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            sanitized = _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.sanitizeString(internalType);
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
  var formatLabel = function formatLabel(variable) {
    return variable.displayOverride && variable.displayOverride !== variable.officialDisplay ? "".concat(variable.displayOverride, " (").concat(variable.officialDisplay, ")") : variable.officialDisplay;
  };
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

  // ====================================================
  // 7. UPDATE PLACEHOLDER ACCORDION
  // ====================================================
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
    var collapseDiv = $("\n      <div id='".concat(sanitizedCategoryName, "Collapse' class='collapse show' aria-labelledby='").concat(sanitizedCategoryName, "Heading' data-parent='").concat(accordionSelector, "'>\n        <div class='card-body'><div class='list-group'></div></div>\n      </div>\n    "));
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
    var collapseDiv = $("\n      <div id='CustomPlaceholdersCollapse' class='collapse show' aria-labelledby='CustomPlaceholdersHeading' data-parent='".concat(accordionSelector, "'>\n        <div class='card-body'><div class='list-group'></div></div>\n      </div>\n    "));
    _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.forEach(function (p) {
      var showItem = !searchVal || p.type.toLowerCase().includes(searchVal.toLowerCase());
      var item = $("\n        <div class='list-group-item placeholder-btn custom-placeholder'\n          data-internal='".concat(p.type, "'\n          data-display='").concat(p.type, "'\n          style='display: ").concat(showItem ? 'block' : 'none', ";'>\n          <i class='fas fa-star'></i> ").concat(p.type, "\n        </div>\n      "));
      collapseDiv.find('.list-group').append(item);
    });
    card.append(collapseDiv);
    return card;
  };
  var createCardHeader = function createCardHeader(categoryName, sanitizedCategoryName, accordionSelector) {
    return $("\n      <div class='card-header' id='".concat(sanitizedCategoryName, "Heading'>\n        <h2 class='mb-0'>\n          <button class='btn btn-link btn-block text-left' type='button'\n            data-toggle='collapse' data-target='#").concat(sanitizedCategoryName, "Collapse'\n            aria-expanded='true' aria-controls='").concat(sanitizedCategoryName, "Collapse'>\n            ").concat(categoryName, "\n          </button>\n        </h2>\n      </div>\n    "));
  };
  var createSecondaryPlaceholderWrapper = function createSecondaryPlaceholderWrapper(secondaryItems, searchVal) {
    var hiddenWrapper = $("<div class='secondary-placeholder-wrapper'></div>");
    secondaryItems.forEach(function (p) {
      return appendPlaceholderItem(hiddenWrapper, p, searchVal, true);
    });
    return hiddenWrapper;
  };
  var createShowMoreToggle = function createShowMoreToggle(sanitizedCategoryName) {
    return $("\n      <div class='show-more-toggle' data-category='".concat(sanitizedCategoryName, "'>\n        Show More\n      </div>\n    "));
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
    var item = $("\n      <div class='list-group-item placeholder-btn".concat(isSecondary ? ' secondary-placeholder' : '', "'\n        data-internal='").concat(placeholder.internalType, "'\n        data-display='").concat(placeholder.display, "'\n        style='display: ").concat(showItem ? 'block' : 'none', ";'>\n        <i class='").concat(placeholder.icon, "'></i> ").concat(placeholder.display, "\n        <i class='fas fa-info-circle accordion-info-icon' data-tooltip=\"").concat(placeholder.tooltip, "\" style=\"font-size:0.8em; margin-left:5px;\"></i>\n      </div>\n    "));
    listGroup.append(item);
  };

  // ====================================================
  // 8. PLACEHOLDER SELECTION & INFO ICON HANDLERS
  // ====================================================
  $(document).on('click', '.accordion-info-icon', function (e) {
    e.stopPropagation();
    var tooltip = $(e.currentTarget).data('tooltip');
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: tooltip,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  });
  $(document).on('click', '.fill-info-icon', function (e) {
    e.stopPropagation();
    var type = $(e.currentTarget).data('type');
    var tooltip = TypeHelpers.getTooltipForType(type);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: tooltip,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  });
  $(document).on('click', '.show-more-toggle', function () {
    var parentList = $(this).closest('.list-group');
    var hiddenItems = parentList.find('.secondary-placeholder-wrapper .secondary-placeholder');
    var link = $(this);
    link.text(link.text() === 'Show More' ? 'Show Less' : 'Show More');
    hiddenItems.toggle();
  });

  // ====================================================
  // 9. CUSTOM PLACEHOLDER HANDLERS & SAVED STORIES SORTING
  // ====================================================
  var addNewCustomPlaceholderWithUsage = function addNewCustomPlaceholderWithUsage(rawText, usage) {
    var internal;
    if (usage === "noun") {
      internal = "NN_" + _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
    } else if (usage === "verb") {
      internal = "VB_" + _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
    } else {
      internal = _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
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
    var internal = _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
    if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.some(function (p) {
      return p.type === internal;
    })) {
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders.push({
        type: internal
      });
    }
  };
  var insertPlaceholderFromCustom = function insertPlaceholderFromCustom(rawText) {
    var internal = _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(rawText);
    var display = _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(internal);
    insertPlaceholder(internal, display, true);
  };
  $('#addCustomPlaceholderBtn').on('click', function () {
    var raw = $('#placeholderSearch').val();
    var usage = $('input[name="customPlaceholderType"]:checked').val() || "generic";
    if (usage === "noun") {
      addNewCustomPlaceholderWithUsage(raw, "noun");
      showNounNumberSelection("NN_" + _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(raw), _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(raw));
    } else if (usage === "verb") {
      addNewCustomPlaceholderWithUsage(raw, "verb");
      showVerbTenseSelection("VB_" + _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(raw), _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(raw));
    } else {
      addNewCustomPlaceholder(raw);
      insertPlaceholderFromCustom(raw);
    }
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
  });
  $('#modalAddCustomPlaceholderBtn').on('click', function () {
    var raw = $('#modalPlaceholderSearch').val();
    var usage = $('input[name="modalCustomPlaceholderType"]:checked').val() || "generic";
    if (usage === "noun") {
      addNewCustomPlaceholderWithUsage(raw, "noun");
      showNounNumberSelection("NN_" + _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(raw), _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(raw));
    } else if (usage === "verb") {
      addNewCustomPlaceholderWithUsage(raw, "verb");
      showVerbTenseSelection("VB_" + _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.pascalCase(raw), _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.naturalDisplay(raw));
    } else {
      addNewCustomPlaceholder(raw);
      insertPlaceholderFromCustom(raw);
    }
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
    $('#placeholderModal').modal('hide');
    $('#modalPlaceholderSearch').val('');
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
  });
  $(document).on('click', '#modalPlaceholderAccordion .placeholder-btn', function (e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    if ($('#placeholderModal').hasClass('show')) {
      $('#placeholderModal').modal('hide');
    }
    var internalType = $(e.currentTarget).data('internal');
    var displayName = $(e.currentTarget).data('display');
    if (internalType === "PRONOUN") {
      pickPronounFormAndGroup();
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      return;
    }
    if (internalType.indexOf("NN") === 0) {
      if (internalType === "NN_Person") {
        // New step for person placeholders
        showPersonTypeSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        return;
      }
      // Otherwise, proceed as usual with number selection
      showNounNumberSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      return;
    }
    if (internalType.indexOf("VB") === 0 || internalType === "MD") {
      showVerbTenseSelection(internalType, displayName);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      return;
    }
    if (window.isEditingPlaceholder && currentEditingVariable) {
      updateExistingPlaceholder(currentEditingVariable, internalType, displayName);
      window.isEditingPlaceholder = false;
      currentEditingVariable = null;
    } else {
      insertPlaceholder(internalType, displayName, false);
    }
    $('#placeholderSearch').val('');
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
  });
  $(document).on('click', '.placeholder-btn', function (e) {
    if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress) return;
    _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = true;
    if ($(e.currentTarget).closest('#modalPlaceholderAccordion').length > 0) {
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = false;
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    var internalType = $(e.currentTarget).data('internal');
    var displayName = $(e.currentTarget).data('display');
    if (window.isEditingPlaceholder && currentEditingVariable) {
      updateExistingPlaceholder(currentEditingVariable, internalType, displayName);
      window.isEditingPlaceholder = false;
      currentEditingVariable = null;
      $('#placeholderModal').modal('hide');
    } else {
      if (internalType === "PRONOUN") {
        pickPronounFormAndGroup();
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = false;
        return;
      }
      if (internalType.indexOf("NN") === 0) {
        if (internalType === "NN_Person") {
          showPersonTypeSelection(internalType, displayName);
          $('#placeholderSearch').val('');
          updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = false;
          return;
        }
        showNounNumberSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = false;
        return;
      }
      if (internalType.indexOf("VB") === 0 || internalType === "MD") {
        showVerbTenseSelection(internalType, displayName);
        $('#placeholderSearch').val('');
        updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = false;
        return;
      }
      insertPlaceholder(internalType, displayName, false);
      $('#placeholderSearch').val('');
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    }
    setTimeout(function () {
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].placeholderInsertionInProgress = false;
    }, 50);
  });

  // ====================================================
  // 10. VERB & NOUN SELECTION MODALS
  // ====================================================
  var showPersonTypeSelection = function showPersonTypeSelection(baseInternal, baseDisplay) {
    var html = "<div class='list-group'>\n      <button class='list-group-item list-group-item-action person-type-btn' data-type='common'>\n        Common (e.g., doctor)\n      </button>\n      <button class='list-group-item list-group-item-action person-type-btn' data-type='proper'>\n        Proper (e.g., Donald Trump)\n      </button>\n    </div>";
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
          // ...and use a small timeout to ensure it’s fully closed before showing the next modal.
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
                finalInternal = TypeHelpers.getNounFinalType(baseInternal, selected);
                finalDisplay = "".concat(baseDisplay, " (").concat(selected, ")");
                if (!(window.isEditingPlaceholder && currentEditingVariable)) {
                  _context2.next = 10;
                  break;
                }
                updateExistingPlaceholder(currentEditingVariable, finalInternal, finalDisplay);
                window.isEditingPlaceholder = false;
                currentEditingVariable = null;
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
                finalInternal = TypeHelpers.computeFinalVerbType(baseInternal, selectedTense);
                finalDisplay = "".concat(baseDisplay, " (").concat(tenseText, ")");
                if (!(window.isEditingPlaceholder && currentEditingVariable)) {
                  _context3.next = 11;
                  break;
                }
                updateExistingPlaceholder(currentEditingVariable, finalInternal, finalDisplay);
                window.isEditingPlaceholder = false;
                currentEditingVariable = null;
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

  // ====================================================
  // 11. PRONOUN HANDLERS
  // ====================================================
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
    var groupKeys = Object.keys(pronounGroups);
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
              _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[grp] = pronounMapping[tempValue] || {
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
            _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[newGroup] = pronounMapping[tempValue] || {
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

  // ====================================================
  // 12. BUILD THE FILL-IN-THE-BLANK FORM
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
    var _iterator4 = _createForOfIteratorHelper(variables),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var v = _step4.value;
        if (v.internalType.startsWith('PRONOUN|')) {
          var parts = v.internalType.split('|');
          groupSet.add(parts[1]);
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
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
    var nonPronounVars = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.filter(function (v) {
      return !v.internalType.startsWith('PRONOUN|');
    });
    if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder === 'alphabetical') {
      nonPronounVars.sort(function (a, b) {
        return a.officialDisplay.localeCompare(b.officialDisplay);
      });
    } else if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder === 'random') {
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
    if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues[variable.id]) {
      groupRow.find('input').val(_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues[variable.id]);
    }
    return groupRow;
  };

  // ====================================================
  // 13. EVENT HANDLERS & DOCUMENT READY
  // ====================================================
  $(document).ready(function () {
    // Attach search handlers with a reduced debounce delay (50ms)
    $('#placeholderSearch').on('input', _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.debounce(function () {
      var searchVal = $(this).val();
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', searchVal);
      $('#addCustomPlaceholderBtn').text('Add "' + searchVal + '"');
    }, 50));
    $('#modalPlaceholderSearch').on('input', _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.debounce(function () {
      var searchVal = $(this).val();
      updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', searchVal);
      $('#modalAddCustomPlaceholderBtn').text('Add "' + searchVal + '"');
    }, 50));
    updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
    updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
    $('#filterTag').on('input', _utils_js__WEBPACK_IMPORTED_MODULE_1__.Utils.debounce(function () {
      Storage.loadSavedStoriesList();
    }, 300));
    $('#sortOption').on('change', function () {
      Storage.loadSavedStoriesList();
    });

    // Attach event handlers for the ordering buttons
    $('#alphabeticalOrderBtn').on('click', function () {
      // Set the fill order to alphabetical
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder = 'alphabetical';
      // Update button styling (optional)
      $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
      $('#randomOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
      // Rebuild the fill form to reflect the new order
      buildFillForm();
    });
    $('#randomOrderBtn').on('click', function () {
      // Set the fill order to random
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillOrder = 'random';
      // Update button styling (optional)
      $(this).removeClass('btn-outline-secondary').addClass('btn-outline-primary');
      $('#alphabeticalOrderBtn').removeClass('btn-outline-primary').addClass('btn-outline-secondary');
      // Rebuild the fill form to reflect the new order
      buildFillForm();
    });

    // NEW: Attach autocomplete to the tag filter input in the saved stories modal.
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

    // NEW: Event handler for applying filters in the saved stories modal.
    $('#applyFilters').on('click', function () {
      Storage.loadSavedStoriesList();
    });
    $('#shareStory').on('click', function () {
      var finalText = $('#finalStory').text();
      var title = $('#displayTitle').text();
      var author = $('#displayAuthor').text();
      var content = "Title: ".concat(title, "\nAuthor: ").concat(author, "\n\n").concat(finalText);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(function () {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Story copied to clipboard!',
            showConfirmButton: false,
            timer: 1500
          });
        })["catch"](function (err) {
          console.error('Error copying text: ', err);
          fallbackCopyTextToClipboard(content);
        });
      } else {
        fallbackCopyTextToClipboard(content);
      }
    });
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
        if (successful) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Story copied to clipboard!',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire('Error', 'Failed to copy story. Please copy manually.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to copy story. Please copy manually.', 'error');
      }
      document.body.removeChild(textarea);
    };
    document.getElementById('existingPlaceholdersContainer').addEventListener('click', function (e) {
      var btn = e.target.closest('.placeholder-item');
      if (!btn) return;
      var id = btn.getAttribute('data-id');
      var variable = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.find(function (v) {
        return v.id === id;
      });
      if (variable) duplicatePlaceholder(variable);
    });
    $('#storyText').on('input', function () {
      updateVariablesFromEditor();
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges = true;
    });
    $('#uploadStoryBtn').on('click', function () {
      $('#uploadStory').click();
    });
    $('#uploadStory').on('change', function () {
      var file = this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
        var titleMatch = content.match(/^Title:\s*(.*)$/m);
        var authorMatch = content.match(/^Author:\s*(.*)$/m);
        var storyStartIndex = content.indexOf('\n\n');
        var storyContent = storyStartIndex !== -1 ? content.substring(storyStartIndex + 2) : content;
        $('#storyTitle').val(titleMatch ? titleMatch[1] : '');
        $('#storyAuthor').val(authorMatch ? authorMatch[1] : '');
        $('#storyText').html(storyContent);
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = 0;
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = {};
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = {};
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = [];
        updateVariablesFromEditor();
      };
      reader.readAsText(file);
    });
    $('#startGame').on('click', function () {
      var content = $('#storyText').html();
      if (!content.trim()) {
        Swal.fire('Oops!', 'Please write a story.', 'error');
        return;
      }
      updateVariablesFromEditor();
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyText = generateLegacyText();
      if (!_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.length) {
        Swal.fire('Oops!', 'No placeholders found.', 'error');
        return;
      }
      buildFillForm();
      $('#inputs').removeClass('d-none');
      $('#editor').addClass('d-none');
    });
    $('#generateStory').on('click', function () {
      var inputs = $('#inputForm input[type="text"]:not(.d-none)');
      var valid = true;
      inputs.each(function () {
        var pid = $(this).attr('name');
        if (!pid) return;
        var val = $(this).val().trim();
        var label = $(this).attr('data-label');
        if (!val && pid) {
          Swal.fire('Oops!', "Please enter a value for ".concat(label, "."), 'error');
          valid = false;
          return false;
        }
        _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues[pid] = val;
      });
      if (!valid) return;
      var pronounComplete = true;
      var groupSet = new Set();
      var _iterator5 = _createForOfIteratorHelper(variables),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var v = _step5.value;
          if (v.internalType.startsWith('PRONOUN|')) {
            var parts = v.internalType.split('|');
            groupSet.add(parts[1]);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      groupSet.forEach(function (g) {
        $("#".concat(g, "-label .required-asterisk")).remove();
        var choice = $("input[name='".concat(g, "-choice']:checked")).val();
        if (!choice) {
          pronounComplete = false;
          $("#".concat(g, "-label")).append("<span class='required-asterisk' style='color:red;'> *</span>");
        } else if (choice === 'Custom') {
          var raw = $("#".concat(g, "-custom")).val().trim();
          var splitted = raw.split(',').map(function (s) {
            return s.trim();
          });
          if (splitted.length !== 5 || splitted.some(function (s) {
            return s === "";
          })) {
            pronounComplete = false;
            $("#".concat(g, "-label")).append("<span class='required-asterisk' style='color:red;'> *</span>");
          }
        }
      });
      if (!pronounComplete) {
        Swal.fire("Oops!", "Please complete all pronoun selections.", "error");
        return;
      }
      groupSet.forEach(function (g) {
        var choice = $("input[name='".concat(g, "-choice']:checked")).val();
        if (choice === 'HeHim' || choice === 'SheHer' || choice === 'TheyThem') {
          var predefined = {
            HeHim: {
              subject: "he",
              object: "him",
              possAdj: "his",
              possPron: "his",
              reflexive: "himself"
            },
            SheHer: {
              subject: "she",
              object: "her",
              possAdj: "her",
              possPron: "hers",
              reflexive: "herself"
            },
            TheyThem: {
              subject: "they",
              object: "them",
              possAdj: "their",
              possPron: "theirs",
              reflexive: "themselves"
            }
          };
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[g] = _objectSpread({}, predefined[choice]);
        } else {
          var raw = $("#".concat(g, "-custom")).val().trim();
          var splitted = raw.split(',').map(function (s) {
            return s.trim();
          });
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[g] = {
            subject: splitted[0],
            object: splitted[1],
            possAdj: splitted[2],
            possPron: splitted[3],
            reflexive: splitted[4]
          };
        }
      });
      // FIX: Regenerate the legacy story text from the editor here
      var _final = generateLegacyText();
      var _iterator6 = _createForOfIteratorHelper(variables),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _v = _step6.value;
          var phRegex = new RegExp("\\{".concat(_v.id, "\\}"), 'g');
          if (_v.internalType.startsWith('PRONOUN|')) {
            var _parts = _v.internalType.split('|');
            var groupId = _parts[1];
            var form = _parts[2];
            var groupObj = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups[groupId];
            _final = _final.replace(phRegex, groupObj ? groupObj[form] || '' : '');
          } else {
            var userVal = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues[_v.id] || '';
            _final = _final.replace(phRegex, userVal);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      $('#finalStory').text(_final);
      $('#displayTitle').text($('#storyTitle').val());
      $('#displayAuthor').text($('#storyAuthor').val());
      // NEW: Display tags in the result (if any)
      $('#displayTags').text($('#storyTags').val());
      $('#result').removeClass('d-none');
      $('#inputs').addClass('d-none');
    });
    $('#createNewStory2, #createNewStory').on('click', function (e) {
      e.preventDefault();
      if (storyHasUnsavedChanges) {
        Swal.fire({
          title: 'Unsaved changes',
          text: 'Your story has unsaved changes. Would you like to save it to the site before starting a new one?',
          icon: 'warning',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save and start new',
          denyButtonText: 'Discard changes'
        }).then(function (result) {
          if (result.isConfirmed) {
            Storage.addCurrentStoryToSavedStories();
            setTimeout(createNewStory, 1000);
          } else if (result.isDenied) {
            Swal.fire({
              title: 'Are you sure?',
              text: 'This will discard your current unsaved story.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, start new',
              cancelButtonText: 'Cancel'
            }).then(function (res) {
              if (res.isConfirmed) createNewStory();
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This will discard your current story.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, start new',
          cancelButtonText: 'Cancel'
        }).then(function (res) {
          if (res.isConfirmed) createNewStory();
        });
      }
    });
    var createNewStory = function createNewStory() {
      $('#storyTitle').val('');
      $('#storyAuthor').val('');
      $('#storyText').html('');
      $('#storyTags').val(''); // NEW: clear tags field
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables = [];
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts = {};
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter = 0;
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders = [];
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].fillValues = {};
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups = {};
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount = 0;
      _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].storyHasUnsavedChanges = false;
      updateVariablesList();
      updatePlaceholderAccordion('#placeholderAccordion', '#noResults', currentPlaceholderSearch);
      updatePlaceholderAccordion('#modalPlaceholderAccordion', '#modalNoResults', currentModalPlaceholderSearch);
      $('#editor').removeClass('d-none');
      $('#inputs, #result').addClass('d-none');
    };
    $('#editStoryEntries').on('click', function () {
      buildFillForm();
      $('#result').addClass('d-none');
      $('#inputs').removeClass('d-none');
    });
    $('#backToEditor, #backToEditor2').on('click', function () {
      $('#result, #inputs').addClass('d-none');
      $('#editor').removeClass('d-none');
    });
    function loadPreexistingTags() {
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
    }
    $('#saveStoryToSite').on('click', function () {
      Swal.fire({
        title: 'Save Story',
        html: "\n          <input type=\"text\" id=\"swalTitle\" class=\"swal2-input\" placeholder=\"Story Title\" value=\"".concat($('#storyTitle').val(), "\">\n          <input type=\"text\" id=\"swalAuthor\" class=\"swal2-input\" placeholder=\"Author\" value=\"").concat($('#storyAuthor').val(), "\">\n          <input type=\"text\" id=\"swalTags\" class=\"swal2-input\" placeholder=\"Tags (comma separated)\" value=\"").concat($('#storyTags').val(), "\">\n          <input type=\"password\" id=\"swalPassword\" class=\"swal2-input\" placeholder=\"Password (optional)\">\n          <div id=\"preexistingTagsContainer\" style=\"text-align:left; margin-top:10px;\"></div>\n        "),
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
          var _data = result.value;
          // Update fields in the editor
          $('#storyTitle').val(_data.title);
          $('#storyAuthor').val(_data.author);
          $('#storyTags').val(_data.tags);
          var story = {
            storyTitle: _data.title,
            storyAuthor: _data.author,
            storyText: $('#storyText').html(),
            variables: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables,
            pronounGroups: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroups,
            variableCounts: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variableCounts,
            pronounGroupCount: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].pronounGroupCount,
            customPlaceholders: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].customPlaceholders,
            tags: _data.tags ? _data.tags.split(',').map(function (s) {
              return s.trim();
            }) : [],
            savedAt: new Date().toISOString(),
            password: null
          };
          $.ajax({
            url: '/api/savestory',
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
              Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to save story');
            }
          });
        }
      });
    });
    $('#downloadStory').on('click', function () {
      var finalText = $('#finalStory').text();
      var title = $('#displayTitle').text();
      var author = $('#displayAuthor').text();
      var content = "Title: ".concat(title, "\nAuthor: ").concat(author, "\n\n").concat(finalText);
      var blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      var fileName = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt' : 'story.txt';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    $('#mySavedStoriesBtn').on('click', function () {
      Storage.loadSavedStoriesList();
      $('#savedStoriesModal').modal('show');
    });
    $(document).on('click', '.loadSavedStoryBtn', function () {
      var index = $(this).data('index');
      $('#savedStoriesModal').modal('hide');
      Storage.loadSavedStory(index, "play");
    });
    $(document).on('click', '.editSavedStoryBtn', function () {
      var index = $(this).data('index');
      $('#savedStoriesModal').modal('hide');
      Storage.loadSavedStory(index, "edit");
    });
    $(document).on('click', '.deleteSavedStoryBtn', function () {
      var title = $(this).data('title');
      Swal.fire({
        title: 'Delete Story?',
        text: 'Are you sure you want to delete this saved story?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then(function (result) {
        if (result.isConfirmed) Storage.deleteSavedStory(title);
      });
    });

    // NEW: Rating submission for completed story.
    $('#submitRating').on('click', function () {
      var rating = parseInt($('#storyRating').val(), 10);
      if (!currentStoryId) {
        Swal.fire('Error', 'Story ID not found.', 'error');
        return;
      }
      $.ajax({
        url: '/api/rateStory',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          storyId: currentStoryId,
          rating: rating
        }),
        success: function success(data) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: "Thank you for rating! New average: ".concat(data.rating.toFixed(1), " (").concat(data.ratingCount, " votes)"),
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: function error(xhr, statusText, errorThrown) {
          Storage.handleAjaxError(xhr, statusText, errorThrown, 'Failed to rate story');
        }
      });
    });
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
    $('#addPlaceholderBtn').on('click', function () {
      $('#placeholderModal').modal('show');
    });
  });

  // ====================================================
  // 14. GLOBALS & HELPER FUNCTIONS FOR THE NEW FEATURES
  // ====================================================
  var currentEditingVariable = null;
  var currentPlaceholderElement = null;
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
  var hideMenu = function hideMenu(menu) {
    menu.style.display = 'none';
  };
  var hideAllMenus = function hideAllMenus() {
    hideMenu(selectionMenu);
    hideMenu(placeholderEditMenu);
  };
  var selectionMenu = document.createElement('div');
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
  selectionMenu.innerHTML = "\n    <button id=\"newPlaceholderBtn\" class=\"btn btn-sm btn-primary\">New Placeholder</button>\n    <button id=\"reusePlaceholderBtn\" class=\"btn btn-sm btn-secondary\">Reuse Placeholder</button>\n  ";
  document.body.appendChild(selectionMenu);
  var placeholderEditMenu = document.createElement('div');
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
  placeholderEditMenu.innerHTML = "\n    <button id=\"editPlaceholderBtn\" class=\"btn btn-sm btn-primary\">Change Placeholder</button>\n    <button id=\"editOverrideBtn\" class=\"btn btn-sm btn-secondary\">Change Override</button>\n    <button id=\"deletePlaceholderBtn\" class=\"btn btn-sm btn-danger\">Delete</button>\n  ";
  document.body.appendChild(placeholderEditMenu);

  // After the creation of placeholderEditMenu and before the end of the IIFE,
  // add a click event listener on the story text to detect clicks on placeholder spans
  document.getElementById('storyText').addEventListener('click', function (e) {
    if (e.target.classList.contains('placeholder')) {
      // Stop propagation so that other handlers (e.g. selection menu) do not interfere
      e.stopPropagation();
      // Find the corresponding variable using the data-id attribute
      currentEditingVariable = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.find(function (v) {
        return v.id === e.target.getAttribute('data-id');
      });
      currentPlaceholderElement = e.target;
      // Position the placeholder edit menu near the clicked element
      positionMenu(placeholderEditMenu, e.target.getBoundingClientRect());
    }
  });

  // Now attach event listeners to the buttons in the placeholderEditMenu
  document.getElementById('editPlaceholderBtn').addEventListener('click', function () {
    hideMenu(placeholderEditMenu);
    window.isEditingPlaceholder = true;
    // Open the modal so the user can select a new placeholder type.
    // (The modal’s click handler will check window.isEditingPlaceholder and update the existing placeholder.)
    $('#placeholderModal').modal('show');
    // Clear the current editing variable after the action is initiated
    currentEditingVariable = null;
    currentPlaceholderElement = null;
  });
  document.getElementById('editOverrideBtn').addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var _yield$Swal$fire2, newOverride;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          hideMenu(placeholderEditMenu);
          _context4.next = 3;
          return Swal.fire({
            title: 'Change Override',
            input: 'text',
            inputLabel: 'Enter new override text',
            inputValue: currentPlaceholderElement ? currentPlaceholderElement.textContent : ''
          });
        case 3:
          _yield$Swal$fire2 = _context4.sent;
          newOverride = _yield$Swal$fire2.value;
          if (newOverride !== undefined) {
            if (currentPlaceholderElement) {
              currentPlaceholderElement.textContent = newOverride;
            }
            if (currentEditingVariable) {
              currentEditingVariable.displayOverride = newOverride;
            }
            updateVariablesList();
          }
          currentEditingVariable = null;
          currentPlaceholderElement = null;
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
  document.getElementById('deletePlaceholderBtn').addEventListener('click', function () {
    hideMenu(placeholderEditMenu);
    if (currentPlaceholderElement) {
      currentPlaceholderElement.remove();
    }
    updateVariablesFromEditor();
    currentEditingVariable = null;
    currentPlaceholderElement = null;
  });
  document.getElementById('storyText').addEventListener('mouseup', function () {
    setTimeout(function () {
      var sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) {
        if (sel.anchorNode && sel.anchorNode.parentNode && !sel.anchorNode.parentNode.classList.contains('placeholder')) {
          _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange = sel.getRangeAt(0);
          var rect = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].lastRange.getBoundingClientRect();
          positionMenu(selectionMenu, rect);
        }
      } else {
        hideMenu(selectionMenu);
      }
    }, 0);
  });
  document.addEventListener('click', function (e) {
    if (!selectionMenu.contains(e.target) && !placeholderEditMenu.contains(e.target)) {
      hideAllMenus();
    }
  });
  document.getElementById('newPlaceholderBtn').addEventListener('click', function () {
    hideMenu(selectionMenu);
    $('#placeholderModal').modal('show');
  });
  document.getElementById('reusePlaceholderBtn').addEventListener('click', function () {
    hideMenu(selectionMenu);
    if (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.length === 0) {
      Swal.fire('No existing placeholders', 'There are no placeholders to reuse yet.', 'info');
      return;
    }
    var sortedVariables = _toConsumableArray(variables).sort(function (a, b) {
      return (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[b.id] || 0) - (_state_js__WEBPACK_IMPORTED_MODULE_0__["default"].usageTracker[a.id] || 0) || a.order - b.order;
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
            var variable = _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].variables.find(function (v) {
              return v.id === id;
            });
            if (variable) duplicatePlaceholder(variable);
            Swal.close();
          });
        });
      }
    });
  });

  // ====================================================
  // 15. CRITICAL: UPDATE State.VARIABLES FROM EDITOR (MODIFIED)
  // ====================================================
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
            officialDisplay: TypeHelpers.naturalizeType(custom.type),
            display: TypeHelpers.naturalizeType(custom.type),
            isCustom: true,
            order: _state_js__WEBPACK_IMPORTED_MODULE_0__["default"].insertionCounter++,
            displayOverride: el.textContent
          };
        } else {
          var guessed = TypeHelpers.guessTypeFromId(id);
          var originalDisplay = TypeHelpers.getOriginalDisplayForType(guessed) || guessed;
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
})();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map