import { StyleSheet } from 'react-native';
import { Colors } from './theme';
import { RADIUS, SPACING } from './values';

export const commonStyles = StyleSheet.create({
  roundedTopContainer: {
    flex: 1,
    backgroundColor: Colors.shapesSecondary,
    borderTopLeftRadius: RADIUS.CONTAINER_TOP,
    borderTopRightRadius: RADIUS.CONTAINER_TOP,
    paddingTop: SPACING.XL,
  },
});
