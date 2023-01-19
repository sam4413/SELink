"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeZero = exports.codeUppercaseF = exports.codeUppercaseE = exports.codeUppercaseA = exports.codeTab = exports.codeSpace = exports.codeSlash = exports.codeSemicolon = exports.codeReturn = exports.codeQuote = exports.codePlus = exports.codeOpeningBracket = exports.codeOpeningBrace = exports.codeOpenParenthesis = exports.codeOne = exports.codeNine = exports.codeNewline = exports.codeMinus = exports.codeLowercaseF = exports.codeLowercaseE = exports.codeLowercaseA = exports.codeFormFeed = exports.codeDoubleQuote = exports.codeDot = exports.codeComma = exports.codeColon = exports.codeClosingBracket = exports.codeClosingBrace = exports.codeCloseParenthesis = exports.codeBackspace = exports.codeBackslash = exports.codeAsterisk = void 0;
exports.endsWithCommaOrNewline = endsWithCommaOrNewline;
exports.insertBeforeLastWhitespace = insertBeforeLastWhitespace;
exports.isControlCharacter = isControlCharacter;
exports.isDelimiter = isDelimiter;
exports.isDigit = isDigit;
exports.isDoubleQuote = isDoubleQuote;
exports.isHex = isHex;
exports.isNonZeroDigit = isNonZeroDigit;
exports.isQuote = isQuote;
exports.isSingleQuote = isSingleQuote;
exports.isSpecialWhitespace = isSpecialWhitespace;
exports.isStartOfValue = isStartOfValue;
exports.isValidStringCharacter = isValidStringCharacter;
exports.isWhitespace = isWhitespace;
exports.removeAtIndex = removeAtIndex;
exports.stripLastOccurrence = stripLastOccurrence;
// TODO: sort the codes
var codeBackslash = 0x5c; // "\"
exports.codeBackslash = codeBackslash;
var codeSlash = 0x2f; // "/"
exports.codeSlash = codeSlash;
var codeAsterisk = 0x2a; // "*"
exports.codeAsterisk = codeAsterisk;
var codeOpeningBrace = 0x7b; // "{"
exports.codeOpeningBrace = codeOpeningBrace;
var codeClosingBrace = 0x7d; // "}"
exports.codeClosingBrace = codeClosingBrace;
var codeOpeningBracket = 0x5b; // "["
exports.codeOpeningBracket = codeOpeningBracket;
var codeClosingBracket = 0x5d; // "]"
exports.codeClosingBracket = codeClosingBracket;
var codeOpenParenthesis = 0x28; // "("
exports.codeOpenParenthesis = codeOpenParenthesis;
var codeCloseParenthesis = 0x29; // ")"
exports.codeCloseParenthesis = codeCloseParenthesis;
var codeSpace = 0x20; // " "
exports.codeSpace = codeSpace;
var codeNewline = 0xa; // "\n"
exports.codeNewline = codeNewline;
var codeTab = 0x9; // "\t"
exports.codeTab = codeTab;
var codeReturn = 0xd; // "\r"
exports.codeReturn = codeReturn;
var codeBackspace = 0x08; // "\b"
exports.codeBackspace = codeBackspace;
var codeFormFeed = 0x0c; // "\f"
exports.codeFormFeed = codeFormFeed;
var codeDoubleQuote = 0x0022; // "
exports.codeDoubleQuote = codeDoubleQuote;
var codePlus = 0x2b; // "+"
exports.codePlus = codePlus;
var codeMinus = 0x2d; // "-"
exports.codeMinus = codeMinus;
var codeQuote = 0x27; // "'"
exports.codeQuote = codeQuote;
var codeZero = 0x30;
exports.codeZero = codeZero;
var codeOne = 0x31;
exports.codeOne = codeOne;
var codeNine = 0x39;
exports.codeNine = codeNine;
var codeComma = 0x2c; // ","
exports.codeComma = codeComma;
var codeDot = 0x2e; // "." (dot, period)
exports.codeDot = codeDot;
var codeColon = 0x3a; // ":"
exports.codeColon = codeColon;
var codeSemicolon = 0x3b; // ";"
exports.codeSemicolon = codeSemicolon;
var codeUppercaseA = 0x41; // "A"
exports.codeUppercaseA = codeUppercaseA;
var codeLowercaseA = 0x61; // "a"
exports.codeLowercaseA = codeLowercaseA;
var codeUppercaseE = 0x45; // "E"
exports.codeUppercaseE = codeUppercaseE;
var codeLowercaseE = 0x65; // "e"
exports.codeLowercaseE = codeLowercaseE;
var codeUppercaseF = 0x46; // "F"
exports.codeUppercaseF = codeUppercaseF;
var codeLowercaseF = 0x66; // "f"
exports.codeLowercaseF = codeLowercaseF;
var codeNonBreakingSpace = 0xa0;
var codeEnQuad = 0x2000;
var codeHairSpace = 0x200a;
var codeNarrowNoBreakSpace = 0x202f;
var codeMediumMathematicalSpace = 0x205f;
var codeIdeographicSpace = 0x3000;
var codeDoubleQuoteLeft = 0x201c; // “
var codeDoubleQuoteRight = 0x201d; // ”
var codeQuoteLeft = 0x2018; // ‘
var codeQuoteRight = 0x2019; // ’
var codeGraveAccent = 0x0060; // `
var codeAcuteAccent = 0x00b4; // ´

function isHex(code) {
  return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
}
function isDigit(code) {
  return code >= codeZero && code <= codeNine;
}
function isNonZeroDigit(code) {
  return code >= codeOne && code <= codeNine;
}
function isValidStringCharacter(code) {
  return code >= 0x20 && code <= 0x10ffff;
}
function isDelimiter(char) {
  return regexDelimiter.test(char) || char && isQuote(char.charCodeAt(0));
}
var regexDelimiter = /^[,:[\]{}()\n]$/;
function isStartOfValue(char) {
  return regexStartOfValue.test(char) || char && isQuote(char.charCodeAt(0));
}

// alpha, number, minus, or opening bracket or brace
var regexStartOfValue = /^[[{\w-]$/;
function isControlCharacter(code) {
  return code === codeNewline || code === codeReturn || code === codeTab || code === codeBackspace || code === codeFormFeed;
}

/**
 * Check if the given character is a whitespace character like space, tab, or
 * newline
 */
function isWhitespace(code) {
  return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
}

/**
 * Check if the given character is a special whitespace character, some
 * unicode variant
 */
function isSpecialWhitespace(code) {
  return code === codeNonBreakingSpace || code >= codeEnQuad && code <= codeHairSpace || code === codeNarrowNoBreakSpace || code === codeMediumMathematicalSpace || code === codeIdeographicSpace;
}

/**
 * Test whether the given character is a quote or double quote character.
 * Also tests for special variants of quotes.
 */
function isQuote(code) {
  // the first check double quotes, since that occurs most often
  return isDoubleQuote(code) || isSingleQuote(code);
}

/**
 * Test whether the given character is a double quote character.
 * Also tests for special variants of double quotes.
 */
function isDoubleQuote(code) {
  // the first check double quotes, since that occurs most often
  return code === codeDoubleQuote || code === codeDoubleQuoteLeft || code === codeDoubleQuoteRight;
}

/**
 * Test whether the given character is a single quote character.
 * Also tests for special variants of single quotes.
 */
function isSingleQuote(code) {
  return code === codeQuote || code === codeQuoteLeft || code === codeQuoteRight || code === codeGraveAccent || code === codeAcuteAccent;
}

/**
 * Strip last occurrence of textToStrip from text
 */
function stripLastOccurrence(text, textToStrip) {
  var stripRemainingText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var index = text.lastIndexOf(textToStrip);
  return index !== -1 ? text.substring(0, index) + (stripRemainingText ? '' : text.substring(index + 1)) : text;
}
function insertBeforeLastWhitespace(text, textToInsert) {
  var index = text.length;
  if (!isWhitespace(text.charCodeAt(index - 1))) {
    // no trailing whitespaces
    return text + textToInsert;
  }
  while (isWhitespace(text.charCodeAt(index - 1))) {
    index--;
  }
  return text.substring(0, index) + textToInsert + text.substring(index);
}
function removeAtIndex(text, start, count) {
  return text.substring(0, start) + text.substring(start + count);
}

/**
 * Test whether a string ends with a newline or comma character and optional whitespace
 */
function endsWithCommaOrNewline(text) {
  return /[,\n][ \t\r]*$/.test(text);
}
//# sourceMappingURL=stringUtils.js.map