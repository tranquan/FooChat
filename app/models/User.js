/**
 * Chat User
 */

import { getAvatarPlaceholder, getWallPlaceholder, hidePhoneNumber } from 'app/utils/UIUtils';

const removeDiacritics = require('diacritics').remove;

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'User.js';
/* eslint-enable */

// --------------------------------------------------
// User
// --------------------------------------------------

export default class User {

  static PRESENCE_STATUS = {
    UNKNOWN: 'unknown',
    ONLINE: 'online',
    OFFLINE: 'offline',
    BUSY: 'busy',
    AWAY: 'away',
  };

  static PRESENCE_STATUS_COLOR = {
    UNKNOWN: '#7c7c7c',
    ONLINE: '#69E387',
    OFFLINE: '#7c7c7c',
    BUSY: '#ff0000',
    AWAY: '#7c7c7c',
  };

  static PRESENCE_STATUS_STRING = {
    UNKNOWN: 'Không xác định',
    ONLINE: 'Đang hoạt động',
    OFFLINE: 'Đã thoát',
    BUSY: 'Đang bận',
    AWAY: 'Không ở gần',
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

  static getColorForPresenceStatus(status) {
    switch (status) {
      case User.PRESENCE_STATUS.ONLINE:
        return '#69E387';
      default: 
        return '#7c7c7c';
    }
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

  hiddenPhoneNumer() {
    if (!this.mHiddenPhoneNumber) {
      this.mHiddenPhoneNumber = hidePhoneNumber(this.phoneNumber);
    }
    return this.mHiddenPhoneNumber;
  }

  fullNameNoDiacritics() {
    if (!this.mFullNameNoDiacritics) {
      this.mFullNameNoDiacritics = removeDiacritics(this.fullName);
    }
    return this.mFullNameNoDiacritics;
  }

  presenceStatusColor() {
    if (this.presenceStatus === User.PRESENCE_STATUS.ONLINE) {
      return User.PRESENCE_STATUS_COLOR.ONLINE;
    }
    if (this.presenceStatus === User.PRESENCE_STATUS.OFFLINE) {
      return User.PRESENCE_STATUS_COLOR.OFFLINE;
    }
    if (this.presenceStatus === User.PRESENCE_STATUS.BUSY) {
      return User.PRESENCE_STATUS_COLOR.BUSY;
    }
    return User.PRESENCE_STATUS_COLOR.UNKNOWN;
  }
  
  presenceStatusString() {
    if (this.presenceStatus === User.PRESENCE_STATUS.ONLINE) {
      return User.PRESENCE_STATUS_STRING.ONLINE;
    }
    if (this.presenceStatus === User.PRESENCE_STATUS.OFFLINE) {
      return User.PRESENCE_STATUS_STRING.OFFLINE;
    }
    if (this.presenceStatus === User.PRESENCE_STATUS.BUSY) {
      return User.PRESENCE_STATUS_STRING.BUSY;
    }
    return User.PRESENCE_STATUS_STRING.UNKNOWN;
  }
}
