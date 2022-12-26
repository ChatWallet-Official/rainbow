import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { IS_TESTING } from 'react-native-dotenv';
import { ActivityList } from '../components/activity-list';
import { Page } from '../components/layout';
import { ProfileMasthead } from '../components/profile';
import TransactionList from '../components/transaction-list/TransactionList';
import NetworkTypes from '../helpers/networkTypes';
import { useNavigation } from '../navigation/Navigation';
import {
  useAccountProfile,
  useAccountSettings,
  useAccountTransactions,
  useContacts,
  useRequests,
} from '@/hooks';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { colors, position } from '@/styles';
import { Navbar } from '@/components/navbar/Navbar';
import CaretRightIcon from '@/components/icons/svg/CaretRightIcon';
import LinearGradient from 'react-native-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { Icon } from '@/components/icons';

const ACTIVITY_LIST_INITIALIZATION_DELAY = 5000;

const ProfileScreenPage = styled(Page)({
  ...position.sizeAsObject('100%'),
  flex: 1,
});

export default function ProfileScreen({ navigation }) {
  const [activityListInitialized, setActivityListInitialized] = useState(false);
  const isFocused = useIsFocused();
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const accountTransactions = useAccountTransactions(
    activityListInitialized,
    isFocused
  );

  const {
    isLoadingTransactions: isLoading,
    sections,
    transactions,
    transactionsCount,
  } = accountTransactions;
  const { contacts } = useContacts();
  const { pendingRequestCount, requests } = useRequests();
  const { network } = useAccountSettings();

  const isEmpty = !transactionsCount && !pendingRequestCount;

  useEffect(() => {
    if (params && params.goBackImmediately) goBack();
  }, [goBack, params]);

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

  const LinearBackground = styled(LinearGradient).attrs(
    ({ theme: { colors } }) => ({
      colors: [
        colors.alpha(colors.black, 0.16),
        colors.alpha(colors.black, 0.4),
      ],
      end: { x: 1, y: 0.5 },
      start: { x: 0, y: 0.5 },
    })
  )();

  return (
    <ProfileScreenPage testID="profile-screen">
      <View style={styles.background}></View>
      <LinearBackground style={absoluteFillStyle} />
      <Navbar
        hasStatusBarInset
        leftComponent={
          <Navbar.Item onPress={onPressBackButton} testID="settings-button">
            <Icon name="navBack" />
          </Navbar.Item>
        }
      />
      {network === NetworkTypes.mainnet && ios ? (
        <TransactionList
          addCashAvailable={addCashAvailable}
          contacts={contacts}
          initialized={activityListInitialized}
          isLoading={isLoading}
          network={network}
          requests={requests}
          transactions={transactions}
        />
      ) : (
        <ActivityList
          addCashAvailable={addCashAvailable}
          contacts={contacts}
          header={
            <ProfileMasthead
              addCashAvailable={addCashAvailable}
              onChangeWallet={onChangeWallet}
            />
          }
          isEmpty={isEmpty}
          isLoading={isLoading}
          navigation={navigation}
          network={network}
          recyclerListView={ios}
          sections={sections}
          {...accountTransactions}
        />
      )}
    </ProfileScreenPage>
  );
}

const absoluteFillStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.greenCW,
    ...absoluteFillStyle,
  },
  share: {
    marginBottom: 44,
  },
});
