/**
 * Chat Thread
 */

import moment from 'moment/min/moment-with-locales';

export const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
};

export default class Thread {

  // meta data
  title = '';
  photoURL = '';
  
  // props
  uid = '';
  type = '';
  users = [];
  messages = [];
  createTime = 0;
  updateTime = 0;
  isDeleted = false;
  
  // --------------------------------------------------
  
  static mMyUser = {};
  static setup(user) {
    Thread.mMyUser = user;
  }

  static photoPlaceholder() {
    return null;
  }

  mGetDefaultSingleThreadTitle() {
    let title = 'Chat';
    const users = this.arrayOfUsers();
    if (users.length >= 2) {
      if (users[0].uid !== Thread.mMyUser.uid) {
        title = users[0].name;
      }
      else if (users[1].uid !== Thread.mMyUser.uid) {
        title = users[1].name;
      }
    }
    return title;
  }

  mGetDefaultGroupThreadTitle() {
    const users = this.arrayOfUsers();
    const names = users.map((user) => {
      const words = user.name.trim().split(' ');
      return words.length > 0 ? words[words.length - 1] : user.name.trim();
    });
    const title = names.join(', ');
    return title;
  }

  // --------------------------------------------------

  arrayOfUsers() {
    // get keys
    const usersObj = this.users;
    const keys = Object.keys(usersObj);
    // create array if needed
    if (!this.mArrayOfUsers || this.mArrayOfUsers.length !== keys.length) {
      const usersArray = [];
      for (let i = 0; i < keys.length; i += 1) {
        const user = usersObj[keys[i]];
        if (user) {
          usersArray.push(user);
        }
      }
      this.mArrayOfUsers = usersArray;
    }
    return this.mArrayOfUsers;
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

  photoURI() {
    if (!this.photoURL || this.photoURL.length === 0) {
      return Thread.photoPlaceholder();
    }
    return { uri: this.photoURL };
  }

}

