import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { IS_TESTING } from 'react-native-dotenv';
import { ActivityList } from '../components/activity-list';
import { Page, RowWithMargins } from '../components/layout';
import { ProfileMasthead } from '../components/profile';
import NetworkTypes from '../helpers/networkTypes';
import { useNavigation } from '../navigation/Navigation';
import {
  useAccountSettings,
  useAccountTransactions,
  useContacts,
  useRequests,
} from '@/hooks';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { colors, fonts, position } from '@/styles';
import { Navbar } from '@/components/navbar/Navbar';
import CaretRightIcon from '@/components/icons/svg/CaretRightIcon';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from '@/components/icons';

const ACTIVITY_LIST_INITIALIZATION_DELAY = 5000;

const ProfileScreenPage = styled(Page)({
  ...position.sizeAsObject('100%'),
  flex: 1,
});

export default function WalletTab({ navigation }) {
  const [activityListInitialized, setActivityListInitialized] = useState(false);
  const isFocused = useIsFocused();
  const { navigate } = useNavigation();

  const accountTransactions = useAccountTransactions(
    activityListInitialized,
    isFocused
  );

  const {
    isLoadingTransactions: isLoading,
    sections,
    transactionsCount,
  } = accountTransactions;
  const { contacts } = useContacts();
  const { pendingRequestCount } = useRequests();
  const { network } = useAccountSettings();

  const isEmpty = !transactionsCount && !pendingRequestCount;

  useEffect(() => {
    setTimeout(() => {
      setActivityListInitialized(true);
    }, ACTIVITY_LIST_INITIALIZATION_DELAY);
  }, []);

  const onPressBackButton = useCallback(() => navigate(Routes.WALLET_SCREEN), [
    navigate,
  ]);

  const onPressSettings = useCallback(() => navigate(Routes.SETTINGS_SHEET), [
    navigate,
  ]);

  const onChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  const addCashSupportedNetworks = network === NetworkTypes.mainnet;
  const addCashAvailable =
    IS_TESTING === 'true' ? false : addCashSupportedNetworks;

  return (
    <ProfileScreenPage testID="profile-screen">
      <View style={styles.headerBackground}></View>
      <View style={styles.container}>
        <View style={styles.profileMastheadContainer}>
          <ProfileMasthead
            addCashAvailable={addCashAvailable}
            onChangeWallet={onChangeWallet}
          />
        </View>

        <RowWithMargins margin={15} style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onPressBackButton}>
            <Icon name="mintWalletIcon" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Wallet</Text>
              <Icon name="mintRightIcon" color={colors.mintBlack80} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPressSettings}>
            <Icon name="mintSettingsIcon" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Settings</Text>
              <Icon name="mintRightIcon" color={colors.mintBlack80} />
            </View>
          </TouchableOpacity>
        </RowWithMargins>
      </View>
    </ProfileScreenPage>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#242425',
    height: 164,
    width: '100%',
  },
  container: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: colors.mintBackground,
    height: '100%',
  },
  profileMastheadContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
    bottom: 60,
  },
  buttonsContainer: {
    position: 'relative',
    bottom: 60,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: 'column',
    flex: 1,
    height: 100,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonTextContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fonts.size.lmedium,
    fontWeight: fonts.weight.medium,
    color: colors.mintBlack80,
  },
});
