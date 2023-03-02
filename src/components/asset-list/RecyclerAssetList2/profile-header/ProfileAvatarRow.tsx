import * as React from 'react';
import { Animated as RNAnimated, Text as NativeText } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ButtonPressAnimation } from '@/components/animations';
import { ImgixImage } from '@/components/images';
import Skeleton from '@/components/skeleton/Skeleton';
import { AccentColorProvider, Box, Cover, useColorMode } from '@/design-system';
import {
  useAccountProfile,
  useLatestCallback,
  useOnAvatarPress,
} from '@/hooks';
import { useTheme } from '@/theme';
import { getFirstGrapheme } from '@/utils';
import ContextMenu from '@/components/native-context-menu/contextMenu';
import { useRecyclerAssetListPosition } from '../core/Contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navbarHeight } from '@/components/navbar/Navbar';
import { IS_ANDROID } from '@/env';
import { useAccountAccentColor } from '@/hooks/useAccountAccentColor';
import { usePersistentDominantColorFromImage } from '@/hooks/usePersistentDominantColorFromImage';

export const ProfileAvatarRowHeight = 80;
export const ProfileAvatarRowTopInset = 24;
export const ProfileAvatarSize = 80;

export function ProfileAvatarRow({
  size = ProfileAvatarSize,
}: {
  size?: number;
}) {
  // ////////////////////////////////////////////////////
  // Account

  const { accountSymbol, accountImage } = useAccountProfile();

  const { onAvatarPressProfile } = useOnAvatarPress({ screenType: 'wallet' });

  // ////////////////////////////////////////////////////
  // Colors

  const { accentColor } = useAccountAccentColor();

  // ////////////////////////////////////////////////////
  // Animations

  const insets = useSafeAreaInsets();
  const position = useRecyclerAssetListPosition();
  const animatedStyle = React.useMemo(
    () => ({
      opacity: position!.interpolate({
        inputRange: [
          -insets.top,
          IS_ANDROID ? 0 : -insets.top + 1,
          navbarHeight + insets.top,
        ],
        outputRange: [1, 1, 0],
      }),
      transform: [
        {
          translateY: position!.interpolate({
            inputRange: [
              -insets.top,
              IS_ANDROID ? 0 : -insets.top + 1,
              navbarHeight + insets.top,
            ],
            outputRange: [0, 0, 12],
          }),
          scale: position!.interpolate({
            inputRange: [
              -insets.top,
              IS_ANDROID ? 0 : -insets.top + 1,
              navbarHeight + insets.top,
            ],
            outputRange: [1, 1, 0.8],
          }),
        },
      ],
    }),
    [position]
  );

  const hasLoaded = accountSymbol || accountImage;

  const opacity = useDerivedValue(() => {
    return hasLoaded ? 1 : 0;
  });
  const fadeInStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 100,
        easing: Easing.linear,
      }),
    };
  });

  const scale = useDerivedValue(() => {
    return hasLoaded ? 1 : 0.9;
  });
  const expandStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(scale.value, {
            damping: 12,
            restDisplacementThreshold: 0.001,
            restSpeedThreshold: 0.001,
            stiffness: 280,
          }),
        },
      ],
    };
  });

  return (
    <AccentColorProvider color={accentColor}>
      <RNAnimated.View style={animatedStyle}>
        <Animated.View style={[expandStyle]}>
          <ButtonPressAnimation
            onPress={onAvatarPressProfile}
            scale={0.8}
            testID="avatar-button"
            overflowMargin={20}
          >
            <Box
              alignItems="center"
              background="accent"
              borderRadius={size / 2}
              height={{ custom: size }}
              justifyContent="center"
              style={{
                backgroundColor: accentColor,
              }}
              width={{ custom: size }}
            >
              <>
                {!hasLoaded && (
                  <Cover alignHorizontal="center">
                    <Box height={{ custom: size }} width="full">
                      <Skeleton animated>
                        <Box
                          background="body (Deprecated)"
                          borderRadius={size / 2}
                          height={{ custom: size }}
                          width={{ custom: size }}
                        />
                      </Skeleton>
                    </Box>
                  </Cover>
                )}
                <Animated.View style={[fadeInStyle]}>
                  <EmojiAvatar size={size} />
                </Animated.View>
              </>
            </Box>
          </ButtonPressAnimation>
        </Animated.View>
      </RNAnimated.View>
    </AccentColorProvider>
  );
}

export function EmojiAvatar({ size }: { size: number }) {
  const { colors } = useTheme();
  const { accountColor, accountSymbol } = useAccountProfile();

  const accentColor =
    accountColor !== undefined
      ? colors.avatarBackgrounds[accountColor]
      : colors.skeleton;

  return (
    <AccentColorProvider color={accentColor}>
      <Box
        background="accent"
        borderRadius={size / 2}
        height={{ custom: size }}
        width={{ custom: size }}
      >
        <Cover alignHorizontal="center" alignVertical="center">
          <Box>
            <NativeText style={{ fontSize: ios ? 48 : 36, color: 'white' }}>
              {typeof accountSymbol === 'string' &&
                getFirstGrapheme(accountSymbol.toUpperCase())}
            </NativeText>
          </Box>
        </Cover>
      </Box>
    </AccentColorProvider>
  );
}
