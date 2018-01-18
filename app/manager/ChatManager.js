/**
 * Handle Chat
 * - Subscribe all needed threas to update message
 * - Thread, Message objects return from this class are already set with Thread, Message prototype
 */

import FirebaseDatabase from '../firebase/FirebaseDatabase';
import Utils from '../utils/Utils';
import Message from '../models/Message';
import Thread from '../models/Thread';

export const CHAT_EVENTS = {
  MY_USER_CHANGE: 'MY_USER_CHANGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_THREAD: 'NEW_THREAD',
  THREAD_CHANGE: 'THREAD_CHANGE',
  THREAD_USERS_CHANGE: 'THREAD_USERS_CHANGE',
};

function initChatManager() {
  
  // PRIVATE
  // --------------------------------------------------

  let mMyUser = '';
  let mObservers = {};

  /**
   * listen for /users/<my_user_id> -> `value`
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
   */
  // function mSubscribeMyThreadsChange() {
  //   const asyncTask = async () => {
  //     try {
  //       const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
  //       for (let i = 0; i < threads.length; i += 1) {
  //         const thread = threads[i];
  //         mSubscribeMyThreadsChangeForThread(thread.uid);
  //       }
  //     } catch (err) {
  //       Utils.warn('mSubscribeMyThreadsChange: error', err);
  //     }
  //   };
  //   asyncTask();
  // }

  function mSubscribeMyThreadsChangeForThread(threadID) {
    const threadRef = FirebaseDatabase.getThreadsRef();
    threadRef.child(threadID)
      .on('value', (snapshot) => {
        const thread = snapshot.val();
        mNotifyObservers(CHAT_EVENTS.THREAD_CHANGE, thread);
      });
  }

  /**
   * listen for /users/<my_user_id>/threads -> `child_added`
   */
  function mSubscribeNewThread() {
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
  }

  /**
   * for each of my thread
   * listen for /threads_messages/<my_thread_id>/messages -> `child_added`
   */
  function mSubscribeNewMessage() {
    const asyncTask = async () => {
      try {
        const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
        for (let i = 0; i < threads.length; i += 1) {
          const thread = threads[i];
          threadsMessagesRef.child(`${thread.uid}/messages`)
            .limitToLast(1)
            .on('child_added', (snapshot) => {
              const messageJSON = snapshot.val();
              const message = Object.assign(new Message(), messageJSON);
              const threadID = snapshot.ref.parent.parent.key;
              mNotifyObservers(CHAT_EVENTS.NEW_MESSAGE, message, threadID);
            });
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
    setup(user) {

      mMyUser = user;
      mObservers = {};
      
      Thread.setup(user);
      Message.setup(user);

      // mSubscribeMyUserChange();
      // mSubscribeMyThreadsChange();
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
    async getThread(threadID) {
      const thread = await FirebaseDatabase.getThread(threadID);
      return thread;
    },
    async getMyThreads(fromUpdateTime) {
      const threads = await FirebaseDatabase.getThreadsOfUser('1', fromUpdateTime);
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
