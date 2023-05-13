import Clipboard from '@react-native-community/clipboard';
import lang from 'i18n-js';
import * as React from 'react';
import { PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { ButtonPressAnimation } from '@/components/animations';
import { enableActionsOnReadOnlyWallet } from '@/config';
import {
  AccentColorProvider,
  Box,
  Column,
  Columns,
  Inset,
  Stack,
  Text,
  useColorMode,
} from '@/design-system';
import { CurrencySelectionTypes, ExchangeModalTypes } from '@/helpers';
import {
  useAccountProfile,
  useSwapCurrencyHandlers,
  useWalletConnectConnections,
  useWallets,
} from '@/hooks';
import { delayNext } from '@/hooks/useMagicAutofocus';
import { useNavigation } from '@/navigation';
import { watchingAlert } from '@/utils';
import Routes from '@rainbow-me/routes';
import showWalletErrorAlert from '@/helpers/support';
import { analytics, analyticsV2 } from '@/analytics';
import ContextMenuButton from '@/components/native-context-menu/contextMenu';
import { useRecoilState } from 'recoil';
import config from '@/model/config';
import { useAccountAccentColor } from '@/hooks/useAccountAccentColor';
import { getAllActiveSessionsSync } from '@/utils/walletConnect';
import { addressCopiedToastAtom } from '@/recoil/addressCopiedToastAtom';
import { Icon } from '@/components/icons';

export const ProfileActionButtonsRowHeight = 80;

export function ProfileActionButtonsRow() {
  const { accentColor, loaded: accentColorLoaded } = useAccountAccentColor();

  const scale = useDerivedValue(() => (accentColorLoaded ? 1 : 0.9));
  const expandStyle = useAnimatedStyle(() => ({
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
  }));

  if (!accentColorLoaded) return null;

  const addCashEnabled = config.f2c_enabled;
  const swapEnabled = config.swagg_enabled;

  return (
    <Box width="full">
      <Inset horizontal={{ custom: 17 }}>
        <AccentColorProvider color={accentColor}>
          <Columns space="16px">
            {addCashEnabled && (
              <Column>
                <Animated.View style={[expandStyle]}>
                  <BuyButton />
                </Animated.View>
              </Column>
            )}
            {swapEnabled && (
              <Column>
                <Animated.View style={[expandStyle]}>
                  <SwapButton />
                </Animated.View>
              </Column>
            )}
            <Column>
              <Animated.View style={[expandStyle]}>
                <SendButton />
              </Animated.View>
            </Column>
            <Column>
              <Animated.View style={[expandStyle]}>
                <MoreButton />
              </Animated.View>
            </Column>
          </Columns>
        </AccentColorProvider>
      </Inset>
    </Box>
  );
}

function ActionButton({
  children,
  icon,
  onPress,
  testID,
}: {
  children: string;
  icon: string;
  onPress?: PressableProps['onPress'];
  testID?: string;
}) {
  const { colorMode } = useColorMode();
  return (
    <ButtonPressAnimation onPress={onPress} scale={0.8} testID={testID}>
      <Box
        alignItems="center"
        background="card"
        borderRadius={20}
        height={{ custom: 72 }}
        justifyContent="center"
      >
        <Stack alignHorizontal="center" space="10px">
          <Icon height={30} name={icon} />
          <Text color="black80" size="12px / 14px (Deprecated)" weight="medium">
            {children}
          </Text>
        </Stack>
      </Box>
    </ButtonPressAnimation>
  );
}

function BuyButton() {
  const { accountAddress } = useAccountProfile();
  const { navigate } = useNavigation();
  const { isDamaged } = useWallets();

  const handlePress = React.useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }

    navigate(Routes.BUY_FLOW);
    return;

    if (!config.wyre_enabled) {
      navigate(Routes.EXPLAIN_SHEET, { type: 'wyre_degradation' });
      return;
    }

    analytics.track('Tapped "Add Cash"', {
      category: 'home screen',
    });

    navigate(Routes.ADD_CASH_SHEET);
  }, [accountAddress, isDamaged, navigate]);

  return (
    <Box>
      <ActionButton
        icon="mintBuyIcon"
        onPress={handlePress}
        testID="buy-button"
      >
        {lang.t('wallet.buy')}
      </ActionButton>
    </Box>
  );
}

function SwapButton() {
  const { isReadOnlyWallet } = useWallets();

  const { navigate } = useNavigation();

  const { updateInputCurrency } = useSwapCurrencyHandlers({
    shouldUpdate: false,
    type: ExchangeModalTypes.swap,
  });

  const handlePress = React.useCallback(() => {
    if (!isReadOnlyWallet || enableActionsOnReadOnlyWallet) {
      analytics.track('Tapped "Swap"', {
        category: 'home screen',
      });

      android && delayNext();
      navigate(Routes.EXCHANGE_MODAL, {
        fromDiscover: true,
        params: {
          fromDiscover: true,
          onSelectCurrency: updateInputCurrency,
          title: lang.t('swap.modal_types.swap'),
          type: CurrencySelectionTypes.input,
        },
        screen: Routes.CURRENCY_SELECT_SCREEN,
      });
    } else {
      watchingAlert();
    }
  }, [isReadOnlyWallet, navigate, updateInputCurrency]);

  return (
    <ActionButton icon="􀖅" onPress={handlePress} testID="swap-button">
      {lang.t('button.swap')}
    </ActionButton>
  );
}

function SendButton() {
  const { isReadOnlyWallet } = useWallets();

  const { navigate } = useNavigation();

  const handlePress = React.useCallback(() => {
    if (!isReadOnlyWallet || enableActionsOnReadOnlyWallet) {
      analytics.track('Tapped "Send"', {
        category: 'home screen',
      });

      navigate(Routes.SEND_FLOW);
    } else {
      watchingAlert();
    }
  }, [navigate, isReadOnlyWallet]);

  return (
    <ActionButton
      icon="mintSendIcon"
      onPress={handlePress}
      testID="send-button"
    >
      {lang.t('button.send')}
    </ActionButton>
  );
}

function MoreButton() {
  // ////////////////////////////////////////////////////
  // Handlers

  const [isToastActive, setToastActive] = useRecoilState(
    addressCopiedToastAtom
  );
  const { accountAddress } = useAccountProfile();
  const { navigate } = useNavigation();
  const [activeWCV2Sessions, setActiveWCV2Sessions] = React.useState(
    getAllActiveSessionsSync()
  );

  const handlePressCopy = React.useCallback(() => {
    if (!isToastActive) {
      setToastActive(true);
      setTimeout(() => {
        setToastActive(false);
      }, 2000);
    }
    Clipboard.setString(accountAddress);
  }, [accountAddress, isToastActive, setToastActive]);

  const handlePressQRCode = React.useCallback(() => {
    analyticsV2.track(analyticsV2.event.qrCodeViewed, {
      component: 'ProfileActionButtonsRow',
    });

    navigate(Routes.RECEIVE_MODAL);
  }, [navigate]);

  const handlePressActivity = React.useCallback(() => {
    navigate(Routes.PROFILE_SCREEN);
  }, [navigate]);

  const handlePressConnectedApps = React.useCallback(() => {
    navigate(Routes.CONNECTED_DAPPS);
  }, [navigate]);

  // ////////////////////////////////////////////////////
  // Context Menu

  const { mostRecentWalletConnectors } = useWalletConnectConnections();

  const menuConfig = {
    menuItems: [
      {
        actionKey: 'copy',
        actionTitle: lang.t('wallet.copy_address'),
        icon: { iconType: 'SYSTEM', iconValue: 'doc.on.doc' },
      },
      {
        actionKey: 'qrCode',
        actionTitle: lang.t('button.my_qr_code'),
        icon: { iconType: 'SYSTEM', iconValue: 'qrcode' },
      },
      {
        actionKey: 'activity',
        actionTitle: lang.t('button.activity'),
        icon: { iconType: 'SYSTEM', iconValue: 'doc.text.below.ecg' },
      },
      mostRecentWalletConnectors.length > 0 || activeWCV2Sessions.length > 0
        ? {
            actionKey: 'connectedApps',
            actionTitle: lang.t('wallet.connected_apps'),
            icon: { iconType: 'SYSTEM', iconValue: 'app.badge.checkmark' },
          }
        : null,
    ].filter(Boolean),
    ...(ios ? { menuTitle: '' } : {}),
  };

  const handlePressMenuItem = React.useCallback(
    e => {
      if (e.nativeEvent.actionKey === 'copy') {
        handlePressCopy();
      }
      if (e.nativeEvent.actionKey === 'qrCode') {
        handlePressQRCode();
      }
      if (e.nativeEvent.actionKey === 'activity') {
        handlePressActivity();
      }
      if (e.nativeEvent.actionKey === 'connectedApps') {
        handlePressConnectedApps();
      }
    },
    [handlePressConnectedApps, handlePressCopy, handlePressQRCode]
  );

  const onMenuWillShow = React.useCallback(() => {
    // update state to potentially hide the menu button
    setActiveWCV2Sessions(getAllActiveSessionsSync());
  }, [setActiveWCV2Sessions]);

  return (
    <ContextMenuButton
      onMenuWillShow={onMenuWillShow}
      menuConfig={menuConfig}
      onPressMenuItem={handlePressMenuItem}
    >
      <ActionButton icon="mintMoreIcon" testID="more-button">
        {lang.t('button.more')}
      </ActionButton>
    </ContextMenuButton>
  );
}
