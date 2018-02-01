// all styles used in the app

import { StyleSheet, Dimensions } from 'react-native';

import colors from './colors';

const WindowSize = Dimensions.get('window');
const getFontMedium = () => {
  if (WindowSize.width <= 320) return 13;
  if (WindowSize.width <= 375) return 14;
  return 15;
};
export const fontMedium = getFontMedium();

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.button_background,
    borderWidth: 0,
    borderRadius: 22,
    borderColor: '#fff',
    justifyContent: 'center',
    height: 44,
    paddingLeft: 16,
    paddingRight: 16,
  },
  button_text: {
    color: colors.text_white,
    fontSize: 15,
    fontWeight: '600',
  },
  button_overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
  },
  link_button: {
    alignItems: 'center',
    backgroundColor: '#0000',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  link_button_text: {
    color: colors.app_theme_darker,
    fontSize: 14,
    fontWeight: '400'
  },
  navigator_header: {
    backgroundColor: colors.app_theme,
  },
  navigator_header_title: {
    color: '#fff',
  },
  navigator_header_no_border: {
    backgroundColor: colors.app_theme,
    shadowColor: colors.app_theme,
  },
  shadow: {
    borderColor: '#A0A0A0',
    elevation: 4,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9',
  },
});
