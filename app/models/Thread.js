/**
 * Chat Thread
 */

import moment from 'moment/min/moment-with-locales';

import User from './User';

export const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
};

export default class Thread {

  // meta data
  title = '';
  photoImage = '';
  
  // props
  uid = '';
  type = '';
  users = [];
  adminID = '';
  createTime = 0;
  updateTime = 0;
  isDeleted = false;
  
  // --------------------------------------------------
  
  static mMyUser = {};
  static setupMyUser(user) {
    Thread.mMyUser = user;
  }

  mGetDefaultSingleThreadTitle() {
    const targetUser = this.getSingleThreadTargetUser();
    return targetUser ? targetUser.fullName : 'Chat';
  }

  mGetDefaultGroupThreadTitle() {
    const users = this.getUsersArray();
    const names = users.map((user) => {
      const words = user.fullName.trim().split(' ');
      return words.length > 0 ? words[words.length - 1] : user.fullName.trim();
    });
    const title = names.join(', ');
    return title;
  }

  // UI Logic
  // --------------------------------------------------

  isSingleThread() {
    return this.type === THREAD_TYPES.SINGLE;
  }

  isGroupThread() {
    return this.type === THREAD_TYPES.GROUP;
  }

  getUsersArray() {
    // get keys
    const usersObj = this.users;
    const keys = Object.keys(usersObj);
    // re-create array of users if needed
    if (!this.mUsersArray || this.mUsersArray.length !== keys.length) {
      const usersArray = [];
      for (let i = 0; i < keys.length; i += 1) {
        const userJSON = usersObj[keys[i]];
        // convert to User object
        if (userJSON) {
          const user = Object.assign(new User(), userJSON);
          usersArray.push(user);
        }
      }
      this.mUsersArray = usersArray;
    }
    return this.mUsersArray;
  }

  getSingleThreadTargetUser() {
    // check
    if (this.isGroupThread()) { 
      return null; 
    }
    // get target
    if (!this.mSingleThreadTargetUser) {
      const users = this.getUsersArray();
      const myUserID = Thread.mMyUser.uid;
      this.mSingleThreadTargetUser = users[0].uid === myUserID ? users[1] : users[0];
    }
    return this.mSingleThreadTargetUser;
  }

  createTimeMoment() {
    if (!this.mCreateTimeMoment) {
      this.mCreateTimeMoment = moment(this.createTime, 'X');
    }
    return this.mCreateTimeMoment;
  }

  updateTimeMoment() {
    if (!this.mUpdateTimeMoment) {
      this.mUpdateTimeMoment = moment(this.updateTime, 'X');
    }
    return this.mUpdateTimeMoment;
  }

  createTimeString(format = 'DD/MM/YYYY') {
    return this.createTimeMoment().format(format);
  }

  createTimeAgoString() {
    return this.createTimeMoment().fromNow();
  }

  titleString() {
    // single
    if (this.type === THREAD_TYPES.SINGLE) {
      if (!this.mSingleThreadTitle) {
        this.mSingleThreadTitle = this.mGetDefaultSingleThreadTitle();
      }
      return this.mSingleThreadTitle;
    }
    // group
    if (this.type === THREAD_TYPES.GROUP) {
      if (!this.title || this.title.length === 0) {
        if (!this.mGroupThreadTitle) {
          this.mGroupThreadTitle = this.mGetDefaultGroupThreadTitle();
        }
        return this.mGroupThreadTitle;
      }
    }
    // others
    return this.title;
  }

  statusString() {
    // single
    if (this.type === THREAD_TYPES.SINGLE) {
      return this.getSingleThreadTargetUser().presenceStatusString();
    }
    // group
    if (this.type === THREAD_TYPES.GROUP) {
      return 'todo: group contact status';
    }
    // others
    return 'todo: status';
  }

  photoImageURI() {
    // single
    if (this.isSingleThread()) {
      const targetUser = this.getSingleThreadTargetUser();
      return targetUser.avatarImageURI();
    }
    // group
    if (!this.photoImage || this.photoImage.length === 0) {
      return this.photoImagePlaceholder();
    }
    return { uri: this.photoImage };
  }

  photoImagePlaceholder() {
    return require('./img/thread.png');
  }

  totalUnReadMessages() {
    return 0;
  }

  lastMessage() {
    return 'this is the last message';
  }

}

