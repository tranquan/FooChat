/**
 * Handle Chat
 * subscribe all needed threas to update message
 */

import RealtimeDatabase from '../firebase/RealtimeDatabase';
import Utils from '../utils/Utils';

function initChatManager() {
  
  // PRIVATE
  // --------------------------------------------------

  function subscribeMessageEvents() {
    
    // Utils.log('subscribeMessageEvents');
    
    const threadsRef = RealtimeDatabase.getThreadsRef();

    // threadsRef.child('single_1_2/messages')
    //   .on('value', (snapshot) => {
    //     Utils.log(`messages value: ${JSON.stringify(snapshot)}`, snapshot);
    //   });

    // threadsRef.child('single_1_2/messages')
    //   .limitToLast(1)
    //   .on('child_added', (snapshot, prevID) => {
    //     Utils.log(`messages child_added: ${snapshot.key} - ${JSON.stringify(snapshot)} - ${prevID}`, snapshot);
    //   });

    // threadsRef.child('single_1_2/messages')
    //   .on('child_removed', (snapshot) => {
    //     Utils.log(`messages child_removed: ${JSON.stringify(snapshot)}`, snapshot);
    //   });

    const usersRef = RealtimeDatabase.getUsersRef();

    // usersRef.child('1/threads')
    //   .on('child_added', (snapshot, prevID) => {
    //     Utils.log(`1/threads child_added: ${snapshot.key} - ${JSON.stringify(snapshot)} - ${prevID}`, snapshot);
    //   });
    // usersRef.child('2/threads')
    //   .on('child_added', (snapshot, prevID) => {
    //     Utils.log(`1/threads child_added: ${snapshot.key} - ${JSON.stringify(snapshot)} - ${prevID}`, snapshot);
    //   });
  }

  function onNewMessage(message, threadID) {

  }

  function onMessageChanged(message, threadID) {

  }
  
  // PUBLIC
  // --------------------------------------------------
  return {
    initChat() {
      subscribeMessageEvents();
    },
    deinitChat() {

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
