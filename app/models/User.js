/**
 * Chat User
 */

import moment from 'moment/min/moment-with-locales';
import { getAvatarPlaceholder, getWallPlaceholder } from '../utils/UIUtils';

export const USER_STATUS = {
  UNKNOWN: 'unknown',
  ONLINE: 'online',
  OFFLINE: 'offline',
  BUSY: 'busy',
  AWAY: 'away',
};

export default class User {
  
  uid = '';
  email = '';
  fullName = '';
  phoneNumber = '';
  avatarImage = '';
  wallImage = '';
  status = USER_STATUS.UNKNOWN;

  // UI Logic
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

}
