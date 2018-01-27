/**
 * Entity in Realtime Database on firebase will have this format
 * -> <entity>/<entity_uid>/<entity_props>
 * -> uid will be used as the key to access an entity.
 * -> inside entity props, uid is not required to have
 */
import firebase from 'react-native-firebase';

import User from '../models/User';
import Thread from '../models/Thread';
import Utils from '../utils/Utils';

const DATABASE = firebase.database();
const CONNECTED_REF = DATABASE.ref('.info/connected');
const CHAT_REF = DATABASE.ref('chat');
const USERS_REF = CHAT_REF.child('users');
// const USERS_THREADS_REF = CHAT_REF.child('users_threads');
const USERS_PRESENCE_REF = CHAT_REF.child('users_presence');
const THREADS_REF = CHAT_REF.child('threads');
const THREADS_MESSAGES_REF = CHAT_REF.child('threads_messages');

const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
};

const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
};

const ERRORS = {
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  USER_NOT_FOUND: 'THREAD_NOT_FOUND',
  SINGLE_THREAD_INVALID_ID: 'SINGLE_THREAD_INVALID_ID',
  SINGLE_THREAD_ALREADY_EXISTS: 'SINGLE_THREAD_ALREADY_EXISTS',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

class FirebaseDatabase {

  // --------------------------------------------------
  // Helpers - Private API
  // -> these are just simple functions help to insert/remove/edit firebase db
  // -> caller must responsible to do appropriate logic check if needed
  // -> for instance: if add user to thread, caller need to check whether thread exists or not
  // --------------------------------------------------

  static mRemoveUserNonMetaData(user) {
    const userMetaData = user;
    delete userMetaData.threads;
    delete userMetaData.presenceStatus;
    delete userMetaData.lastTimeOnline;
    return userMetaData;
  }

  static mUpdateUser(userID, metaData) {
    // filterout non-metadata props
    const userMetaData = metaData;
    delete userMetaData.threads;
    delete userMetaData.presenceStatus;
    delete userMetaData.lastTimeOnline;
    // request
    return new Promise((resolve) => {
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const userRef = USERS_REF.child(fbUserID);
      userRef.update(userMetaData, (err) => {
        resolve(err === null);
      });
    });
  }

  /**
   * Create a single conversation
   * -> caller must check for the exist of thread before calling this function
   * -> otherwise the old thread will be deleted, 
   * -> because each single chat between 2 user is unique
   * @param {User} user1
   * @param {User} user2
   * @returns Promise contain true if success, or exception
   */
  static mAddSingleThread(user1, user2) {
    // request
    return new Promise((resolve, reject) => {
      const threadID = FirebaseDatabase.generateSingleThreadID(user1.uid, user2.uid);
      if (!threadID) {
        reject(new Error(ERRORS.SINGLE_THREAD_INVALID_ID));
        return;
      }
      const members = {};
      const fbUserID1 = FirebaseDatabase.firebaseUserID(user1.uid);
      const fbUserID2 = FirebaseDatabase.firebaseUserID(user2.uid);
      const user1MetaData = FirebaseDatabase.mRemoveUserNonMetaData(user1);
      const user2MetaData = FirebaseDatabase.mRemoveUserNonMetaData(user2);
      members[fbUserID1] = user1MetaData;
      members[fbUserID2] = user2MetaData;
      THREADS_REF.child(threadID).set({
        uid: threadID,
        type: THREAD_TYPES.SINGLE,
        users: members,
        createTime: firebase.database.ServerValue.TIMESTAMP,
        updateTime: firebase.database.ServerValue.TIMESTAMP,
        isDeleted: false,
      }, (err) => {
        if (!err) {
          resolve(true);
        } else {
          Utils.warn('mAddSingleThread error: ', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Create a conversation for a group of users
   * @param {User} users: list of member in the conversation
   * @param {string} title
   * @param {string} photoURL
   * @returns Promise contain true if success, or exception 
   */
  static mAddGroupThread(users, metaData) {
    // generate members with key is user uid
    const members = {};
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(user.uid);
      members[fbUserID] = { ...user };
    }
    // add thread
    return new Promise((resolve, reject) => {
      const threadRef = THREADS_REF.push();
      if (!threadRef) {
        resolve(null);
        return;
      }
      const threadID = threadRef.key;
      threadRef.set({
        ...metaData,
        uid: threadID,
        type: THREAD_TYPES.GROUP,
        users: members,
        createTime: firebase.database.ServerValue.TIMESTAMP,
        updateTime: firebase.database.ServerValue.TIMESTAMP,
        isDeleted: false,
      }, (err) => {
        if (!err) {
          resolve(threadID);
        } else {
          Utils.warn('mAddGroupThread error: ', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Add list of threadID to a user
   * @param {string} userID 
   * @param {[string]} threadIDs 
   * @returns Promise when all of threads is added to user
   */
  static mAddThreadIDsToUser(userID, threadIDs) {
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    const userThreadsRef = USERS_REF.child(fbUserID).child('threads');
    const tasks = [];
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      tasks.push(userThreadsRef.child(threadID).set({
        createTime: firebase.database.ServerValue.TIMESTAMP,
        updateTime: firebase.database.ServerValue.TIMESTAMP,
      }));
    }
    return Promise.all(tasks);
  }

  /**
   * Remove list of threadID from a user
   * @param {string} userID 
   * @param {array of string} threadIDs 
   */
  static mRemoveThreadIDsFromUser(userID, threadIDs) {
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    const userThreadsRef = USERS_REF.child(fbUserID).child('threads');
    const tasks = [];
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      tasks.push(userThreadsRef.child(threadID).remove());
    }
    return Promise.all(tasks);
  }

  /**
   * Add list of Users to a thread
   * @param {string} threadID 
   * @param {array of User} users 
   * @returns Promise contain true/false
   */
  static mAddUsersToThread(threadID, users) {
    const threadUsersRef = THREADS_REF.child(threadID).child('users');
    const tasks = [];
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      tasks.push(threadUsersRef.child(user.uid).set(user));
    }
    return Promise.all(tasks);
  }

  /**
   * Remove list of Users from a thread
   * @param {string} threadID 
   * @param {array of string} userIDs 
   */
  static mRemoveUsersFromThread(threadID, userIDs) {
    const threadUsersRef = THREADS_REF.child(threadID).child('users');
    const tasks = [];
    for (let i = 0; i < userIDs.length; i += 1) {
      const userID = userIDs[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      tasks.push(threadUsersRef.child(fbUserID).remove());
    }
    return Promise.all(tasks);
  }

  /**
   * Update thread details props. 
   * - The meta-data object will be spread to flatten props inside
   * - The thread's updateTime on `users/<user_id>/threads/<thread_id>` 
   *  will also be updated by Cloud Functions
   * @param {string} threadID 
   * @param {Object} metaData
   * @returns true/false
   */
  static mUpdateThreadMetaData(threadID, metaData) {
    return new Promise((resolve, reject) => {
      THREADS_REF.child(threadID).update({
        ...metaData,
        updateTime: firebase.database.ServerValue.TIMESTAMP,
      }, (err) => {
        if (!err) {
          resolve(true);
        } else {
          Utils.warn('mUpdateThreadMetaData error: ', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Add a message into a thread
   * -> Caller must check whether thread exists or not
   * @param {Message} message 
   * @param {string} threadID 
   * @returns a Promise contains messageID or null
   */
  static mAddMessageToThread(threadID, message) {
    return new Promise((resolve, reject) => {
      const threadMessagesRef = THREADS_MESSAGES_REF.child(threadID).child('messages');
      const messageRef = threadMessagesRef.push({});
      if (!messageRef) {
        resolve(null);
        return;
      }
      const messageID = messageRef.key;
      messageRef.set({
        ...message,
        uid: messageID,
        createTime: firebase.database.ServerValue.TIMESTAMP,
        updateTime: firebase.database.ServerValue.TIMESTAMP,
        isDeleted: false,
      }, (err) => {
        if (!err) {
          resolve(messageID);
        } else {
          Utils.warn('mAddMessageToThread error: ', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Remove a message in a thread by change its props isDeleted to true
   * @param {string} messageID 
   * @param {string} threadID
   * @returns a Promise contain true/false
   */
  static mRemoveMessageFromThread(messageID, threadID) {
    return new Promise((resolve, reject) => {
      const threadMessagesRef = THREADS_MESSAGES_REF.child(threadID).child('messages').child(messageID);
      if (!threadMessagesRef) {
        resolve(false);
        return;
      }
      threadMessagesRef.remove((err) => {
        if (!err) {
          resolve(true);
        } else {
          Utils.warn('mRemoveMessageFromThread error: ', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Check whether thread object is valid
   * @param {Thread} thread 
   */
  static mIsThreadValid(thread) {
    // thread is null, false
    if (!thread || !thread.users) { 
      return false; 
    }
    // get total users
    const totalUsers = Object.keys(thread.users).length;
    // single thread must have 2 users
    if (thread.type === THREAD_TYPES.SINGLE && totalUsers === 2) {
      return true;
    }
    // group threads must have more than 1 user
    if (thread.type === THREAD_TYPES.GROUP && totalUsers > 0) {
      return true;
    }
    // others is false
    return false;
  }

  // --------------------------------------------------
  // Methods - Public API
  // --------------------------------------------------

  static getDatabase() { return DATABASE; }

  static getConnectedRef() { return CONNECTED_REF; }

  static getChatRef() { return CHAT_REF; }

  static getUsersRef() { return USERS_REF; }

  static getUsersPresenceRef() { return USERS_PRESENCE_REF; }

  static getThreadsRef() { return THREADS_REF; }

  static getThreadsMessagesRef() { return THREADS_MESSAGES_REF; }

  /**
   * UserID use in firebase to make sure firebase always threat users as object/dict, not array
   * @param {string} userID 
   */
  static firebaseUserID(userID) {
    return `user_${userID}`;
  }

  /**
   * Convert from firebase userID to normal
   * @param {string} fbUserID 
   */
  static normalUserID(fbUserID) {
    if (fbUserID && fbUserID.length > 5) {
      return fbUserID.slice(5);
    }
    return fbUserID;
  }

  // CONTACTS
  // --------------------------------------------------

  static async updateUser(userID, metaData) {
    const result = FirebaseDatabase.mUpdateUser(userID, metaData);
    return result;
  }

  static async toggleContactFavorite(userID, contactID, isFavorite) {
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    const fbContactID = FirebaseDatabase.firebaseUserID(contactID);
    const threadRef = USERS_REF.child(`${fbUserID}/contacts/${fbContactID}`);
    return new Promise((resolve) => {
      threadRef.update({
        isFavorite,
      }, (err) => {
        resolve(err === null);
      });
    });
  }

  static async toggleFavoriteThread(userID, threadID, isFavorite) {
    const fbUserID = FirebaseDatabase.firebaseUserID(userID);
    const threadRef = USERS_REF.child(`${fbUserID}/threads/${threadID}`);
    return new Promise((resolve) => {
      threadRef.update({
        isFavorite,
      }, (err) => {
        resolve(err === null);
      });
    });
  }

  // CHAT
  // --------------------------------------------------

  /**
   * For single thread, threadID has format: `single_user1UID_user2UID`
   * where user1UID < user2UID
   */
  static generateSingleThreadID(userID1, userID2) {
    const uid1 = parseInt(userID1, 10);
    const uid2 = parseInt(userID2, 10);
    if (uid1 < 0 || uid2 < 0 || uid1 === uid2) {
      return null;
    }
    else if (uid1 < uid2) {
      return `single_${uid1}_${uid2}`;
    }
    else if (uid1 > uid2) {
      return `single_${uid2}_${uid1}`;
    }
    return null;
  }

  /**
   * Get a User base on userID
   * @param {string} userID 
   */
  static async getUser(userID) {
    try {
      const user = await USERS_REF.child(userID).once('value');
      if (user && user.exists()) {
        return user.val();
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get Thread object from firebase base on threadID
   * @param {string} threadID
   * @returns nullable Thread object
   */
  static async getThread(threadID) {
    try {
      const thread = await THREADS_REF.child(threadID).once('value');
      if (thread && thread.exists()) {
        return thread.val();
      }
      return null;
    } catch (err) {
      Utils.warn(`getThread error: ${err}`, err);
      return null;
    }
  }

  /**
   * Get user's threads base on userID
   * @param {string} userID
   * @param {timestamp} fromUpdateTime
   * @returns array of Thread, order desc by updateTime, 1st one is the newest
   */
  static async getThreadsOfUser(userID, fromUpdateTime = null, maxThreadsFetch = 44) {
    try {
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      let threadsQuery = USERS_REF.child(fbUserID).child('threads').orderByChild('updateTime');
      if (fromUpdateTime) {
        threadsQuery = threadsQuery.startAt(fromUpdateTime);
      }
      const threads = await threadsQuery.limitToLast(maxThreadsFetch).once('value');
      if (threads && threads.exists()) {
        // convert object to array
        const threadsObj = threads.val();
        const keys = Object.keys(threadsObj);
        // fetch threads
        const threadsArray = [];
        for (let i = 0; i < keys.length; i += 1) {
          const threadID = keys[i];
          const thread = await FirebaseDatabase.getThread(threadID); // eslint-disable-line
          if (FirebaseDatabase.mIsThreadValid(thread)) {
            threadsArray.push(thread);
          }
        }
        threadsArray.sort((thread1, thread2) => {
          if (thread1.updateTime > thread2.updateTime) {
            return -1;
          } else if (thread1.updateTime < thread2.updateTime) {
            return 1;
          }
          return 0;
        });
        return threadsArray;
      }
      return [];
    } catch (err) {
      Utils.warn(`getThreadsOfUser error: ${err}`, err);
      return [];
    }
  }

  /**
   * Get Message object in a Thread from firebase base on messageID
   * @param {string} threadID
   * @param {string} messageID
   * @returns nullable Message object
   */
  static async getMessageInThread(threadID, messageID) {
    try {
      const message = await THREADS_MESSAGES_REF
        .child(threadID).child(`messages/${messageID}`)
        .once('value');
      if (message && message.exists()) {
        return message.val();
      }
      return null;
    } catch (err) {
      Utils.warn(`getMessageInThread error: ${err}`, err);
      return null;
    }
  }
  
  /**
   * Get last Message object in a Thread
   * @param {string} threadID
   * @returns nullable Message object
   */
  static async getLastMessageInThread(threadID) {
    try {
      const message = await THREADS_MESSAGES_REF
        .child(`${threadID}/messages`).orderByChild('createTime').limitToLast(1)
        .once('value');
      if (message && message.exists()) {
        return message.val();
      }
      return null;
    } catch (err) {
      Utils.warn(`getLastMessageInThread error: ${err}`, err);
      return null;
    }
  }

  /**
   * Get messages in a Thread, messages are or
   * @param {string} threadID 
   * @param {string} fromMessage: message key / uid
   * @param {number} maxMessages
   * @returns array of Message, order by createTime, 1st message is the newest
   */
  static async getMessagesInThread(threadID, fromMessage = null, maxMessages = 44) {
    try {
      let maxMessagesFetch = maxMessages;
      let messagesQuery = THREADS_MESSAGES_REF.child(threadID).child('messages').orderByKey();
      // need to fetch one additional message if fetch from a message
      if (fromMessage) {
        maxMessagesFetch += 1;
        messagesQuery = messagesQuery.endAt(fromMessage);
      }
      const messages = await messagesQuery.limitToLast(maxMessagesFetch).once('value');
      if (messages && messages.exists()) {
        // convert object to array & sort by time desceding
        // since key is already sort by create time ascending, we only need to reverse
        const messagesObj = messages.val();
        const keys = Object.keys(messagesObj).sort().reverse();
        // remove the first one if fetch from a message
        if (keys.length > 0 && fromMessage) {
          keys.shift();
        }
        // map to array
        const messagesArray = keys.map((key) => {
          return { uid: key, ...messagesObj[key] };
        });
        return messagesArray;
      }
      return [];
    } catch (err) {
      Utils.warn(`getMessagesInThread error: ${err}`, err);
      return [];
    }
  }

  /**
   * Create single thread for conversation between user1 & user2
   * If thread already created, return that thread
   * @param {User} user1
   * @param {User} user2
   * @return nullable Thread object
   */
  static async createSingleThread(user1, user2) {
    try {
      // get threadID
      const threadID = FirebaseDatabase.generateSingleThreadID(user1.uid, user2.uid);
      if (!threadID) {
        return null;
      }
      // return thread if it's already exists
      const thread = await FirebaseDatabase.getThread(threadID);
      if (thread) {
        return thread;
      }
      // create new thread
      const result = await FirebaseDatabase.mAddSingleThread(user1, user2);
      if (!result) {
        return null;
      }
      // add thread to user1 & user2
      await FirebaseDatabase.mAddThreadIDsToUser(user1.uid, [threadID]);
      await FirebaseDatabase.mAddThreadIDsToUser(user2.uid, [threadID]);
      // return new thread
      const newThread = await FirebaseDatabase.getThread(threadID);
      return newThread;
    } catch (err) {
      Utils.warn(`createSingleThread error: ${err}`, err);
      return null;
    }
  }

  /**
   * Create group thread for conversation for many users
   * @param {User} users 
   * @param {string} title 
   * @param {string} photoURL
   * @returns nullable Thread object
   */
  static async createGroupThread(users, metaData) {
    try {
      // create new thread
      const threadID = await FirebaseDatabase.mAddGroupThread(users, metaData);
      // add thread to users
      const tasks = [];
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        tasks.push(FirebaseDatabase.mAddThreadIDsToUser(user.uid, [threadID]));
      }
      await Promise.all(tasks);
      // return new thread
      const newThread = await FirebaseDatabase.getThread(threadID);
      return newThread;
    } catch (err) {
      Utils.warn(`createGroupThread: ${err}`, err);
      return null;
    }
  }

  /**
   * Add list of users to a thread
   * @param {User} users 
   * @param {string} threadID 
   * @returns true/false
   */
  static async addUsersToGroupThread(threadID, users) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        Utils.warn(`addUsersToGroupThread: thread is not found: ${threadID}`);
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        Utils.warn(`addUsersToGroupThread: thread is not a group: ${thread.type}`);
        return false;
      }
      // add users to thread
      await FirebaseDatabase.mAddUsersToThread(threadID, users);
      // add threadID to each user
      const tasks = [];
      for (let i = 0; i < users.length; i += 1) {
        const user = users[i];
        tasks.push(FirebaseDatabase.mAddThreadIDsToUser(user.uid, [threadID]));
      }
      await Promise.all(tasks);
      return true;
    } catch (err) {
      Utils.warn(`addUsersToGroupThread: ${err}`, err);
      return false;
    }
  }

  /**
   * Remove list of users from a thread
   * @param {array of string} userIDs 
   * @param {string} threadID 
   */
  static async removeUsersFromGroupThread(threadID, userIDs) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        Utils.warn(`removeUsersFromGroupThread: thread is not found: ${threadID}`);
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        Utils.warn(`removeUsersFromGroupThread: thread is not a group: ${thread.type}`);
        return false;
      }
      // remove users from thread
      await FirebaseDatabase.mRemoveUsersFromThread(threadID, userIDs);
      // remove threadID from user
      const tasks = [];
      for (let i = 0; i < userIDs.length; i += 1) {
        const userID = userIDs[i];
        tasks.push(FirebaseDatabase.mRemoveThreadIDsFromUser(userID, [threadID]));
      }
      await Promise.all(tasks);
      return true;
    } catch (err) {
      Utils.warn(`removeUsersFromGroupThread: ${err}`, err);
      return false;
    }
  }

  /**
   * Update group thread meta data
   * @param {string} title 
   * @param {string} photoURL 
   * @returns true/false
   */
  static async updateGroupThreadMetadata(threadID, metaData) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        Utils.warn(`updateGroupThreadMetadata: thread is not found: ${threadID}`);
        return false;
      }
      // is thread a group
      if (thread.type !== THREAD_TYPES.GROUP) {
        Utils.warn(`updateGroupThreadMetadata: thread is not a group: ${thread.type}`);
        return false;
      }
      // update
      await FirebaseDatabase.mUpdateThreadMetaData(threadID, metaData);
      return true;
    } catch (err) {
      Utils.warn(`updateGroupThreadMetadata: ${err}`, err);
      return false;
    }
  }

  /**
   * Add a message to a Thread. Message can have many type
   * At this level, we don't care about Message structure
   * @param {Message} message 
   * @param {string} threadID 
   * @returns nullable Message object
   */
  static async sendMessage(message, threadID) {
    try {
      // is thread exist
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        Utils.log(`sendMessage: error: not found thread: ${threadID}`);
        return null;
      }
      // add message to thread
      const messageID = await FirebaseDatabase.mAddMessageToThread(threadID, message);
      if (!messageID) {
        Utils.log(`sendMessage: error: add message to thread error: ${threadID}`, message);
        return null;
      }
      // fetch message & return
      const newMessage = await FirebaseDatabase.getMessageInThread(threadID, messageID);
      return newMessage;
    } catch (err) {
      Utils.warn(`sendMessage error: ${err}`, err);
      return false;
    }
  }
}

export default FirebaseDatabase;
