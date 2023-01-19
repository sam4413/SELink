// TODO: sort the codes
export var codeBackslash = 0x5c; // "\"
export var codeSlash = 0x2f; // "/"
export var codeAsterisk = 0x2a; // "*"
export var codeOpeningBrace = 0x7b; // "{"
export var codeClosingBrace = 0x7d; // "}"
export var codeOpeningBracket = 0x5b; // "["
export var codeClosingBracket = 0x5d; // "]"
export var codeOpenParenthesis = 0x28; // "("
export var codeCloseParenthesis = 0x29; // ")"
export var codeSpace = 0x20; // " "
export var codeNewline = 0xa; // "\n"
export var codeTab = 0x9; // "\t"
export var codeReturn = 0xd; // "\r"
export var codeBackspace = 0x08; // "\b"
export var codeFormFeed = 0x0c; // "\f"
export var codeDoubleQuote = 0x0022; // "
export var codePlus = 0x2b; // "+"
export var codeMinus = 0x2d; // "-"
export var codeQuote = 0x27; // "'"
export var codeZero = 0x30;
export var codeOne = 0x31;
export var codeNine = 0x39;
export var codeComma = 0x2c; // ","
export var codeDot = 0x2e; // "." (dot, period)
export var codeColon = 0x3a; // ":"
export var codeSemicolon = 0x3b; // ";"
export var codeUppercaseA = 0x41; // "A"
export var codeLowercaseA = 0x61; // "a"
export var codeUppercaseE = 0x45; // "E"
export var codeLowercaseE = 0x65; // "e"
export var codeUppercaseF = 0x46; // "F"
export var codeLowercaseF = 0x66; // "f"
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

export function isHex(code) {
  return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
}
export function isDigit(code) {
  return code >= codeZero && code <= codeNine;
}
export function isNonZeroDigit(code) {
  return code >= codeOne && code <= codeNine;
}
export function isValidStringCharacter(code) {
  return code >= 0x20 && code <= 0x10ffff;
}
export function isDelimiter(char) {
  return regexDelimiter.test(char) || char && isQuote(char.charCodeAt(0));
}
var regexDelimiter = /^[,:[\]{}()\n]$/;
export function isStartOfValue(char) {
  return regexStartOfValue.test(char) || char && isQuote(char.charCodeAt(0));
}

// alpha, number, minus, or opening bracket or brace
var regexStartOfValue = /^[[{\w-]$/;
export function isControlCharacter(code) {
  return code === codeNewline || code === codeReturn || code === codeTab || code === codeBackspace || code === codeFormFeed;
}

/**
 * Check if the given character is a whitespace character like space, tab, or
 * newline
 */
export function isWhitespace(code) {
  return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
}

/**
 * Check if the given character is a special whitespace character, some
 * unicode variant
 */
export function isSpecialWhitespace(code) {
  return code === codeNonBreakingSpace || code >= codeEnQuad && code <= codeHairSpace || code === codeNarrowNoBreakSpace || code === codeMediumMathematicalSpace || code === codeIdeographicSpace;
}

/**
 * Test whether the given character is a quote or double quote character.
 * Also tests for special variants of quotes.
 */
export function isQuote(code) {
  // the first check double quotes, since that occurs most often
  return isDoubleQuote(code) || isSingleQuote(code);
}

/**
 * Test whether the given character is a double quote character.
 * Also tests for special variants of double quotes.
 */
export function isDoubleQuote(code) {
  // the first check double quotes, since that occurs most often
  return code === codeDoubleQuote || code === codeDoubleQuoteLeft || code === codeDoubleQuoteRight;
}

/**
 * Test whether the given character is a single quote character.
 * Also tests for special variants of single quotes.
 */
export function isSingleQuote(code) {
  return code === codeQuote || code === codeQuoteLeft || code === codeQuoteRight || code === codeGraveAccent || code === codeAcuteAccent;
}

/**
 * Strip last occurrence of textToStrip from text
 */
export function stripLastOccurrence(text, textToStrip) {
  var stripRemainingText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var index = text.lastIndexOf(textToStrip);
  return index !== -1 ? text.substring(0, index) + (stripRemainingText ? '' : text.substring(index + 1)) : text;
}
export function insertBeforeLastWhitespace(text, textToInsert) {
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
export function removeAtIndex(text, start, count) {
  return text.substring(0, start) + text.substring(start + count);
}

/**
 * Test whether a string ends with a newline or comma character and optional whitespace
 */
export function endsWithCommaOrNewline(text) {
  return /[,\n][ \t\r]*$/.test(text);
}
//# sourceMappingURL=stringUtils.js.map