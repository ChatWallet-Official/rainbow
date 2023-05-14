import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { IS_TESTING } from 'react-native-dotenv';
import { ActivityList } from '../components/activity-list';
import { Page } from '../components/layout';
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
import { position } from '@/styles';
import { Navbar } from '@/components/navbar/Navbar';
import MintNavBackIcon from '@/components/icons/svg/MintNavBackIcon';
import { ProfileInfoRow } from '@/components/asset-list/RecyclerAssetList2/profile-header/ProfileInfoRow';
import { View } from 'react-native';

const ACTIVITY_LIST_INITIALIZATION_DELAY = 5000;

const ProfileScreenPage = styled(Page)({
  ...position.sizeAsObject('100%'),
  flex: 1,
});

export default function ProfileScreen({ navigation }) {
  const [activityListInitialized, setActivityListInitialized] = useState(false);
  const isFocused = useIsFocused();
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const totalValue = params?.totalValue;

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
      <Navbar
        hasStatusBarInset
        leftComponent={
          <Navbar.Item onPress={onPressBackButton} testID="settings-button">
            <Navbar.SvgIcon icon={MintNavBackIcon} />
          </Navbar.Item>
        }
        title="Activity"
      />

      <ActivityList
        addCashAvailable={addCashAvailable}
        contacts={contacts}
        header={
          <View style={{ marginTop: 20 }}>
            <ProfileInfoRow totalValue={totalValue} />
          </View>
        }
        isEmpty={isEmpty}
        isLoading={isLoading}
        navigation={navigation}
        network={network}
        sections={sections}
        {...accountTransactions}
      />
    </ProfileScreenPage>
  );
}
