import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { ButtonPressAnimation } from '../animations';
import ImageAvatar from '../contacts/ImageAvatar';
import { Flex, InnerBorder } from '../layout';
import { Text } from '../text';
import ContextMenu from '@/components/native-context-menu/contextMenu';
import {
  useAccountProfile,
  useLatestCallback,
  useOnAvatarPress,
} from '@/hooks';
import styled from '@/styled-thing';
import { position, colors } from '@/styles';
import ShadowStack from '@/react-native-shadow-stack';
import { StyleSheet } from 'react-native';

const AvatarCircleSize = 96;

const AvatarCircleView = styled(Flex)({
  ...position.sizeAsObject(AvatarCircleSize),
  alignItems: 'center',
  justifyContent: 'center',
});

const FirstLetter = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.whiteLabel,
  letterSpacing: 2,
  size: ios ? 58 : 30,
  weight: 'semibold',
  ...(ios && { lineHeight: 96 }),
}))({
  ...(android && { left: -1 }),
  ...(ios && { width: 62 }),
});

export default function AvatarCircle({
  isAvatarPickerAvailable,
  overlayStyles,
  image,
  onPress,
  showcaseAccountSymbol,
  showcaseAccountColor,
  menuOptions = [],
  newProfile = false,
  ...props
}) {
  const { colors, isDarkMode } = useTheme();
  const {
    accountColor: profileAccountColor,
    accountSymbol: profileAccountSymbol,
  } = useAccountProfile();

  const accountSymbol = showcaseAccountSymbol || profileAccountSymbol;
  const resolvedColor =
    showcaseAccountColor != null
      ? typeof showcaseAccountColor === 'string'
        ? showcaseAccountColor
        : colors.avatarBackgrounds[showcaseAccountColor]
      : colors.avatarBackgrounds[(!newProfile && profileAccountColor) ?? 10];
  const shadows = useMemo(
    () => ({
      default: [
        [0, 2, 5, isDarkMode ? colors.trueBlack : colors.dark, 0.2],
        [
          0,
          6,
          10,
          isDarkMode ? colors.trueBlack : colors.alpha(resolvedColor, 0.6),
        ],
      ],
      overlay: [
        [0, 6, 10, isDarkMode ? colors.trueBlack : colors.shadowBlack, 0.08],
        [0, 2, 5, isDarkMode ? colors.trueBlack : colors.shadowBlack, 0.12],
      ],
    }),
    [resolvedColor, colors, isDarkMode]
  );

  const {
    avatarContextMenuConfig,
    onAvatarPressProfile,
    onSelectionCallback,
    hasENSProfile,
  } = useOnAvatarPress({ screenType: 'wallet' });

  const handlePressMenuItem = useLatestCallback(e => {
    const index = avatarContextMenuConfig.menuItems?.findIndex(
      item => item.actionKey === e.nativeEvent.actionKey
    );
    onSelectionCallback(index);
  });

  const Wrapper = hasENSProfile ? React.Fragment : ContextMenu;

  return (
    <Wrapper
    // menuConfig={avatarContextMenuConfig}
    // onPressMenuItem={handlePressMenuItem}
    >
      <ButtonPressAnimation
        disabled={!isAvatarPickerAvailable}
        enableHapticFeedback={isAvatarPickerAvailable}
        onPress={onAvatarPressProfile}
        onLongPress={() => null}
        overflowMargin={30}
        pressOutDuration={200}
        // scaleTo={isAvatarPickerAvailable ? 0.9 : 1}
        {...props}
      >
        {image ? (
          <ImageAvatar image={image} size="large" style={styles.avatar} />
        ) : (
          <AvatarCircleView
            backgroundColor={resolvedColor}
            style={styles.avatar}
          >
            <FirstLetter>{accountSymbol}</FirstLetter>
            {!overlayStyles && <InnerBorder opacity={0.02} radius={60} />}
          </AvatarCircleView>
        )}
      </ButtonPressAnimation>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: AvatarCircleSize,
    borderWidth: 1,
    borderColor: colors.white,
  },
});
