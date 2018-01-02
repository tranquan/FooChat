import {
  MY_USER,
} from './types';

export function myUser(user) {
  return {
    type: MY_USER,
    user,
  };
}
