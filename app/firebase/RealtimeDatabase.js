import firebase from 'react-native-firebase';
import Utils from '../utils/Utils';

const database = firebase.database();
const chatRef = database.ref('chat');
const usersRef = chatRef.child('users');
const threadsRef = chatRef.child('threads');

const ERRORS = {
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  USER_NOT_FOUND: 'THREAD_NOT_FOUND',
  SINGLE_THREAD_INVALID_ID: 'SINGLE_THREAD_INVALID_ID',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

class RealtimeDatabase {

  static test() {
    // const thread = RealtimeDatabase.getThread('single_1_2');
    // Utils.log('get thread: ', thread);

    // RealtimeDatabase.getThread('single_1_4')
    // .then((snapshot) => {
    //   Utils.log('get thread: ', snapshot);
    // })
    // .catch((error) => {
    //   Utils.log(`get thread error: ${error}`);
    // });

    // const asyncTask = async () => {
    //   try {
    //     const thread = await RealtimeDatabase.getThread('single_1_2');
    //     Utils.log('get thread: ', thread);
    //   }
    //   catch (error) {
    //     Utils.log('get thread: ', error);
    //   }
    // };
    // asyncTask();

    // RealtimeDatabase.addThreadsToUser('1', ['1', '2']);
    // RealtimeDatabase.removeThreadsFromUser('1', ['2']);
  }

  static getDatabase() {
    return database;
  }

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

  static createSingleThread(userID1, userID2) {
    return new Promise((resolve, reject) => {
      // get single thread id
      const singleThreadId = RealtimeDatabase.generateSingleThreadID(userID1, userID2);
      if (!singleThreadId) {
        reject(ERRORS.SINGLE_THREAD_INVALID_USERS);
        return;
      }
      // is single thread id exists
      RealtimeDatabase.getThread(singleThreadId)
      .then((snapshot) => {
        
      })
      .catch((error) => {
        if (error.message === ERRORS.THREAD_NOT_FOUND) {
          
        }
      });
    });

    // is single thread id exists
    threadsRef.child(singleThreadId).once('value', (snapshot) => {
      if (snapshot.val()) {
        return null;
      }
      return null;
    }, () => {
      return null;
    });
    // create thread
    // add thread to each user
    threadsRef.set({
      single_1_2: {
        title: 'single chat',
      },
    });
  }

  static createGroupThread(title, members) {

  }

  static getThread(threadID) {
    return new Promise((resolve, reject) => {
      threadsRef.child(threadID).once('value', (snapshot) => {
        if (snapshot.val()) {
          resolve(snapshot);
          return;
        }
        resolve(null);
        reject(new Error(ERRORS.THREAD_NOT_FOUND));
      }, (error) => {
        Utils.log(`getThread error: ${error}`, error);
        reject(new Error(ERRORS.UNKNOWN_ERROR));
      });
    });
  }

  static updateGroupThread(uid) {

  }

  static updateUser() {

  }

  static sendTextMessage(message, threadID, fromUser) {
    
  }

  static sendImageMessage(message, imageURL, threadID, fromUser) {

  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  static addThreadsToUser(userID, threadIDs) {
    const userThreadsRef = usersRef.child(userID).child('threads');
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      userThreadsRef.child(threadID).set({ uid: threadID });
    }
  }

  static removeThreadsFromUser(userID, threadIDs) {
    const userThreadsRef = usersRef.child(userID).child('threads');
    for (let i = 0; i < threadIDs.length; i += 1) {
      const threadID = threadIDs[i];
      userThreadsRef.child(threadID).remove();
    }
  }
}

export default RealtimeDatabase;
