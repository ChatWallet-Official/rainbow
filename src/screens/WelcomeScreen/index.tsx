import MaskedView from '@react-native-masked-view/masked-view';
import lang from 'i18n-js';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import Reanimated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import RainbowText from '../../components/icons/svg/RainbowText';
import { RainbowsBackground } from '../../components/rainbows-background/RainbowsBackground';
import { Text } from '../../components/text';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
  syncCloud,
} from '@rainbow-me/handlers/cloudBackup';
import { cloudPlatform } from '@rainbow-me/utils/platform';
import { analytics } from '@/analytics';

import { useHideSplashScreen } from '@/hooks';
import { useNavigation } from '@/navigation';
import Routes from '@rainbow-me/routes';
import styled from '@/styled-thing';
import { colors, fonts, position } from '@/styles';
import { ThemeContextProps, useTheme } from '@/theme';
import logger from 'logger';
import { IS_ANDROID, IS_TEST } from '@/env';
import { WelcomeScreenRainbowButton } from '@/screens/WelcomeScreen/WelcomeScreenRainbowButton';

// @ts-expect-error Our implementation of SC complains
const Container = styled.View({
  ...position.coverAsObject,
  alignItems: 'center',
  backgroundColor: ({ theme: { colors } }: { theme: ThemeContextProps }) =>
    colors.white,
  justifyContent: 'center',
});

const ContentWrapper = styled(Reanimated.View)({
  alignItems: 'center',
  height: 192,
  justifyContent: 'space-between',
  marginBottom: 20,
  zIndex: 10,
});

const ButtonWrapper = styled(Reanimated.View)({
  width: '100%',
});

// @ts-expect-error
const TermsOfUse = styled.View(({ bottomInset }) => ({
  bottom: bottomInset / 2 + 32,
  position: 'absolute',
  width: 200,
}));

const RAINBOW_TEXT_HEIGHT = 32;
const RAINBOW_TEXT_WIDTH = 125;

const RainbowTextMask = styled(Reanimated.View)({
  height: RAINBOW_TEXT_HEIGHT,
  width: RAINBOW_TEXT_WIDTH,
});

const animationColors = [
  'rgb(255,73,74)',
  'rgb(255,170,0)',
  'rgb(0,163,217)',
  'rgb(0,163,217)',
  'rgb(115,92,255)',
  'rgb(255,73,74)',
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  // @ts-expect-error Navigation types
  const { replace, navigate, dangerouslyGetState } = useNavigation();
  const [userData, setUserData] = useState(null);
  const hideSplashScreen = useHideSplashScreen();

  const contentAnimation = useSharedValue(1);
  const colorAnimation = useSharedValue(0);
  const shouldAnimateRainbows = useSharedValue(false);
  const calculatedColor = useDerivedValue(
    () =>
      interpolateColor(
        colorAnimation.value,
        [0, 1, 2, 3, 4, 5],
        animationColors
      ),
    [colorAnimation]
  );
  const createWalletButtonAnimation = useSharedValue(1);

  useEffect(() => {
    const initialize = async () => {
      try {
        logger.log(`downloading ${cloudPlatform} backup info...`);
        const isAvailable = await isCloudBackupAvailable();
        if (isAvailable && ios) {
          logger.log('syncing...');
          await syncCloud();
          logger.log('fetching backup info...');
          const data = await fetchUserDataFromCloud();
          setUserData(data);
          logger.log(`Downloaded ${cloudPlatform} backup info`);
        }
      } catch (e) {
        logger.log('error getting userData', e);
      } finally {
        hideSplashScreen();
        shouldAnimateRainbows.value = true;

        const initialDuration = 120;

        contentAnimation.value = withSequence(
          withTiming(1.2, {
            duration: initialDuration,
            easing: Easing.bezier(0.165, 0.84, 0.44, 1),
          }),
          withSpring(1, {
            damping: 7,
            overshootClamping: false,
            stiffness: 250,
          })
        );

        // We need to disable looping animations
        // There's no way to disable sync yet
        // See https://stackoverflow.com/questions/47391019/animated-button-block-the-detox
        if (!IS_TEST) {
          createWalletButtonAnimation.value = withDelay(
            initialDuration,
            withTiming(1.02, { duration: 1000 }, () => {
              createWalletButtonAnimation.value = withRepeat(
                withTiming(0.98, {
                  duration: 1000,
                }),
                -1,
                true
              );
            })
          );
          colorAnimation.value = withRepeat(
            withTiming(5, {
              duration: 2500,
              easing: Easing.linear,
            }),
            -1
          );
        }

        if (IS_TEST) {
          logger.log(
            'Disabled loop animations in WelcomeScreen due to .env var IS_TESTING === "true"'
          );
        }
      }
    };

    initialize();

    return () => {
      createWalletButtonAnimation.value = 1;
      contentAnimation.value = 1;
    };
  }, [
    colorAnimation,
    contentAnimation,
    createWalletButtonAnimation,
    hideSplashScreen,
    shouldAnimateRainbows,
  ]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createWalletButtonAnimation.value }],
    zIndex: 10,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: contentAnimation.value,
      },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    backgroundColor: calculatedColor.value,
  }));

  const createWalletButtonAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: isDarkMode ? colors.blueGreyDarkLight : colors.dark,
    borderColor: calculatedColor.value,
    borderWidth: ios ? 0 : 3,
    width: 230 + (ios ? 0 : 6),
  }));

  const createWalletButtonAnimatedShadowStyle = useAnimatedStyle(() => ({
    backgroundColor: calculatedColor.value,
    shadowColor: calculatedColor.value,
  }));

  const onCreateWallet = useCallback(async () => {
    analytics.track('Tapped "Get a new wallet"');
    const operation = dangerouslyGetState().index === 1 ? navigate : replace;
    operation(Routes.SWIPE_LAYOUT, {
      params: { emptyWallet: true },
      screen: Routes.WALLET_SCREEN,
    });
  }, [dangerouslyGetState, navigate, replace]);

  const handlePressTerms = useCallback(() => {
    Linking.openURL('https://rainbow.me/terms-of-use');
  }, []);

  const showRestoreSheet = useCallback(() => {
    analytics.track('Tapped "I already have one"');
    navigate(Routes.ADD_WALLET_NAVIGATOR, {
      userData,
      isFirstWallet: true,
    });
  }, [navigate, userData]);

  useAndroidBackHandler(() => {
    return true;
  });

  return (
    <Container testID="welcome-screen">
      <ContentWrapper style={contentStyle}>
        <TouchableOpacity style={styles.createButton} onPress={onCreateWallet}>
          <Text style={styles.createButtonText}>
            {lang.t('wallet.new.get_a_web3_account')}
          </Text>
        </TouchableOpacity>
      </ContentWrapper>
    </Container>
  );
}

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: colors.mintGreen,
    width: 220,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.mintLabel,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
  },
});
