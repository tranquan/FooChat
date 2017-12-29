import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

// -------------------------------------------------- 
// SlideMenuScreen
// --------------------------------------------------

class SlideMenuScreen extends Component {
  render() {
    return (
      <View style={styles.container} />
    );
  }
}

export default SlideMenuScreen;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#606060',
  },
});
