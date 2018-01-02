import {
  MY_USER,
} from '../actions/types';

export function myUser(state = {}, action) {
  switch (action.type) {
    case MY_USER:
      return action.user;
    default:
      return state;
  }
}
