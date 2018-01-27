/**
 * Chat User
 */

import moment from 'moment/min/moment-with-locales';

import Utils from '../utils/Utils';
import { getAvatarPlaceholder, getWallPlaceholder } from '../utils/UIUtils';

export default class User {

  static PRESENCE_STATUS = {
    UNKNOWN: 'unknown',
    ONLINE: 'online',
    OFFLINE: 'offline',
    BUSY: 'busy',
    AWAY: 'away',
  };
  
  uid = '';
  email = '';
  mPhoneNumber = '';
  standardPhoneNumber = '';
  fullName = '';
  avatarImage = '';
  wallImage = '';
  presenceStatus = User.PRESENCE_STATUS.UNKNOWN;
  lastTimeOnline = 0;
  
  get phoneNumber() {
    return this.mPhoneNumber;
  }

  set phoneNumber(value) {
    this.mPhoneNumber = value;
    this.standardPhoneNumber = User.standardizePhoneNumber(value);
  }

  // Static Methods
  // --------------------------------------------------

  /**
   * Setup my user
   */
  static mMyUser = {};
  static setupMyUser(user) {
    User.mMyUser = user;
  }

  /**
   * Standardize phoneNumber in order to filter appay contacts from device contacts
   * - user will have a props: `standardPhoneNumber` which is exactly `maxDigits` digits
   * - if the phoneNumber longer than `maxDigits` digits, the firsts one will be trimmed
   * - if the phoneNumber shorter thant `maxDigits` digits, 0 will be prepend
   */
  static standardizePhoneNumber(phoneNumber = '', maxDigits = 8) {
    // remove non-digits
    let standardPhoneNumber = phoneNumber.replace(/\D/g, '');
    // prepend zero if phone number too short
    while (standardPhoneNumber.length < maxDigits) {
      standardPhoneNumber = '0'.concat(standardPhoneNumber);
    }
    // trim
    const index = standardPhoneNumber.length - maxDigits;
    return standardPhoneNumber.slice(index);
  }

  // UI Logics
  // --------------------------------------------------

  avatarImageURI() {
    if (!this.avatarImage || this.avatarImage.length === 0) {
      return this.avatarImagePlaceholder();
    }
    return { uri: this.avatarImage };
  }

  wallImageURI() {
    if (!this.wallImage || this.wallImage.legnth === 0) {
      return this.wallImagePlaceholder();
    }
    return { uri: this.wallImage };
  }

  avatarImagePlaceholder() {
    return getAvatarPlaceholder(this.gender);
  }

  wallImagePlaceholder() {
    return getWallPlaceholder();
  }

  presenceStatusColor() {
    if (this.presenceStatus === User.PRESENCE_STATUS.ONLINE) {
      return '#69E387';
    }
    if (this.presenceStatus === User.PRESENCE_STATUS.BUSY) {
      return '#ff0000';
    }
    return '#7c7c7c';
  }
}
