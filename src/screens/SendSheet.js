import { useRoute } from '@react-navigation/native';

import lang from 'i18n-js';
import { isEmpty } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionManager, Keyboard, View, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { GasSpeedButton } from '../components/gas';
import { Column } from '../components/layout';
import { SendContactList, SendHeader } from '../components/send';
import { SheetActionButton } from '../components/sheet';
import { PROFILES, useExperimentalFlag } from '@/config';
import { AssetTypes } from '@/entities';

import { debouncedFetchSuggestions } from '@/handlers/ens';
import {
  getProviderForNetwork,
  resolveNameOrAddress,
  web3Provider,
} from '@/handlers/web3';
import Network from '@/helpers/networkTypes';
import {
  checkIsValidAddressOrDomainFormat,
  isENSAddressFormat,
} from '@/helpers/validators';
import {
  prefetchENSAvatar,
  prefetchENSCover,
  useAccountSettings,
  useCoinListEditOptions,
  useColorForAsset,
  useContacts,
  useGas,
  usePrevious,
  useSendableUniqueTokens,
  useSendSavingsAccount,
  useSendSheetInputRefs,
  useSortedAccountAssets,
  useTransactionConfirmation,
  useUpdateAssetOnchainBalance,
  useUserAccounts,
} from '@/hooks';

import { useNavigation } from '@/navigation/Navigation';

import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { borders, fonts } from '@/styles';

import { deviceUtils, ethereumUtils, getUniqueTokenType } from '@/utils';

import { IS_ANDROID, IS_IOS } from '@/env';

import { Text } from '../components/text';
import { Button } from '../components/buttons';
import { ens } from '@/raps/actions';
import { availableAssets } from '@/helpers/availableAssets';

const sheetHeight = deviceUtils.dimensions.height - (IS_ANDROID ? 30 : 10);
const statusBarHeight = getStatusBarHeight(true);

const Container = styled.View({
  backgroundColor: ({ theme: { colors } }) => colors.transparent,
  flex: 1,
  paddingTop: IS_IOS ? 0 : statusBarHeight,
  width: '100%',
});

const SheetContainer = styled(Column).attrs({
  align: 'center',
  flex: 1,
})({
  ...borders.buildRadiusAsObject('top', IS_IOS ? 0 : 16),
  backgroundColor: ({ theme: { colors } }) => colors.white,
  height: sheetHeight,
  width: '100%',
});

export default function SendSheet(props) {
  const dispatch = useDispatch();
  const { goBack, navigate } = useNavigation();
  const { dataAddNewTransaction } = useTransactionConfirmation();
  const updateAssetOnchainBalanceIfNeeded = useUpdateAssetOnchainBalance();
  const { sortedAssets } = useSortedAccountAssets();
  const {
    gasFeeParamsBySpeed,
    gasLimit,
    isSufficientGas,
    isValidGas,
    prevSelectedGasFee,
    selectedGasFee,
    startPollingGasFees,
    stopPollingGasFees,
    updateDefaultGasLimit,
    updateTxFee,
  } = useGas();
  const recipientFieldRef = useRef();
  const profilesEnabled = useExperimentalFlag(PROFILES);

  const {
    contacts,
    onRemoveContact,
    filteredContacts,
    onAddOrUpdateContacts,
  } = useContacts();
  const { userAccounts, watchedAccounts } = useUserAccounts();
  const { sendableUniqueTokens } = useSendableUniqueTokens();
  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const [toAddress, setToAddress] = useState();

  const savings = useSendSavingsAccount();
  const { hiddenCoinsObj, pinnedCoinsObj } = useCoinListEditOptions();

  const [currentNetwork, setCurrentNetwork] = useState();
  const prevNetwork = usePrevious(currentNetwork);
  const [currentInput, setCurrentInput] = useState('');

  const { params } = useRoute();

  const [recipient, setRecipient] = useState('');
  const [nickname, setNickname] = useState('');

  const [debouncedInput] = useDebounce(currentInput, 500);
  const [debouncedRecipient] = useDebounce(recipient, 500);
  const recipientOverride = params?.address;
  const [isValidAddress, setIsValidAddress] = useState(!!recipientOverride);

  const theme = useTheme();
  const { colors, isDarkMode } = theme;

  const {
    nativeCurrencyInputRef,
    setLastFocusedInputHandle,
    assetInputRef,
  } = useSendSheetInputRefs();

  const showEmptyState = true;

  useEffect(() => {
    const resolveAddressIfNeeded = async () => {
      let realAddress = debouncedRecipient;
      const isValid = await checkIsValidAddressOrDomainFormat(
        debouncedRecipient
      );
      if (isValid) {
        realAddress = await resolveNameOrAddress(debouncedRecipient);
        setToAddress(realAddress);
      } else {
        setIsValidAddress(false);
      }
    };
    debouncedRecipient && resolveAddressIfNeeded();
  }, [debouncedRecipient]);

  const onChangeInput = useCallback(
    text => {
      const isValid = checkIsValidAddressOrDomainFormat(text);
      if (!isValid) {
        setIsValidAddress();
      }
      setToAddress();
      setCurrentInput(text);
      setRecipient(text);
      setNickname(text);
      if (profilesEnabled && isENSAddressFormat(text)) {
        prefetchENSAvatar(text);
        prefetchENSCover(text);
      }
    },
    [profilesEnabled]
  );

  useEffect(() => {
    updateDefaultGasLimit();
  }, [updateDefaultGasLimit]);

  const checkAddress = useCallback(recipient => {
    if (recipient) {
      const isValidFormat = checkIsValidAddressOrDomainFormat(recipient);
      setIsValidAddress(isValidFormat);
    }
  }, []);

  const [ensSuggestions, setEnsSuggestions] = useState([]);
  const [loadingEnsSuggestions, setLoadingEnsSuggestions] = useState(false);
  useEffect(() => {
    if (
      network === Network.mainnet &&
      !recipientOverride &&
      recipient?.length
    ) {
      setLoadingEnsSuggestions(true);
      debouncedFetchSuggestions(
        recipient,
        setEnsSuggestions,
        setLoadingEnsSuggestions,
        profilesEnabled
      );
    } else {
      setEnsSuggestions([]);
    }
  }, [
    network,
    recipient,
    recipientOverride,
    setEnsSuggestions,
    watchedAccounts,
    profilesEnabled,
  ]);

  useEffect(() => {
    checkAddress(debouncedInput);
  }, [checkAddress, debouncedInput]);

  const sendContactListDataKey = useMemo(
    () => `${ensSuggestions?.[0]?.address || '_'}`,
    [ensSuggestions]
  );

  const isEmptyWallet = !sortedAssets.length && !sendableUniqueTokens.length;

  const handlePressNextButton = useCallback(() => {
    const address = recipient;
    onAddOrUpdateContacts(address, nickname, colors.orangeCW, network, ens);
    onPressContact(address, address);
  }, [
    recipient,
    onAddOrUpdateContacts,
    nickname,
    colors.orangeCW,
    network,
    onPressContact,
  ]);

  const onPressContact = useCallback(
    (recipient, nickname) => {
      setIsValidAddress(true);
      setRecipient(recipient);
      setNickname(nickname);
      const assets = availableAssets(
        hiddenCoinsObj,
        nativeCurrency,
        network,
        pinnedCoinsObj,
        savings,
        sortedAssets,
        sendableUniqueTokens
      );

      if (assets.length > 0) {
        const paramsForForm = {
          ...props,
          ...params,
          assetInputRef: assetInputRef,
          nativeCurrency: nativeCurrency,
          nativeCurrencyInputRef: nativeCurrencyInputRef,
          selected: assets[0],
          setLastFocusedInputHandle: setLastFocusedInputHandle,
          recipient: recipient,
        };

        navigate(Routes.SEND_ASSET_FORM, paramsForForm);
      }
    },
    [
      assetInputRef,
      hiddenCoinsObj,
      nativeCurrency,
      nativeCurrencyInputRef,
      navigate,
      network,
      params,
      pinnedCoinsObj,
      props,
      savings,
      sendableUniqueTokens,
      setLastFocusedInputHandle,
      sortedAssets,
    ]
  );

  return (
    <Container testID="send-sheet">
      <SheetContainer>
        <SendHeader
          contacts={contacts}
          fromProfile={params?.fromProfile}
          hideDivider={false}
          isValidAddress={isValidAddress}
          nickname={nickname}
          onChangeAddressInput={onChangeInput}
          onPressPaste={recipient => {
            checkAddress(recipient);
            setRecipient(recipient);
          }}
          recipient={recipient}
          recipientFieldRef={recipientFieldRef}
          removeContact={onRemoveContact}
          showAssetList={false}
          userAccounts={userAccounts}
          watchedAccounts={watchedAccounts}
        />
        {showEmptyState && (
          <SendContactList
            contacts={filteredContacts}
            currentInput={currentInput}
            ensSuggestions={ensSuggestions}
            key={sendContactListDataKey}
            loadingEnsSuggestions={loadingEnsSuggestions}
            onPressContact={onPressContact}
            removeContact={onRemoveContact}
            userAccounts={userAccounts}
            watchedAccounts={watchedAccounts}
          />
        )}
        <View
          backgroundColor={!isValidAddress ? colors.black10 : colors.greenCW}
          style={styles.buttonContainer}
        >
          <Button
            backgroundColor="clear"
            disabled={!isValidAddress}
            onPress={handlePressNextButton}
          >
            <Text
              align="center"
              color={!isValidAddress ? colors.black30 : colors.white}
              style={styles.buttonText}
            >
              {lang.t('button.next')}
            </Text>
          </Button>
        </View>
      </SheetContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 64,
    width: deviceUtils.dimensions.width - 64,
  },
  buttonText: {
    weight: fonts.weight.medium,
  },
});
