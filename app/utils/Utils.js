import Reactotron from 'reactotron-react-native';
import { Configs } from '../constants/configs';

// --------------------------------------------------

export default class Utils {
  static log(message, ...args) {
    if (!Configs.enableLog) return;
    Reactotron.display({
      name: 'LOG',
      preview: message,
      value: { message, args },
    });
  }
  static warn(message, ...args) {
    if (!Configs.enableLog) return;
    Reactotron.display({
      name: 'WARN',
      preview: message,
      value: { message, args },
      important: true,
    });
  }
  static error(message, ...args) {
    if (!Configs.enableLog) return;
    Reactotron.display({
      name: 'ERROR',
      preview: message,
      value: { message, args },
      important: true,
    });
  }
}

// --------------------------------------------------
// UTF-8 Encode/Decode
// Thanks to: https://gist.github.com/chrisveness/bcb00eb717e6382c5608
//
/* eslint-disable */
/**
 * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only).
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.
 *
 * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} unicodeString - Unicode string to be encoded as UTF-8.
 * @returns {string} UTF8-encoded string.
 */
export function utf8Encode(unicodeString) {
  if (typeof unicodeString != 'string') throw new TypeError('parameter ‘unicodeString’ is not a string');
  const utf8String = unicodeString.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) {
          var cc = c.charCodeAt(0);
          return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
  ).replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) {
          var cc = c.charCodeAt(0);
          return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
  );
  return utf8String;
}

/**
* Decodes utf-8 encoded string back into multi-byte Unicode characters.
*
* Can be achieved JavaScript by decodeURIComponent(escape(str)),
* but this approach may be useful in other languages.
*
* @param   {string} utf8String - UTF-8 string to be decoded back to Unicode.
* @returns {string} Decoded Unicode string.
*/
export function utf8Decode(utf8String) {
  if (typeof utf8String != 'string') throw new TypeError('parameter ‘utf8String’ is not a string');
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  const unicodeString = utf8String.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precedence)
          var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
          return String.fromCharCode(cc); }
  ).replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precedence)
          var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
          return String.fromCharCode(cc); }
  );
  return unicodeString;
}
/* eslint-enable */
