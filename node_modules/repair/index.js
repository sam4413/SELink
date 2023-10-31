'use strict';

/**
 * Repair instances of native constructors.
 *
 * @param {Mixed} src Object or array source.
 * @returns {Mixed} Repaired source.
 * @api public
 */
var repair = module.exports = function repair(src) {
  var t = repair.type(src);

  if (src && src.iterator || 'object' === t || 'array' === t) {
    Object.keys(src).forEach(function (key) {
      src[key] = repair(src[key]);
    });
  }

  return t in repair ? repair[t](src) : src;
};

/**
 * Extended version of typeof check.
 *
 * @param {Mixed} value Instance of constructor.
 * @returns {String} typeof instance.
 * @api private
 */
repair.type = function type(value) {
  return {}.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

/**
 * Repair RegExp.
 *
 * @param {RegExp} value
 * @returns {RegExp}
 * @api private
 */
repair.regexp = function regexp(value) {
  if (value instanceof RegExp) return value;

  value = value.toString().split('/');
  return new RegExp(value[1], value.pop());
};

/**
 * Repair Date.
 *
 * @param {Date} value
 * @returns {Date}
 * @api private
 */
repair.date = function date(value) {
  return value instanceof Date ? value : new Date(value.toString());
};