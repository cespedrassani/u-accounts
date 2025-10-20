/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { AccountType } from '@/types';
import { Platform } from 'react-native';

const primaryColor = '#622490';
const whiteColor = '#FFFFFF';
const shapesBackground = '#F0EDF5';
const dangerColor = '#FF6680';
const receiptColor = '#22A447';
const expenseColor = '#FF7A3D';

export const Colors = {
  text: '#6C6C80',
  textHeader: whiteColor,
  textSecondary: '#999999',
  background: primaryColor,
  tint: primaryColor,
  icon: whiteColor,
  iconSecondary: '#CCCCCC',
  tabIconDefault: 'rgba(255, 255, 255, 0.6)',
  tabIconSelected: whiteColor,
  shapes: whiteColor,
  shapesSecondary: shapesBackground,
  input: whiteColor,
  card: whiteColor,
  border: 'rgba(0, 0, 0, 0.1)',
  danger: dangerColor,
  overlay: 'rgba(0, 0, 0, 0.5)',
  success: '#4CAF50',
  warning: '#F59E0B',
  receipt: receiptColor,
  expense: expenseColor,
};

export const getTypeColor = (type: AccountType): string => {
  return type === 'receipt' ? Colors.receipt : Colors.expense;
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
