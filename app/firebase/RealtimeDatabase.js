import firebase from 'react-native-firebase';

const database = firebase.database();
const threadsRef = database.ref('threads');

class RealtimeDatabase {

  static createSingleThread() {
    // threadsRef.set({
    //   single_1_2: {
    //     title: 'single chat',
    //   },
    // });
  }

  static createGroupThread(title, members) {

  }

  static updateGroupThread(uid) {

  }

  static updateUser() {

  }

  static sendTextMessage(message, thread, fromUser) {

  }

  static sendImageMessage(message, imageURL, thread, fromUser) {

  }
}

export default RealtimeDatabase;
