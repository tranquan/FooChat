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
