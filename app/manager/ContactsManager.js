/**
 * Handle Contacts
 * - manage phone contacts (which read from device)
 * - manage appay contacts (which phone contact has phone number in appay system)
 * - manage appay contact presence: online/offline by using firebase realtime db
 * - for contact info, meta data update, using api (cloud functions), not using realtime db
 */
import firebase from 'react-native-firebase';
import ReactNativeContacts from 'react-native-contacts';

import FirebaseDatabase from '../network/FirebaseDatabase';
import { User } from '../models';

export const CONTACTS_EVENTS = {
  CONTACT_PRESENCE_CHANGE: 'CONTACT_PRESENCE_CHANGE',
};

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = '7777: ContactsManager.js';
/* eslint-enable */

// --------------------------------------------------

function initContactsManager() {

  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {}; // my user
  let mObservers = {}; // key is event name
  let mPhoneContacts = {}; // contacts from device, keep phoneNumber only
  let mContacts = {}; // appay contacts, key is userID

  /**
   * Setup user presence (aka online/offline)
   */
  function mSetupMyUserPresence(status = 'online') {
    if (!(mMyUser && mMyUser.uid)) {
      return;
    }
    FirebaseDatabase.getConnectedRef().on('value', (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const fbUserID = FirebaseDatabase.firebaseUserID(mMyUser.uid);
      const userStatusRef = FirebaseDatabase.getUsersPresenceRef().child(`${fbUserID}`);
      userStatusRef.onDisconnect().update({
        presenceStatus: 'offline',
        lastTimeOnline: firebase.database.ServerValue.TIMESTAMP,
      });
      userStatusRef.update({
        presenceStatus: status,
      });
    });
  }

  // EVENT HANDLERs
  // --------------------

  const onContactPresenceChange = (snapshot) => {
    Utils.log(`${LOG_TAG}: onContactPresenceChange: ${snapshot.key}`, snapshot.val());
    
    const fbContactID = snapshot.key;
    const contactID = FirebaseDatabase.normalUserID(fbContactID);
    const contactPresence = snapshot.val();
    
    // update
    const contact = mContacts[contactID];
    if (!contact) { return; }
    const updatedContact = Object.assign(contact, contactPresence);
    mContacts[contactID] = updatedContact;
    
    // notify
    const event = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    mNotifyObservers(event, { updatedContact });
  };

  // EVENT SUBSCRIBEs
  // --------------------

  /**
   * Get list of user uid, filter out invalid & me
   */
  function mGetContactsUserIDs() {
    const userIDs = [];
    const keys = Object.keys(mContacts);
    for (let i = 0; i < keys.length; i += 1) {
      const contact = mContacts[keys[i]];
      if (contact.uid && contact.uid !== mMyUser.uid) {
        userIDs.push(contact.uid);
      }
    }
    return userIDs;
  }

  function mSubscribeContactsPresence() {
    const userIDs = mGetContactsUserIDs();
    for (let i = 0; i < userIDs.length; i += 1) {
      const userID = userIDs[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const usersPresenceRef = FirebaseDatabase.getUsersPresenceRef();
      const contactStatusRef = usersPresenceRef.child(`${fbUserID}`);
      contactStatusRef.on('value', onContactPresenceChange);
    }
  }

  function mUnSubscribeContactsPresence() {
    const userIDs = mGetContactsUserIDs();
    for (let i = 0; i < userIDs.length; i += 1) {
      const userID = userIDs[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const usersPresenceRef = FirebaseDatabase.getUsersPresenceRef();
      const contactStatusRef = usersPresenceRef.child(`${fbUserID}`);
      contactStatusRef.off();
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
    setup(user) {

      mMyUser = user;
      mObservers = {};
      mPhoneContacts = [];
      mContacts = {};

      mSetupMyUserPresence();

      // this.reloadPhoneContacts();
    },
    getPhoneContacts() {
      return mPhoneContacts;
    },
    getPhoneContactsPhoneNumbers() {
      return mPhoneContacts.map(contact => contact.phoneNumber);
    },
    getContacts() {
      return mContacts;
    },
    getContactsArray() {
      const contactsArray = [];
      const keys = Object.keys(mContacts);
      for (let i = 0; i < keys.length; i += 1) {
        contactsArray.push(mContacts[keys[i]]);
      }
      return contactsArray;
    },
    addObserver(name, target, callback) {
      // Utils.log(`${LOG_TAG}: addObserver: ${name}, callback: ${callback}`);
      let list = mObservers[name];
      if (!list) {
        list = [];
      }
      list.push({ callback });
      mObservers[name] = list;
    },
    removeObserver(name, target) {
      // Utils.log(`${LOG_TAG}: removeObserver: ${name}, callback: ${callback}`);
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
    /**
     * Reload contacts from device (phone contacts)
     * @returns dictionary of Contact (not user)
     */
    reloadPhoneContacts() {
      return new Promise((resolve) => {
        ReactNativeContacts.getAll((err, contacts) => {
          // Utils.log(`${LOG_TAG}: reloadPhoneContacts: contacts: `, contacts);
          // error
          if (err) {
            Utils.warn(`${LOG_TAG}: reloadPhoneContacts: error: `, err);
            resolve({});
            return;
          }
          // get all phone number
          mPhoneContacts = {};
          for (let i = 0; i < contacts.length; i += 1) {
            const contact = contacts[i];
            const givenName = contact.givenName;
            const familyName = contact.familyName;
            const phoneNumbers = contact.phoneNumbers;
            if (phoneNumbers && Array.isArray(phoneNumbers)) {
              for (let j = 0; j < phoneNumbers.length; j += 1) {
                const phoneNumber = phoneNumbers[j].number;
                const standardPhoneNumber = User.standardizePhoneNumber(phoneNumber);
                mPhoneContacts[standardPhoneNumber] = { 
                  familyName, givenName, phoneNumber, standardPhoneNumber,
                };
              }
            }
          }
          // Utils.warn(`${LOG_TAG}: reloadPhoneContacts: phones: `, mPhoneContacts);
          resolve(mPhoneContacts);
        });
      });
    },
    /**
     * reload appay contacts from firebase
     * @returns dictionary of User
     */
    async reloadContacts() {
      // un-subscribe old contacts before update
      mUnSubscribeContactsPresence();
      // test
      mContacts = {};
      const contactsArray = Utils.getTestContacts();
      for (let i = 0; i < contactsArray.length; i += 1) {
        const contact = contactsArray[i];
        if (contact.uid !== mMyUser.uid) {
          mContacts[contact.uid] = contact;
        }
      }
      // end
      // re-subscribe
      mSubscribeContactsPresence();
      return mContacts;
    },
  };
}

// --------------------------------------------------

function initSingletonContactsManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initContactsManager();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ContactsManager = initSingletonContactsManager();
export default ContactsManager;
