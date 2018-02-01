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

export function showAlert(message) {
  Alert.alert(
    Strings.alert_title,
    message,
    [{ text: 'Đóng' }],
    { cancelable: false },
  );
}

// export function showConfirmation(
//   title, message, 
//   yes = 'Đồng ý', no = 'Đóng', 
//   onYesCallback, onNoCallback
// ) {
//   Alert.alert(
//     Strings.alert_title,
//     message,
//     [{ text: 'Đóng' }],
//     { cancelable: false },
//   );
// }
