import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import DeviceInfo from 'react-native-device-info';

import Configs from './configs';

// default config
// Reactotron
//   .configure() // controls connection & communication settings
//   .useReactNative() // add all built-in react native plugins
//   .connect(); // let's connect!

// DEV
// config with redux
if (Configs.enableLog) {
  if (DeviceInfo.isEmulator()) {
    // simulator
    Reactotron.configure({ 
      name: 'Appay',
    })
    .use(reactotronRedux())
    .connect();
  } else {
    // device
    Reactotron.configure({ 
      name: 'Appay',
      host: '192.168.0.116',
    })
    .use(reactotronRedux())
    .connect();
  }
}
