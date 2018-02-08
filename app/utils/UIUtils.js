import {
  Alert,
} from 'react-native';

import Strings from '../constants/strings';

// --------------------------------------------------

export default class UIUtils {

}

// --------------------------------------------------

const maleAvatarPlaceholder = require('../screens/img/avatar1.png');
const femaleAvatarPlaceholder = require('../screens/img/avatar2.png');

export function getAvatarPlaceholder(gender = 'male') {
  return gender === 'male' ? maleAvatarPlaceholder : femaleAvatarPlaceholder;
}

export function getWallPlaceholder() {
  return require('../screens/img/wall.jpg');
}

export function hidePhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  return phoneNumber.split('').map((item, index) => {
    if (index < 4) {
      return '*';
    }
    return item;
  }).join('');
}

// --------------------------------------------------
// Alert
// --------------------------------------------------

export function showAlert(message, title = '', buttons = [], delayTime = 250) {
  setTimeout(() => {
    Alert.alert(
      title,
      message,
      buttons,
      { cancelable: false },
    );
  }, delayTime);
}

export function showInfoAlert(message, delayTime = 250) {
  showAlert(message, Strings.alert_title, [], delayTime);
}

export function showQuestionAlert(message, yes, no, onYesPress, onNoPress, delayTime = 250) {
  const buttons = [
    {
      text: no,
      onPress: onNoPress,
    },
    {
      text: yes,
      onPress: onYesPress,
    },
  ];
  showAlert(message, Strings.alert_title, buttons, delayTime);
}
