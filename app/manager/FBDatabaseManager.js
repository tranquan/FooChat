import firebase from 'react-native-firebase';

const database = firebase.database();
const threadsRef = database.ref('threads');

class FBDatabaseManager {

  static createSingleThread() {
    // threadsRef.set({
    //   single_1_2: {
    //     title: 'single chat',
    //   },
    // });
  }

  static createGroupThread() {

  }

  static updateUser() {

  }
}

export default FBDatabaseManager;
