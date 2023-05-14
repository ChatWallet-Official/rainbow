import AsyncStorage from '@react-native-async-storage/async-storage';
import lang from 'i18n-js';
import React, { useCallback, useMemo } from 'react';
import {
  Linking,
  NativeModules,
  Share,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  ContextMenuButton,
  MenuActionConfig,
} from 'react-native-ios-context-menu';
import { supportedLanguages } from '../../../languages';
import AppVersionStamp from '../../../components/AppVersionStamp';
import Menu from './Menu';
import MenuContainer from './MenuContainer';
import MenuItem from './MenuItem';
import AppIconIcon from '@/assets/settingsAppIcon.png';
import AppIconIconDark from '@/assets/settingsAppIconDark.png';
import BackupIcon from '@/assets/settingsBackup.png';
import BackupIconDark from '@/assets/settingsBackupDark.png';
import CurrencyIcon from '@/assets/settingsCurrency.png';
import CurrencyIconDark from '@/assets/settingsCurrencyDark.png';
import DarkModeIcon from '@/assets/settingsDarkMode.png';
import DarkModeIconDark from '@/assets/settingsDarkModeDark.png';
import LanguageIcon from '@/assets/settingsLanguage.png';
import LanguageIconDark from '@/assets/settingsLanguageDark.png';
import MintSettingsBackup from '@/assets/mintSettingsBackup.png';
import MintSettingsCurrency from '@/assets/mintSettingsCurrency.png';
import MintSettingsCard from '@/assets/mintSettingsCard.png';
import MintSettingsAirdrop from '@/assets/mintSettingsAirdrop.png';
import MintSettingsAbout from '@/assets/mintSettingsAbout.png';
import MintSettingsSecurity from '@/assets/mintSettingsSecurity.png';
import MintSettingsFeedback from '@/assets/mintSettingsFeedback.png';
import NetworkIcon from '@/assets/settingsNetwork.png';
import NetworkIconDark from '@/assets/settingsNetworkDark.png';
import NotificationsIcon from '@/assets/settingsNotifications.png';
import NotificationsIconDark from '@/assets/settingsNotificationsDark.png';
import PrivacyIcon from '@/assets/settingsPrivacy.png';
import PrivacyIconDark from '@/assets/settingsPrivacyDark.png';
import useExperimentalFlag, {
  LANGUAGE_SETTINGS,
  NOTIFICATIONS,
} from '@/config/experimentalHooks';
import { Box } from '@/design-system';
import networkInfo from '@/helpers/networkInfo';
import WalletTypes from '@/helpers/walletTypes';
import { useAccountSettings, useSendFeedback, useWallets } from '@/hooks';
import { Themes, useTheme } from '@/theme';
import { showActionSheetWithOptions } from '@/utils';
import { AppleReviewAddress, REVIEW_DONE_KEY } from '@/utils/reviewAlert';
import { RowWithMargins } from '@/components/layout';
import { colors, fonts } from '@/styles';
import { Icon } from '@/components/icons';

const { RainbowRequestReview, RNReview } = NativeModules;

const SettingsExternalURLs = {
  rainbowHomepage: 'https://rainbow.me',
  rainbowLearn: 'https://learn.rainbow.me',
  review:
    'itms-apps://itunes.apple.com/us/app/appName/id1457119021?mt=8&action=write-review',
  twitterDeepLink: 'twitter://user?screen_name=rainbowdotme',
  twitterWebUrl: 'https://twitter.com/rainbowdotme',
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const checkAllWallets = (wallets: any) => {
  if (!wallets)
    return { allBackedUp: false, areBackedUp: false, canBeBackedUp: false };
  let areBackedUp = true;
  let canBeBackedUp = false;
  let allBackedUp = true;
  Object.keys(wallets).forEach(key => {
    if (
      !wallets[key].backedUp &&
      wallets[key].type !== WalletTypes.readOnly &&
      wallets[key].type !== WalletTypes.bluetooth
    ) {
      allBackedUp = false;
    }

    if (
      !wallets[key].backedUp &&
      wallets[key].type !== WalletTypes.readOnly &&
      wallets[key].type !== WalletTypes.bluetooth &&
      !wallets[key].imported
    ) {
      areBackedUp = false;
    }
    if (
      wallets[key].type !== WalletTypes.readOnly &&
      wallets[key].type !== WalletTypes.readOnly
    ) {
      canBeBackedUp = true;
    }
  });
  return { allBackedUp, areBackedUp, canBeBackedUp };
};

interface SettingsSectionProps {
  onCloseModal: () => void;
  onPressAppIcon: () => void;
  onPressBackup: () => void;
  onPressCurrency: () => void;
  onPressDev: () => void;
  onPressLanguage: () => void;
  onPressNetwork: () => void;
  onPressPrivacy: () => void;
  onPressNotifications: () => void;
}

const SettingsSection = ({
  onCloseModal,
  onPressAppIcon,
  onPressBackup,
  onPressCurrency,
  onPressDev,
  onPressLanguage,
  onPressNetwork,
  onPressPrivacy,
  onPressNotifications,
}: SettingsSectionProps) => {
  const isReviewAvailable = false;
  const { wallets, isReadOnlyWallet } = useWallets();
  const {
    language,
    nativeCurrency,
    network,
    testnetsEnabled,
  } = useAccountSettings();
  const isLanguageSelectionEnabled = useExperimentalFlag(LANGUAGE_SETTINGS);
  const isNotificationsEnabled = useExperimentalFlag(NOTIFICATIONS);

  const { isDarkMode, setTheme, colorScheme } = useTheme();

  const onSendFeedback = useSendFeedback();

  const onPressReview = useCallback(async () => {
    if (ios) {
      onCloseModal();
      RainbowRequestReview.requestReview((handled: boolean) => {
        if (!handled) {
          AsyncStorage.setItem(REVIEW_DONE_KEY, 'true');
          Linking.openURL(AppleReviewAddress);
        }
      });
    } else {
      RNReview.show();
    }
  }, [onCloseModal]);

  const onPressShare = useCallback(() => {
    Share.share({
      message: `${lang.t('settings.hey_friend_message')} ${
        SettingsExternalURLs.rainbowHomepage
      }`,
    });
  }, []);

  const onPressTwitter = useCallback(async () => {
    Linking.canOpenURL(SettingsExternalURLs.twitterDeepLink).then(supported =>
      supported
        ? Linking.openURL(SettingsExternalURLs.twitterDeepLink)
        : Linking.openURL(SettingsExternalURLs.twitterWebUrl)
    );
  }, []);

  const onPressLearn = useCallback(
    () => Linking.openURL(SettingsExternalURLs.rainbowLearn),
    []
  );

  const { allBackedUp, areBackedUp, canBeBackedUp } = useMemo(
    () => checkAllWallets(wallets),
    [wallets]
  );

  const themeMenuConfig = useMemo(() => {
    return {
      menuItems: [
        {
          actionKey: Themes.SYSTEM,
          actionTitle: lang.t('settings.theme_section.system'),
          icon: {
            iconType: 'SYSTEM',
            iconValue: 'gear',
          },
          menuState: colorScheme === Themes.SYSTEM ? 'on' : 'off',
        },
        {
          actionKey: Themes.LIGHT,
          actionTitle: lang.t('settings.theme_section.light'),
          icon: {
            iconType: 'SYSTEM',
            iconValue: 'sun.max',
          },
          menuState: colorScheme === Themes.LIGHT ? 'on' : 'off',
        },
        {
          actionKey: Themes.DARK,
          actionTitle: lang.t('settings.theme_section.dark'),
          icon: {
            iconType: 'SYSTEM',
            iconValue: 'moon',
          },
          menuState: colorScheme === Themes.DARK ? 'on' : 'off',
        },
      ] as MenuActionConfig[],
      menuTitle: '',
    };
  }, [colorScheme]);

  const onPressThemeAndroidActions = useCallback(() => {
    const androidActions = [
      lang.t('settings.theme_section.system'),
      lang.t('settings.theme_section.light'),
      lang.t('settings.theme_section.dark'),
    ] as const;

    showActionSheetWithOptions(
      {
        options: androidActions,
        showSeparators: true,
        title: '',
      },
      (idx: number) => {
        if (idx === 0) {
          setTheme(Themes.SYSTEM);
        } else if (idx === 1) {
          setTheme(Themes.LIGHT);
        } else if (idx === 2) {
          setTheme(Themes.DARK);
        }
      }
    );
  }, [setTheme]);

  const handleSelectTheme = useCallback(
    ({ nativeEvent: { actionKey } }) => {
      setTheme(actionKey);
    },
    [setTheme]
  );

  return (
    <MenuContainer testID="settings-menu-container">
      <Menu>
        {canBeBackedUp && (
          <MenuItem
            hasRightArrow
            leftComponent={
              <MenuItem.ImageIcon size={30} source={MintSettingsBackup} />
            }
            onPress={onPressBackup}
            rightComponent={
              <MenuItem.StatusIcon
                status={
                  allBackedUp
                    ? 'complete'
                    : areBackedUp
                    ? 'incomplete'
                    : 'warning'
                }
              />
            }
            size={60}
            testID="backup-section"
            titleComponent={<MenuItem.Title text={lang.t('settings.backup')} />}
          />
        )}
        <MenuItem
          hasRightArrow
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsCurrency} />
          }
          onPress={onPressCurrency}
          rightComponent={
            <MenuItem.Selection>{nativeCurrency || ''}</MenuItem.Selection>
          }
          size={60}
          testID="currency-section"
          titleComponent={<MenuItem.Title text={lang.t('settings.currency')} />}
        />
        <MenuItem
          hasRightArrow
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsCard} />
          }
          onPress={onPressPrivacy}
          size={60}
          titleComponent={<MenuItem.Title text={'My Card'} />}
        />
        <MenuItem
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsAirdrop} />
          }
          onPress={onPressPrivacy}
          size={60}
          titleComponent={<MenuItem.Title text={'Claim Airdrop'} />}
        />
        <MenuItem
          hasRightArrow
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsAbout} />
          }
          onPress={onPressPrivacy}
          size={60}
          titleComponent={<MenuItem.Title text={'About'} />}
        />
        <MenuItem
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsSecurity} />
          }
          onPress={onPressPrivacy}
          size={60}
          titleComponent={<MenuItem.Title text={'Security'} />}
        />
        <MenuItem
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsFeedback} />
          }
          onPress={onSendFeedback}
          size={52}
          testID="feedback-section"
          titleComponent={
            <MenuItem.Title
              text={lang.t(
                ios
                  ? 'settings.feedback_and_support'
                  : 'settings.feedback_and_reports'
              )}
            />
          }
        />
        {isReviewAvailable && (
          <MenuItem
            leftComponent={<MenuItem.TextIcon icon="❤️" isEmoji />}
            onPress={onPressReview}
            size={52}
            testID="review-section"
            titleComponent={<MenuItem.Title text={lang.t('settings.review')} />}
          />
        )}
        <MenuItem
          leftComponent={
            <MenuItem.ImageIcon size={30} source={MintSettingsAirdrop} />
          }
          onPress={onPressDev}
          size={52}
          testID="developer-section"
          titleComponent={
            <MenuItem.Title text={lang.t('settings.developer')} />
          }
        />
      </Menu>
      <Box alignItems="center" width="full">
        <RowWithMargins margin={15} style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onPressTwitter}>
            <Icon name="mintTwitterIcon" />
            <Text style={styles.buttonText}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPressShare}>
            <Icon name="mintShareIcon" />
            <Text style={styles.buttonText}>Share MintWallet</Text>
          </TouchableOpacity>
        </RowWithMargins>
      </Box>
    </MenuContainer>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'relative',
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: 'column',
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonText: {
    marginTop: 12,
    fontSize: fonts.size.lmedium,
    fontWeight: fonts.weight.medium,
    color: colors.mintBlack80,
  },
});
