import firebase from 'react-native-firebase';
import User from '../models/User';
import Thread from '../models/Thread';
import Utils from '../utils/Utils';

const DATABASE = firebase.database();
const CHAT_REF = DATABASE.ref('chat');
const USERS_REF = CHAT_REF.child('users');
const THREADS_REF = CHAT_REF.child('threads');

const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
};

const ERRORS = {
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  USER_NOT_FOUND: 'THREAD_NOT_FOUND',
  SINGLE_THREAD_INVALID_ID: 'SINGLE_THREAD_INVALID_ID',
  SINGLE_THREAD_ALREADY_EXISTS: 'SINGLE_THREAD_ALREADY_EXISTS',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

class RealtimeDatabase {

  // --------------------------------------------------
  // Methods - Public API
  // --------------------------------------------------

  static test() {
    const asyncTask = async () => {
      try {
        const user1 = {
          uid: '1',
          name: 'User 1',
        };
        const user2 = {
          uid: '2',
          name: 'User 2',
        };
        const thread = await RealtimeDatabase.createSingleThread(user1, user2);
        Utils.log(`create thread success: ${JSON.stringify(thread)}`, thread);
      } catch (err) {
        Utils.log(`create thread exception: ${err}`);
      }
    };
    asyncTask();
    
    // RealtimeDatabase.testAddThreadsToUser();
  }

  static testAddThreadsToUser() {
    const asyncTask = async () => {
      try {
        await RealtimeDatabase.mAddThreadIDsToUser('1', ['single_1_2']);
        await RealtimeDatabase.mAddThreadIDsToUser('2', ['single_1_2']);
      } catch (err) {
        Utils.log(`add thread to user exception: ${err}`);
      }
    };
    asyncTask();
  }

  static getDatabase() {
    return DATABASE;
  }

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
   * Get Thread object from firebase base on threadID
   * @param {string} threadID
   * @returns nullable Thread object
   */
  static async getThread(threadID) {
    try {
      const thread = await THREADS_REF.child(threadID).once('value');
      if (thread && thread.val()) {
        return thread.val();
      }
      return null;
    } catch (err) {
      return null;
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
      const threadID = RealtimeDatabase.generateSingleThreadID(user1.uid, user2.uid);
      if (!threadID) {
        return null;
      }
      // return thread if it's already exists
      const thread = await RealtimeDatabase.getThread(threadID);
      if (thread) {
        return thread;
      }
      // create new thread
      const result = await RealtimeDatabase.mAddSingleThread(user1, user2);
      if (!result) {
        return null;
      }
      const newThread = await RealtimeDatabase.getThread(threadID);
      // add thread to user1 & user2
      await RealtimeDatabase.mAddThreadIDsToUser(user1.uid, [newThread.uid]);
      await RealtimeDatabase.mAddThreadIDsToUser(user2.uid, [newThread.uid]);
      // return
      return newThread;
    } catch (err) {
      Utils.warn(`createSingleThread: ${err}`, err);
      return null;
    }
  }

  static testCreateSingleThread() {

  }

  static createGroupThread() {
    
  }

  /**
   * 
   * @param {*} hello 
   */
  static updateGroupThread(hello) {

  }

  static updateUser() {

  }

  static sendTextMessage(message, threadID, fromUser) {
    
  }

  static sendImageMessage(message, imageURL, threadID, fromUser) {

  }

  // --------------------------------------------------
  // Helpers - Private API
  // --------------------------------------------------

  /**
   * Caller must check for the exist of thread before calling this function
   * otherwise the old thread will be deleted, because each single chat between 2 user is unique
   * @param {User} user1
   * @param {User} user2
   * @returns Promise contain true if success
   */
  static mAddSingleThread(user1, user2) {
    return new Promise((resolve, reject) => {
      const threadID = RealtimeDatabase.generateSingleThreadID(user1.uid, user2.uid);
      if (!threadID) {
        reject(new Error(ERRORS.SINGLE_THREAD_INVALID_ID));
        return;
      }
      const members = [];
      members[user1.uid] = user1;
      members[user2.uid] = user2;
      THREADS_REF.child(threadID).set({
        uid: threadID,
        type: THREAD_TYPES.SINGLE,
        messages: [],
        users: members,
        create_time: firebase.database.ServerValue.TIMESTAMP,
        update_time: firebase.database.ServerValue.TIMESTAMP,
      }, (err) => {
        if (!err) {
          resolve(true);
        } else {
          Utils.warn('addSingleThread add error: ', err);
          reject(err);
        }
      });
    });
  }

  /**
   * Create a conversation for a group of users
   */
  // static mAddGroupThread(users, title = '', photoURL = null) {
  //   // generate members with key is user uid
  //   const members = [];
  //   for (let i = 0; i < users.length; i += 1) {
  //     const user = users[i];
  //     members[user.uid] = user;
  //   }
  //   // add thread
  //   return new Promise((resolve, reject) => {
  //     const threadRef = THREADS_REF.push({
  //       title,
  //       photoURL,
  //       type: THREAD_TYPES.GROUP,
  //       messages: [],
  //       users: members,
  //       create_time: firebase.database.ServerValue.TIMESTAMP,
  //       update_time: firebase.database.ServerValue.TIMESTAMP,
  //     }, (error) => {
  //       if (!error) {
  //         resolve(true);
  //       } else {
  //         reject(error);
  //       }
  //     });
  //     // add thread id to each user
  //     if (!threadRef) {
  //       reject(new Error(ERRORS.UNKNOWN_ERROR));
  //       return;
  //     }
  //     const threadID = threadRef.key;
  //     for (let i = 0; i < users.length; i += 1) {
  //       const userID = users[i].uid;
  //       RealtimeDatabase.addThreadsToUser([threadID], userID);
  //     }
  //   });
  // }

  /**
   * Add list of threadID to a user
   * @param {string} userID 
   * @param {[string]} threadIDs 
   * @returns Promise when all of threads is added to user
   */
  static mAddThreadIDsToUser(userID, threadIDs) {
    const userThreadsRef = USERS_REF.child(userID).child('threads');
    const results = [];
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      results.push(userThreadsRef.child(threadID).set({ uid: threadID }));
    }
    return Promise.all(results);
  }

  // static removeThreadsFromUser(userID, threadIDs) {
  //   const userThreadsRef = USERS_REF.child(userID).child('threads');
  //   const results = [];
  //   for (let i = 0; i < threadIDs.length; i += 1) {
  //     const threadID = threadIDs[i];
  //     results.push(userThreadsRef.child(threadID).remove());
  //   }
  //   return Promise.all(results);
  // }
}

export default RealtimeDatabase;
