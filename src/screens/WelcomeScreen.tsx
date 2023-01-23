import lang from 'i18n-js';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { ButtonPressAnimation } from '../components/animations';
import { BaseButtonAnimationProps } from '../components/animations/ButtonPressAnimation/types';
import { RowWithMargins } from '../components/layout';
import { Text } from '../components/text';
import {
  fetchUserDataFromCloud,
  isCloudBackupAvailable,
  syncCloud,
} from '../handlers/cloudBackup';
import { cloudPlatform } from '../utils/platform';
import { analytics } from '@/analytics';

import { useHideSplashScreen } from '@/hooks';
import { useNavigation } from '@/navigation';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { fonts, position } from '@/styles';
import { ThemeContextProps, useTheme } from '@/theme';
import logger from '@/utils/logger';
import { IS_TEST } from '@/env';

const ButtonContainer = styled(Reanimated.View)({
  borderRadius: 16,
});

const ButtonContent = styled(RowWithMargins).attrs({
  align: 'center',
  margin: 4,
})({
  alignSelf: 'center',
  height: '100%',
  paddingBottom: 2,
});

const ButtonLabel = styled(Text).attrs(
  ({
    textColor: color,
    textSize: string,
    theme: { colors },
  }: {
    textColor: string;
    textSize: string;
    theme: ThemeContextProps;
  }) => ({
    align: 'center',
    color: color || colors.dark,
    size: string,
    weight: 'bold',
  })
)({});

interface RainbowButtonProps extends BaseButtonAnimationProps {
  height: number;
  textColor: string;
  textSize: string;
  text: string;
  shadowStyle?: StyleProp<ViewStyle>;
  darkShadowStyle?: StyleProp<ViewStyle>;
}

const RainbowButton = ({
  height,
  onPress,
  style,
  textColor,
  textSize,
  text,
  ...props
}: RainbowButtonProps) => {
  return (
    <ButtonPressAnimation
      onPress={onPress}
      overflowMargin={40}
      radiusAndroid={16}
      scaleTo={0.9}
      {...props}
    >
      <ButtonContainer height={height} style={style}>
        <ButtonContent>
          <ButtonLabel textColor={textColor} textSize={textSize}>
            {text}
          </ButtonLabel>
        </ButtonContent>
      </ButtonContainer>
    </ButtonPressAnimation>
  );
};

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
  height: 122,
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
  width: 300,
}));

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

  const createWalletButtonAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: isDarkMode ? colors.blueGreyDarkLight : colors.greenCW,
    width: 270 + (ios ? 0 : 6),
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
    navigate(Routes.IMPORT_SEED_PHRASE_FLOW);
  }, [navigate]);

  useAndroidBackHandler(() => {
    return true;
  });

  return (
    <Container testID="welcome-screen">
      <Text style={sx.branding}>{lang.t('wallet.new.brand_name')}</Text>
      <ContentWrapper style={contentStyle}>
        <ButtonWrapper style={buttonStyle}>
          <RainbowButton
            height={54 + (ios ? 0 : 6)}
            onPress={onCreateWallet}
            style={[
              createWalletButtonAnimatedStyle,
              { backgroundColor: colors.greenCW, width: 270 },
            ]}
            testID="new-wallet-button"
            text={lang.t('wallet.new.get_new_wallet')}
            textColor={isDarkMode ? colors.dark : colors.white}
            textSize={'larger'}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <RainbowButton
            height={56}
            onPress={showRestoreSheet}
            style={[sx.existingWallet]}
            testID="already-have-wallet-button"
            text={lang.t('wallet.new.add_existing_wallet')}
            textColor={colors.greenCW}
            textSize={'medium'}
          />
        </ButtonWrapper>
      </ContentWrapper>
      <TermsOfUse bottomInset={insets.bottom}>
        <Text
          align="center"
          color={colors.alpha(colors.blueGreyDark, 0.5)}
          lineHeight="loose"
          size="smedium"
          weight="semibold"
        >
          {lang.t('wallet.new.terms')}
          <Text
            color={colors.greenCW}
            lineHeight="loose"
            onPress={handlePressTerms}
            size="smedium"
            suppressHighlighting
            weight="semibold"
          >
            {lang.t('wallet.new.terms_link')}
          </Text>
        </Text>
      </TermsOfUse>
    </Container>
  );
}

const sx = StyleSheet.create({
  existingWallet: {
    width: 248,
  },
  existingWalletShadow: {
    opacity: 0,
  },
  branding: {
    fontSize: fonts.size.h2,
    fontWeight: fonts.weight.bold,
    position: 'relative',
    bottom: 150,
  },
});
