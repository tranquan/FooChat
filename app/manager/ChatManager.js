/**
 * Handle Chat
 * - Subscribe all needed threas to update message
 * - Thread, Message objects return from this class are already set with Thread, Message prototype
 */
/**
 * TODO:
 * - before subscribe a path, check if it already in mSubscribePaths
 */

import firebase from 'react-native-firebase';

import FirebaseDatabase from '../network/FirebaseDatabase';
import { User, Message, Thread } from '../models';

export const CHAT_EVENTS = {
  MY_USER_CHANGE: 'MY_USER_CHANGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_THREAD: 'NEW_THREAD',
  THREAD_CHANGE: 'THREAD_CHANGE',
  THREAD_USERS_CHANGE: 'THREAD_USERS_CHANGE',
};

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = '7777: ChatManager.js';
/* eslint-enable */

function initChatManager() {
  
  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {};
  let mObservers = {};
  const mSubscribePaths = [];

  function mUpdateMyUser() {
    FirebaseDatabase.updateUser(mMyUser.uid, mMyUser);
  }

  // EVENT HANDLERs
  // --------------------


  // EVENT SUBSCRIBEs
  // --------------------

  /**
   * listen for /users/<my_user_id> -> `value`
   * - to support login in on multiple devices
   */
  // function mSubscribeMyUserChange() {
  //   const usersRef = FirebaseDatabase.getUsersRef();
  //   usersRef.child(`${mMyUser.uid}`)
  //     .limitToLast(1)
  //     .on('value', (snapshot) => {
  //       const user = snapshot.val();
  //       mNotifyObservers(CHAT_EVENTS.MY_USER_CHANGE, user);
  //     });
  // }

  /**
   * for each of my thread
   * listen for /threads/<my_thread_id> -> `value`
   * - to support thread meta data change
   */
  function mSubscribeMyThreadsChange() {
    const asyncTask = async () => {
      try {
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
        for (let i = 0; i < threads.length; i += 1) {
          const thread = threads[i];
          mSubscribeMyThreadsChangeForThread(thread.uid);
        }
      } catch (err) {
        Utils.warn('mSubscribeMyThreadsChange: error', err);
      }
    };
    asyncTask();
  }

  /**
   * listen for /threads/<my_thread_id> -> `value`
   * - to support thread meta data change
   */
  function mSubscribeMyThreadsChangeForThread(threadID) {
    // subscribe
    const threadRef = FirebaseDatabase.getThreadsRef();
    threadRef.child(threadID)
      .on('value', (snapshot) => {
        const thread = snapshot.val();
        mNotifyObservers(CHAT_EVENTS.THREAD_CHANGE, thread);
      });
    // keep track to remove later
    const path = `${threadRef.key}/${threadID}`;
    mSubscribePaths.push(path);
    Utils.log(`mSubscribeMyThreadsChangeForThread: subscribe path: ${path}`);
  }

  /**
   * listen for /users/<my_user_id>/threads -> `child_added`
   * - to support add/remove user
   */
  function mSubscribeNewThread() {
    // subscribe
    const usersRef = FirebaseDatabase.getUsersRef();
    const fbUserID = FirebaseDatabase.firebaseUserID(mMyUser.uid);
    usersRef.child(`${fbUserID}/threads`)
      .limitToLast(1)
      .on('child_added', (snapshot) => {
        // fetch thread
        const threadID = snapshot.key;
        if (threadID) {
          const asyncTask = async () => {
            try {
              const threadJSON = await FirebaseDatabase.getThread(threadID);
              const thread = Object.assign(new Thread(), threadJSON);
              mNotifyObservers(CHAT_EVENTS.NEW_THREAD, thread);
              mSubscribeMyThreadsChangeForThread(thread.uid);
            } catch (err) {
              Utils.warn(`mSubscribeNewThread: fetch thread error: ${err}`, err);
            }
          };
          asyncTask();
        }
      });
    // keep track to remove later
    const path = `${usersRef.key}/${fbUserID}/threads`;
    mSubscribePaths.push(path);
    Utils.log(`mSubscribeNewThread: subscribe path: ${path}`);
  }

  /**
   * for each of my thread
   * listen for /threads_messages/<my_thread_id>/messages -> `child_added`
   * - to support new message
   */
  function mSubscribeNewMessage() {
    const asyncTask = async () => {
      try {
        const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
        for (let i = 0; i < threads.length; i += 1) {
          // subscribe
          const thread = threads[i];
          threadsMessagesRef.child(`${thread.uid}/messages`)
            .limitToLast(1)
            .on('child_added', (snapshot) => {
              const messageJSON = snapshot.val();
              const message = Object.assign(new Message(), messageJSON);
              const threadID = snapshot.ref.parent.parent.key;
              mNotifyObservers(CHAT_EVENTS.NEW_MESSAGE, message, threadID);
            });
          // keep track to remove later
          const path = `${threadsMessagesRef.key}/${thread.uid}/messages`;
          mSubscribePaths.push(path);
          Utils.log(`mSubscribeNewMessage: subscribe path: ${path}`);
        }
      } catch (err) {
        Utils.warn('mSubscribeIncomingMessage: error', err);
      }
    };
    asyncTask();
  }

  /**
   * for each of my thread
   * listen for /threads/<my_thread_id>/users -> `child_added`, `child_removed`
   * - to support invite/remove me in a thread
   */
  // function mSubscribeThreadUsersChange() {
  //   const asyncTask = async () => {
  //     try {
  //       const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();
  //       const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
  //       for (let i = 0; i < threads.length; i += 1) {
  //         const thread = threads[i];
  //         threadsMessagesRef.child(`${thread.uid}/users`)
  //           .on('child_added', (snapshot) => {
  //             const user = snapshot.val();
  //           });
  //         threadsMessagesRef.child(`${thread.uid}/users`)
  //           .on('child_removed', (snapshot) => {
  //             const user = snapshot.val();
  //           });
  //       }
  //     } catch (err) {
  //       Utils.warn('mSubscribeThreadUsersChange: error', err);
  //     }
  //   };
  //   asyncTask();
  // }

  function mUnSubsribePath(path) {
    // turn-off event
    const database = FirebaseDatabase.getDatabase();
    const ref = database.ref(path);
    ref.off();
    // remove path in cached
    let removeIndex = -1;
    for (let i = 0; i < mSubscribePaths.length; i += 1) {
      if (mSubscribePaths[i] === path) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex >= 0) {
      mSubscribePaths.splice(removeIndex, 1);
    }
  }

  function mUnSubscribeAllPaths() {
    const database = FirebaseDatabase.getDatabase();
    while (mSubscribePaths.length > 0) {
      const path = mSubscribePaths.pop();
      const ref = database.ref(path);
      ref.off();
    }
  }

  /**
   * notify observers
   * @param {string} name 
   * @param {array} args 
   */
  function mNotifyObservers(name, ...args) {
    const observers = mObservers[name];
    if (observers) {
      for (let j = 0; j < observers.length; j += 1) {
        const item = observers[j];
        if (item.callback) {
          item.callback.call(item.target, ...args);
        }
      }
    }
  }
  
  // PUBLIC
  // --------------------------------------------------
  
  return {
    initChat() {
    },
    deinitChat() {
    },
    goOnline() {
      FirebaseDatabase.getDatabase().goOnline();
    },
    goOffline() {
      FirebaseDatabase.getDatabase().goOffline();
      FirebaseDatabase.getConnectedRef().off();
      mUnSubscribeAllPaths();
    },
    setup(user) {

      mMyUser = user;
      mObservers = {};

      // init static vars
      User.setupMyUser(user);
      Thread.setupMyUser(user);
      Message.setupMyUser(user);

      // update my user
      mUpdateMyUser();
      
      // mSubscribeMyUserChange();
      mSubscribeMyThreadsChange();
      mSubscribeNewThread();
      mSubscribeNewMessage();
      // mSubscribeThreadUsersChange();
    },
    addObserver(name, target, callback) {
      // Utils.log(`addObserver: ${name}, callback: ${callback}`);
      let list = mObservers[name];
      if (!list) {
        list = [];
      }
      list.push({ callback });
      mObservers[name] = list;
    },
    removeObserver(name, target) {
      // Utils.log(`removeObserver: ${name}, callback: ${callback}`);
      const list = mObservers[name];
      if (list) {
        let removeIndex = -1;
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.target === target) {
            removeIndex = i;
            break;
          }
        }
        if (removeIndex) {
          list.splice(removeIndex, 1);
        }
      }
      mObservers[name] = list;
    },
    // --------------------------------------------------
    // async getContacts() {
    //   return mContacts;
    // },
    async getThread(threadID) {
      const thread = await FirebaseDatabase.getThread(threadID);
      return thread;
    },
    async getMyThreads(fromUpdateTime) {
      const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid, fromUpdateTime);
      return threads.map(thread => {
        return Object.assign(new Thread(), thread);
      });
    },
    async createSingleThreadWithTarget(target) {
      const thread = await FirebaseDatabase.createSingleThread(mMyUser, target);
      if (!thread) { 
        return null;
      }
      return Object.assign(new Thread(), thread);
    },
    async createGroupThread(users, metaData) {
      const thread = await FirebaseDatabase.createGroupThread(users, metaData);
      if (!thread) {
        return null;
      }
      return Object.assign(new Thread(), thread);
    },
    async sendMessage(message, threadID) {
      const myMessage = { ...message, authorID: mMyUser.uid };
      const newMessage = await FirebaseDatabase.sendMessage(myMessage, threadID);
      if (!newMessage) {
        return null;
      }
      return Object.assign(new Message(), newMessage);
    },
    async getMessagesInThread(threadID, fromMessage = null, maxMessages = 44) {
      const messages = 
        await FirebaseDatabase.getMessagesInThread(threadID, fromMessage, maxMessages);
      return messages.map(message => {
        return Object.assign(new Message(), message);
      });
    },
  };
}
 
// --------------------------------------------------

function initSingletonChatManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initChatManager();
        instance.initChat();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ChatManager = initSingletonChatManager();
export default ChatManager;
