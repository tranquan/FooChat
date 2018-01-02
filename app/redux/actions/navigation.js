import {
  ROOT_SCREEN,
} from './types';

// --------------------------------------------------

export function rootScreen(screen = 'LOADING') {
  return {
    type: ROOT_SCREEN,
    screen,
  };
}

export function switchToLoading() {
  return (dispatch) => dispatch(rootScreen('LOADING'));
}

export function switchToLogin() {
  return (dispatch) => dispatch(rootScreen('LOGIN'));
}

export function switchToMain() {
  return (dispatch) => dispatch(rootScreen('MAIN'));
}
