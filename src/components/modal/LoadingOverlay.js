import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import ActivityIndicator from '../ActivityIndicator';
import Spinner from '../Spinner';
import TouchableBackdrop from '../TouchableBackdrop';
import { Centered, Column } from '../layout';
import { Text } from '../text';
import styled from '@/styled-thing';
import { padding, position, fonts } from '@/styles';
import { neverRerender } from '@/utils';
import { View, StyleSheet } from 'react-native';

const Container = styled(Centered).attrs({
  flex: android ? 1 : undefined,
  self: android ? 'center' : undefined,
})({
  ...position.sizeAsObject('100%'),
  position: 'absolute',
  zIndex: 999,
});

const Overlay = styled(Centered)({
  ...padding.object(10),
  backgroundColor: ({ theme: { colors } }) =>
    colors.alpha(colors.darkGreyCW, 0.92),
  borderRadius: 8,
  overflow: 'hidden',
  width: 120,
  height: 110,
});

const OverlayBlur = styled(BlurView).attrs(({ isDarkMode }) => ({
  blurAmount: 40,
  blurType: isDarkMode ? 'dark' : 'light',
}))({
  ...position.coverAsObject,
  zIndex: 1,
});

const Title = styled(Text).attrs(({ theme: { colors } }) => ({
  color: colors.white,
  lineHeight: ios ? 'none' : 24,
  size: fonts.size.medium,
  weight: 'semibold',
}))({
  marginTop: 10,
});

const LoadingOverlay = ({ title, ...props }) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Container {...props} as={android ? Column : TouchableBackdrop} disabled>
      <Overlay>
        <Centered zIndex={2}>
          <View style={styles.content}>
            {android ? (
              <Spinner color={colors.white} />
            ) : (
              <ActivityIndicator color={colors.white} />
            )}
            {title ? <Title>{title}</Title> : null}
          </View>
        </Centered>
        <OverlayBlur isDarkMode={isDarkMode} />
      </Overlay>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default neverRerender(LoadingOverlay);
