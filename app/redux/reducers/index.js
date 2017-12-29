import { combineReducers } from 'redux';

import {
  rootScreen,
} from './navigation';

const appReducer = combineReducers({
  rootScreen,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP_STATE') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
