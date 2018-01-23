/**
 * Handle App general logic
 */

import { User, Message, Thread } from '../models';
import FirebaseDatabase from '../network/FirebaseDatabase';
import FirebaseFunctions from '../network/FirebaseFunctions';

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = '7777: AppManager.js';
/* eslint-enable */

function initAppManager() {

  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {};
  let mObservers = {};

  // EVENT HANDLERs
  // --------------------


  // EVENT SUBSCRIBEs
  // --------------------

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
    startAppWithUser(user) {
      // vars
      mMyUser = user;
      mObservers = {};
      // init static vars
      User.setupMyUser(user);
      Thread.setupMyUser(user);
      Message.setupMyUser(user);
      // setup my user
      FirebaseDatabase.setup(mMyUser);
      FirebaseFunctions.setup(mMyUser);
    },
    endApp() {
      mMyUser = {};
      mObservers = {};
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
  };
}

// --------------------------------------------------

function initSingletonAppManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initAppManager();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const AppManager = initSingletonAppManager();
export default AppManager;
