import { createStore, applyMiddleware, compose } from 'redux'; // eslint-disable-line
import Reactotron from 'reactotron-react-native'; // eslint-disable-line
import thunk from 'redux-thunk';

import { Configs } from '../constants/configs';

import rootReducer from './reducers';

// --------------------------------------------------

const initialState = {
  rootScreen: 'LOADING',
  myUser: null,
  // currentChatThread: {},
  // currentChatMessages: [],
};

// --------------------------------------------------

let mCreateStoreFunc = null;

if (Configs.enableLog) {
  // store with reactotron-react-native
  mCreateStoreFunc = Reactotron.createStore(
    rootReducer, 
    initialState, 
    compose(applyMiddleware(thunk)),
  );
}
else {
  // store without log
  mCreateStoreFunc = createStore(
    rootReducer, 
    initialState, 
    compose(applyMiddleware(thunk)),
  );
}

const createStoreFunc = mCreateStoreFunc;
export default createStoreFunc;
