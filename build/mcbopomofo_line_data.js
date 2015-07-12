'use strict';

// Function to parse each line of data.txt from McBopomofo to sortable
// JS object.

var BopomofoEncoder = require('../lib/bopomofo_encoder.js');

var McBopomofoLineData = function McBopomofoData() {
};

McBopomofoLineData.prototype.isValid = false;
McBopomofoLineData.prototype.encodedStr = '';
McBopomofoLineData.prototype.shortcutEncodedStr = '';
McBopomofoLineData.prototype.str = '';
McBopomofoLineData.prototype.score = 0;

McBopomofoLineData.prototype.onwarning = null;

// This regexp adds the first tone to data given by McBopomofo.
McBopomofoLineData.prototype.ADD_FIRST_TONE_REGEXP = new RegExp('([^' +
  String.fromCharCode(BopomofoEncoder.BOPOMOFO_TONE_2,
                      BopomofoEncoder.BOPOMOFO_TONE_3,
                      BopomofoEncoder.BOPOMOFO_TONE_4,
                      BopomofoEncoder.BOPOMOFO_TONE_5) +
  '])(\-|$)', 'g');

McBopomofoLineData.prototype.ADD_FIRST_TONE_REPLACESTR =
  '$1' + String.fromCharCode(BopomofoEncoder.BOPOMOFO_TONE_1) + '$2';

McBopomofoLineData.prototype.parse = function(lineStr) {
  // Skip empty lines
  if (!lineStr) {
    return;
  }

  var row = lineStr.split(' ');

  // Skip punctuations
  if (row[1].indexOf('_punctuation_') !== -1) {
    if (typeof this.onwarning === 'function') {
      this.onwarning(
        'McBopomofoLineData' ,
        'Skipping data: "' + row[0] + '" marked as punctuation.');
    }
    return;
  }

  var symbols = row[1].replace(this.ADD_FIRST_TONE_REGEXP,
                               this.ADD_FIRST_TONE_REPLACESTR);
  var encodedStr = BopomofoEncoder.encode(symbols.replace(/\-/g, ''));

  if (row[0].length !== encodedStr.length) {
    if (typeof this.onwarning === 'function') {
      this.onwarning(
        'McBopomofoLineData' ,
        'Skipping data: "' + row[0] + '" (' + row[0].length + ').' +
          ' The phonetics are "' + row[1] + '" (' +
          encodedStr.length + ').');
    }
    return;
  }

  this.isValid = true;
  this.str = row[0];
  this.score = parseFloat(row[2], 10);
  this.encodedStr = encodedStr;
  this.shortcutEncodedStr = BopomofoEncoder.encode((function() {
    return symbols.split('-').map(function(str) {
      return str[0];
    }).join('');
  }()));
};

// Export as a CommonJS module if we are loaded as one.
if (typeof module === 'object' && module.exports) {
  module.exports = McBopomofoLineData;
}
