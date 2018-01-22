/**
 * Chat User
 */

import moment from 'moment/min/moment-with-locales';

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
  phoneNumber = '';
  fullName = '';
  phoneNumber = '';
  avatarImage = '';
  wallImage = '';
  presenceStatus = User.PRESENCE_STATUS.UNKNOWN;

  // UI Logic
  // --------------------------------------------------

  static mMyUser = {};
  static setupMyUser(user) {
    User.mMyUser = user;
  }

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
