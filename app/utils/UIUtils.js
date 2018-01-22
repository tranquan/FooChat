import {
} from 'react-native';

// --------------------------------------------------

export default class Utils {

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

