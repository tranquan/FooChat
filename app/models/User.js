/**
 * Chat User
 */

import moment from 'moment/min/moment-with-locales';

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
}
