import {
  ROOT_SCREEN,
} from '../actions/types';

export function rootScreen(state = 'LOADING', action) {
  switch (action.type) {
    case ROOT_SCREEN:
      return action.screen;
    default:
      return state;
  }
}
