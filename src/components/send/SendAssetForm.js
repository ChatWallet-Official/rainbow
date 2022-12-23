import React, { Fragment, useCallback, useMemo } from 'react';
import { KeyboardArea } from 'react-native-keyboard-area';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonPressAnimation } from '../animations';
import { SendCoinRow } from '../coin-row';
import CollectiblesSendRow from '../coin-row/CollectiblesSendRow';
import SendSavingsCoinRow from '../coin-row/SendSavingsCoinRow';
import { Column } from '../layout';
import { Text } from '../text';
import SendAssetFormCollectible from './SendAssetFormCollectible';
import SendAssetFormToken from './SendAssetFormToken';
import { AssetTypes } from '@/entities';
import Network from '@/helpers/networkTypes';
import { chainAssets, rainbowTokenList } from '@/references';
import { PROFILES, useExperimentalFlag } from '@/config';
import {
  prefetchENSAvatar,
  prefetchENSCover,
  useAccountSettings,
  useCoinListEditOptions,
  useColorForAsset,
  useContacts,
  useCurrentNonce,
  useENSProfile,
  useENSRegistrationActionHandler,
  useGas,
  useMaxInputBalance,
  usePrevious,
  useSendableUniqueTokens,
  useSendSavingsAccount,
  useSendSheetInputRefs,
  useSortedAccountAssets,
  useTransactionConfirmation,
  useUpdateAssetOnchainBalance,
  useUserAccounts,
  useDimensions,
  useKeyboardHeight,
} from '@/hooks';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { colors, fonts, padding, position } from '@/styles';
import ShadowStack from '@/react-native-shadow-stack';
import { useRoute, useNavigation } from '@react-navigation/core';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import { SheetHandleFixedToTop, SheetTitle } from '../sheet';
import { SendSheetTitle } from './SendHeader';
import lang from 'i18n-js';
import { abbreviations, ethereumUtils, getUniqueTokenType } from '@/utils';
import { Icon } from '../icons';
import { navigate } from '@/navigation/Navigation';
import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountFromNativeValue,
  formatInputDecimals,
  lessThan,
} from '@/helpers/utilities';
import { isEmpty, isEqual, isString } from 'lodash';
import { isL2Asset, isNativeAsset } from '@/handlers/assets';
import { captureEvent, captureException } from '@sentry/react-native';
import { getDefaultCheckboxes } from '@/screens/SendConfirmationSheet';
import { WrappedAlert as Alert } from '@/helpers/alert';
import { analytics } from '@/analytics';
import {
  buildTransaction,
  createSignableTransaction,
  estimateGasLimit,
  getProviderForNetwork,
  isL2Network,
  resolveNameOrAddress,
  web3Provider,
} from '@/handlers/web3';
import {
  checkIsValidAddressOrDomain,
  checkIsValidAddressOrDomainFormat,
  isENSAddressFormat,
} from '@/helpers/validators';
import { loadWallet, sendTransaction } from '@/model/wallet';
import { parseGasParamsForTransaction } from '@/parsers';
import logger from '@/utils/logger';
import { NoResults } from '@/components/list';
import { NoResultsType } from '@/components/list/NoResults';
import { useDispatch } from 'react-redux';

const AssetRowShadow = colors => [
  [0, 10, 30, colors.shadow, 0.12],
  [0, 5, 15, colors.shadow, 0.06],
];

const AssetRowGradient = styled(LinearGradient).attrs(
  ({ theme: { colors } }) => ({
    colors: colors.gradients.offWhite,
    end: { x: 0.5, y: 1 },
    start: { x: 0.5, y: 0 },
  })
)(position.coverAsObject);

const Container = styled(Column)({
  ...position.sizeAsObject('100%'),
  backgroundColor: ({ theme: { colors } }) => colors.white,
  flex: 1,
});

const FormContainer = styled(Column).attrs(
  ios
    ? {
        align: 'end',
        justify: 'space-between',
      }
    : {}
)(({ isNft }) => ({
  flex: 1,
  ...(isNft ? padding.object(0) : padding.object(0, 19)),
}));

export default function SendAssetForm() {
  const { params } = useRoute();
  const {
    buttonRenderer,
    setLastFocusedInputHandle,
    nativeCurrencyInputRef,
    assetInputRef,
    txSpeedRenderer,
    recipient,
    nativeAmount: nativeAmountOverride,
    asset: assetOverride,
    ...props
  } = params;

  const [selected, setSelected] = useState(params.selected);
  const [toAddress, setToAddress] = useState(recipient);
  const { isTinyPhone, width: deviceWidth } = useDimensions();
  const keyboardHeight = useKeyboardHeight();
  const [showNativeValue, setShowNativeValue] = useState(true);
  const { goBack, navigate } = useNavigation();
  const isNft = selected.type === AssetTypes.nft;
  const isSavings = selected.type === AssetTypes.compound;
  const { maxInputBalance, updateMaxInputBalance } = useMaxInputBalance();
  const prevAssetOverride = usePrevious(assetOverride);
  const [currentProvider, setCurrentProvider] = useState();
  const [currentNetwork, setCurrentNetwork] = useState();
  const prevNetwork = usePrevious(currentNetwork);
  const dispatch = useDispatch();
  const { dataAddNewTransaction } = useTransactionConfirmation();
  const updateAssetOnchainBalanceIfNeeded = useUpdateAssetOnchainBalance();
  const { accountAddress, nativeCurrency, network } = useAccountSettings();
  const uniqueTokenType = isNft ? getUniqueTokenType(selected) : undefined;
  const isENS = uniqueTokenType === 'ENS';

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

  const AssetRowElement = isNft
    ? CollectiblesSendRow
    : isSavings
    ? SendSavingsCoinRow
    : SendCoinRow;

  const onFocusAssetInput = useCallback(() => {
    setLastFocusedInputHandle(assetInputRef);
    setShowNativeValue(false);
  }, [assetInputRef, setLastFocusedInputHandle]);

  const onFocusNativeInput = useCallback(() => {
    setLastFocusedInputHandle(nativeCurrencyInputRef);
    setShowNativeValue(true);
  }, [nativeCurrencyInputRef, setLastFocusedInputHandle]);

  const { colors } = useTheme();

  const address = selected?.mainnet_address || selected?.address;
  const type = selected?.mainnet_address ? AssetTypes.token : selected?.type;

  // sendUpdateSelected(selected);
  // updateMaxInputBalance(selected);

  let colorForAsset = useColorForAsset({ address, type });
  if (isNft) {
    colorForAsset = colors.appleBlue;
  }

  const noShadows = [[0, 0, 0, colors.transparent, 0]];
  const shadows = useMemo(() => AssetRowShadow(colors), [colors]);

  const [amountDetails, setAmountDetails] = useState({
    assetAmount: '',
    isSufficientBalance: false,
    nativeAmount: '',
  });

  const sendUpdateAssetAmount = useCallback(
    newAssetAmount => {
      const _assetAmount = newAssetAmount.replace(/[^0-9.]/g, '');
      let _nativeAmount = '';
      if (_assetAmount.length) {
        const priceUnit = selected?.price?.value ?? 0;
        const {
          amount: convertedNativeAmount,
        } = convertAmountAndPriceToNativeDisplay(
          _assetAmount,
          priceUnit,
          nativeCurrency
        );
        _nativeAmount = formatInputDecimals(
          convertedNativeAmount,
          _assetAmount
        );
      }

      const _isSufficientBalance =
        Number(_assetAmount) <= Number(maxInputBalance);

      setAmountDetails({
        assetAmount: _assetAmount,
        isSufficientBalance: _isSufficientBalance,
        nativeAmount: _nativeAmount,
      });
    },
    [maxInputBalance, nativeCurrency, selected]
  );

  const sendUpdateSelected = useCallback(
    newSelected => {
      if (isEqual(newSelected, selected)) return;
      updateMaxInputBalance(newSelected);
      if (newSelected?.type === AssetTypes.nft) {
        setAmountDetails({
          assetAmount: '1',
          isSufficientBalance: true,
          nativeAmount: '0',
        });

        // Prevent a state update loop
        if (selected?.uniqueId !== newSelected?.uniqueId) {
          setSelected({
            ...newSelected,
            symbol: newSelected?.collection?.name,
          });
        }
      } else {
        setSelected(newSelected);
        sendUpdateAssetAmount('');
      }
    },
    [selected, sendUpdateAssetAmount, updateMaxInputBalance]
  );

  const navigateToSelectToken = useCallback(() => {
    navigate(Routes.SELECT_TOKEN_SHEET, { sendUpdateSelected });
  }, [navigate, sendUpdateSelected]);

  // Update all fields passed via params if needed
  useEffect(() => {
    if (assetOverride && assetOverride !== prevAssetOverride) {
      sendUpdateSelected(assetOverride);
      updateMaxInputBalance(assetOverride);
    }

    if (nativeAmountOverride && !amountDetails.assetAmount && maxInputBalance) {
      sendUpdateAssetAmount(nativeAmountOverride);
    }
  }, [
    amountDetails,
    assetOverride,
    maxInputBalance,
    nativeAmountOverride,
    prevAssetOverride,
    sendUpdateAssetAmount,
    sendUpdateSelected,
    updateMaxInputBalance,
  ]);

  useEffect(() => {
    if (isEmpty(selected)) return;
    if (currentProvider?._network?.chainId) {
      const currentProviderNetwork = ethereumUtils.getNetworkFromChainId(
        Number(currentProvider._network.chainId)
      );

      const assetNetwork = isL2Asset(selected?.type) ? selected.type : network;

      if (
        assetNetwork === currentNetwork &&
        currentProviderNetwork === currentNetwork
      ) {
        updateAssetOnchainBalanceIfNeeded(
          selected,
          accountAddress,
          currentNetwork,
          currentProvider,
          updatedAsset => {
            // set selected asset with new balance
            if (!isEqual(selected, updatedAsset)) {
              setSelected(updatedAsset);
              updateMaxInputBalance(updatedAsset);
              sendUpdateAssetAmount('');
            }
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, currentProvider, currentNetwork, selected]);

  const onChangeNativeAmount = useCallback(
    newNativeAmount => {
      if (!isString(newNativeAmount)) return;
      const _nativeAmount = newNativeAmount.replace(/[^0-9.]/g, '');
      let _assetAmount = '';
      if (_nativeAmount.length) {
        const priceUnit = selected?.price?.value ?? 0;
        const convertedAssetAmount = convertAmountFromNativeValue(
          _nativeAmount,
          priceUnit,
          selected.decimals
        );
        _assetAmount = formatInputDecimals(convertedAssetAmount, _nativeAmount);
      }

      const _isSufficientBalance =
        Number(_assetAmount) <= Number(maxInputBalance);
      setAmountDetails({
        assetAmount: _assetAmount,
        isSufficientBalance: _isSufficientBalance,
        nativeAmount: _nativeAmount,
      });
      analytics.track('Changed native currency input in Send flow');
    },
    [maxInputBalance, selected.decimals, selected?.price?.value]
  );

  const sendMaxBalance = useCallback(async () => {
    const newBalanceAmount = await updateMaxInputBalance(selected);
    sendUpdateAssetAmount(newBalanceAmount);
  }, [selected, sendUpdateAssetAmount, updateMaxInputBalance]);

  const onChangeAssetAmount = useCallback(
    newAssetAmount => {
      if (isString(newAssetAmount)) {
        sendUpdateAssetAmount(newAssetAmount);
        analytics.track('Changed token input in Send flow');
      }
    },
    [sendUpdateAssetAmount]
  );

  const updateTxFeeForOptimism = useCallback(
    async updatedGasLimit => {
      const txData = await buildTransaction(
        {
          address: accountAddress,
          amount: amountDetails.assetAmount,
          asset: selected,
          gasLimit: updatedGasLimit,
          recipient: toAddress,
        },
        currentProvider,
        currentNetwork
      );
      const l1GasFeeOptimism = await ethereumUtils.calculateL1FeeOptimism(
        txData,
        currentProvider
      );
      updateTxFee(updatedGasLimit, null, l1GasFeeOptimism);
    },
    [
      accountAddress,
      amountDetails.assetAmount,
      currentNetwork,
      currentProvider,
      selected,
      toAddress,
      updateTxFee,
    ]
  );

  const { action: transferENS } = useENSRegistrationActionHandler({
    step: 'TRANSFER',
  });

  const ensName = selected.uniqueId
    ? selected.uniqueId?.split(' ')?.[0]
    : selected.uniqueId;
  const ensProfile = useENSProfile(ensName, {
    enabled: isENS,
    supportedRecordsOnly: false,
  });

  const getNextNonce = useCurrentNonce(accountAddress, currentNetwork);

  const onSubmit = useCallback(
    async ({
      ens: { setAddress, transferControl, clearRecords } = {},
    } = {}) => {
      const wallet = await loadWallet(undefined, true, currentProvider);
      if (!wallet) return;

      const validTransaction =
        amountDetails.isSufficientBalance && isSufficientGas && isValidGas;
      if (!selectedGasFee?.gasFee?.estimatedFee || !validTransaction) {
        logger.sentry('preventing tx submit for one of the following reasons:');
        logger.sentry('selectedGasFee ? ', selectedGasFee);
        logger.sentry('selectedGasFee.maxFee ? ', selectedGasFee?.maxFee);
        logger.sentry('validTransaction ? ', validTransaction);
        logger.sentry('isValidGas ? ', isValidGas);
        captureEvent('Preventing tx submit');
        return false;
      }

      let submitSuccess = false;
      let updatedGasLimit = null;

      // Attempt to update gas limit before sending ERC20 / ERC721
      if (!isNativeAsset(selected.address, currentNetwork)) {
        try {
          // Estimate the tx with gas limit padding before sending
          updatedGasLimit = await estimateGasLimit(
            {
              address: accountAddress,
              amount: amountDetails.assetAmount,
              asset: selected,
              recipient: toAddress,
            },
            true,
            currentProvider,
            currentNetwork
          );

          if (!lessThan(updatedGasLimit, gasLimit)) {
            if (currentNetwork === Network.optimism) {
              updateTxFeeForOptimism(updatedGasLimit);
            } else {
              updateTxFee(updatedGasLimit, null);
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      let nextNonce;

      if (
        isENS &&
        toAddress &&
        (clearRecords || setAddress || transferControl)
      ) {
        const { nonce } = await transferENS(() => null, {
          clearRecords,
          name: ensName,
          records: {
            ...(ensProfile?.data?.contenthash
              ? { contenthash: ensProfile?.data?.contenthash }
              : {}),
            ...(ensProfile?.data?.records || {}),
            ...(ensProfile?.data?.coinAddresses || {}),
          },
          setAddress,
          toAddress,
          transferControl,
          wallet,
        });
        nextNonce = nonce + 1;
      }

      const gasLimitToUse =
        updatedGasLimit && !lessThan(updatedGasLimit, gasLimit)
          ? updatedGasLimit
          : gasLimit;

      const gasParams = parseGasParamsForTransaction(selectedGasFee);
      const txDetails = {
        amount: amountDetails.assetAmount,
        asset: selected,
        from: accountAddress,
        gasLimit: gasLimitToUse,
        network: currentNetwork,
        nonce: nextNonce ?? (await getNextNonce()),
        to: toAddress,
        ...gasParams,
      };

      try {
        const signableTransaction = await createSignableTransaction(txDetails);
        if (!signableTransaction.to) {
          logger.sentry('txDetails', txDetails);
          logger.sentry('signableTransaction', signableTransaction);
          logger.sentry('"to" field is missing!');
          const e = new Error('Transaction missing TO field');
          captureException(e);
          Alert.alert(lang.t('wallet.transaction.alert.invalid_transaction'));
          submitSuccess = false;
        } else {
          const { result: txResult, error } = await sendTransaction({
            existingWallet: wallet,
            provider: currentProvider,
            transaction: signableTransaction,
          });

          if (error) {
            throw new Error(`SendSheet sendTransaction failed`);
          }

          const { hash, nonce } = txResult;
          const { data, value } = signableTransaction;
          if (!isEmpty(hash)) {
            submitSuccess = true;
            txDetails.hash = hash;
            txDetails.nonce = nonce;
            txDetails.network = currentNetwork;
            txDetails.data = data;
            txDetails.value = value;
            txDetails.txTo = signableTransaction.to;
            await dispatch(
              dataAddNewTransaction(txDetails, null, false, currentProvider)
            );
          }
        }
      } catch (error) {
        submitSuccess = false;
        logger.sentry('TX Details', txDetails);
        logger.sentry('SendSheet onSubmit error');
        logger.sentry(error);
        captureException(error);
      }
      return submitSuccess;
    },
    [
      accountAddress,
      amountDetails.assetAmount,
      amountDetails.isSufficientBalance,
      currentNetwork,
      currentProvider,
      dataAddNewTransaction,
      dispatch,
      ensName,
      ensProfile?.data?.coinAddresses,
      ensProfile?.data?.contenthash,
      ensProfile?.data?.records,
      gasLimit,
      getNextNonce,
      isENS,
      isSufficientGas,
      isValidGas,
      selected,
      selectedGasFee,
      toAddress,
      transferENS,
      updateTxFee,
      updateTxFeeForOptimism,
    ]
  );

  const submitTransaction = useCallback(
    async (...args) => {
      if (Number(amountDetails.assetAmount) <= 0) {
        logger.sentry(
          'amountDetails.assetAmount ? ',
          amountDetails?.assetAmount
        );
        captureEvent('Preventing tx submit due to amount <= 0');
        return false;
      }
      const submitSuccessful = await onSubmit(...args);

      if (submitSuccessful) {
        goBack();
        navigate(Routes.SEND_RESULT);
        // InteractionManager.runAfterInteractions(() => {
        //   navigate(Routes.PROFILE_SCREEN);
        // });
      }
    },
    [amountDetails.assetAmount, goBack, navigate, onSubmit]
  );

  const { buttonDisabled, buttonLabel } = useMemo(() => {
    const isZeroAssetAmount = Number(amountDetails.assetAmount) <= 0;

    let disabled = true;
    let label = lang.t('button.confirm_exchange.enter_amount');

    if (isENS && !ensProfile.isSuccess) {
      label = lang.t('button.confirm_exchange.loading');
      disabled = true;
    } else if (
      isEmpty(gasFeeParamsBySpeed) ||
      !selectedGasFee ||
      isEmpty(selectedGasFee?.gasFee) ||
      !toAddress
    ) {
      label = lang.t('button.confirm_exchange.loading');
      disabled = true;
    } else if (!isZeroAssetAmount && !isSufficientGas) {
      disabled = true;
      if (currentNetwork === Network.polygon) {
        label = lang.t('button.confirm_exchange.insufficient_matic');
      } else if (currentNetwork === Network.bsc) {
        label = lang.t('button.confirm_exchange.insufficient_bnb');
      } else {
        label = lang.t('button.confirm_exchange.insufficient_eth');
      }
    } else if (!isValidGas) {
      disabled = true;
      label = lang.t('button.confirm_exchange.invalid_fee');
    } else if (!isZeroAssetAmount && !amountDetails.isSufficientBalance) {
      disabled = true;
      label = lang.t('button.confirm_exchange.insufficient_funds');
    } else if (!isZeroAssetAmount) {
      disabled = false;
      label = `􀕹 ${lang.t('button.confirm_exchange.review')}`;
    }

    return { buttonDisabled: disabled, buttonLabel: label };
  }, [
    amountDetails.assetAmount,
    amountDetails.isSufficientBalance,
    currentNetwork,
    isENS,
    ensProfile.isSuccess,
    gasFeeParamsBySpeed,
    selectedGasFee,
    isSufficientGas,
    isValidGas,
    toAddress,
  ]);

  const isL2 = useMemo(() => {
    return isL2Network(currentNetwork);
  }, [currentNetwork]);

  const validateRecipient = useCallback(
    async toAddress => {
      // Don't allow send to known ERC20 contracts on mainnet
      if (rainbowTokenList.RAINBOW_TOKEN_LIST[toAddress.toLowerCase()]) {
        return false;
      }

      // Don't allow sending funds directly to known ERC20 contracts on L2
      if (isL2) {
        const currentChainAssets = chainAssets[currentNetwork];
        const found =
          currentChainAssets &&
          currentChainAssets.find(
            item =>
              item.asset?.asset_code?.toLowerCase() === toAddress.toLowerCase()
          );
        if (found) {
          return false;
        }
      }
      return true;
    },
    [currentNetwork, isL2]
  );
  const recipientFieldRef = useRef();
  const profilesEnabled = useExperimentalFlag(PROFILES);

  const showConfirmationSheet = useCallback(async () => {
    if (buttonDisabled) return;
    let toAddress = recipient;
    const isValid = await checkIsValidAddressOrDomain(recipient);
    if (isValid) {
      toAddress = await resolveNameOrAddress(recipient);
    }
    const validRecipient = await validateRecipient(toAddress);
    assetInputRef?.current?.blur();
    nativeCurrencyInputRef?.current?.blur();
    if (!validRecipient) {
      navigate(Routes.EXPLAIN_SHEET, {
        onClose: () => {
          // Nasty workaround to take control over useMagicAutofocus :S
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              recipientFieldRef?.current?.focus();
            }, 210);
          });
        },
        type: 'sending_funds_to_contract',
      });
      return;
    }
    const uniqueTokenType = getUniqueTokenType(selected);
    const isENS = uniqueTokenType === 'ENS';
    const checkboxes = getDefaultCheckboxes({
      ensProfile,
      isENS: true,
      network,
      toAddress: recipient,
    });
    navigate(Routes.SEND_CONFIRMATION_SHEET, {
      amountDetails: amountDetails,
      asset: selected,
      callback: submitTransaction,
      checkboxes,
      ensProfile,
      isENS,
      isL2,
      isNft,
      network: currentNetwork,
      profilesEnabled,
      to: recipient,
      toAddress,
    });
  }, [
    amountDetails,
    assetInputRef,
    buttonDisabled,
    currentNetwork,
    ensProfile,
    isL2,
    isNft,
    nativeCurrencyInputRef,
    navigate,
    network,
    profilesEnabled,
    recipient,
    selected,
    submitTransaction,
    validateRecipient,
  ]);

  const onResetAssetSelection = useCallback(() => {
    analytics.track('Reset asset selection in Send flow');
    sendUpdateSelected({});
  }, [sendUpdateSelected]);

  useEffect(() => {
    if (!currentProvider?._network?.chainId) return;
    const currentProviderNetwork = ethereumUtils.getNetworkFromChainId(
      Number(currentProvider._network.chainId)
    );
    const assetNetwork = isL2Asset(selected?.type) ? selected.type : network;
    if (
      assetNetwork === currentNetwork &&
      currentProviderNetwork === currentNetwork &&
      !isEmpty(selected)
    ) {
      estimateGasLimit(
        {
          address: accountAddress,
          amount: amountDetails.assetAmount,
          asset: selected,
          recipient: toAddress,
        },
        false,
        currentProvider,
        currentNetwork
      )
        .then(async gasLimit => {
          if (currentNetwork === Network.optimism) {
            updateTxFeeForOptimism(gasLimit);
          } else {
            updateTxFee(gasLimit, null);
          }
        })
        .catch(e => {
          logger.sentry('Error calculating gas limit', e);
          updateTxFee(null, null);
        });
    }
  }, [
    accountAddress,
    amountDetails.assetAmount,
    currentNetwork,
    currentProvider,
    recipient,
    selected,
    toAddress,
    updateTxFee,
    updateTxFeeForOptimism,
    network,
  ]);

  useEffect(() => {
    // We can start fetching gas prices
    // after we know the network that the asset
    // belongs to
    if (prevNetwork !== currentNetwork) {
      InteractionManager.runAfterInteractions(() => {
        startPollingGasFees(currentNetwork);
      });
    }
  }, [prevNetwork, startPollingGasFees, selected.type, currentNetwork]);

  // Stop polling when the sheet is unmounted
  useEffect(() => {
    return () => {
      InteractionManager.runAfterInteractions(() => {
        stopPollingGasFees();
      });
    };
  }, [stopPollingGasFees]);

  // Recalculate balance when gas price changes
  useEffect(() => {
    if (
      selected?.isNativeAsset &&
      (prevSelectedGasFee?.gasFee?.estimatedFee?.value?.amount ?? 0) !==
        (selectedGasFee?.gasFee?.estimatedFee?.value?.amount ?? 0)
    ) {
      updateMaxInputBalance(selected);
    }
  }, [prevSelectedGasFee, selected, selectedGasFee, updateMaxInputBalance]);

  useEffect(() => {
    const updateNetworkAndProvider = async () => {
      const assetNetwork = ethereumUtils.getNetworkFromType(selected.type);
      if (
        selected?.type &&
        (assetNetwork !== currentNetwork ||
          !currentNetwork ||
          prevNetwork !== currentNetwork)
      ) {
        let provider = web3Provider;
        switch (selected.type) {
          case AssetTypes.polygon:
            setCurrentNetwork(Network.polygon);
            provider = await getProviderForNetwork(Network.polygon);
            break;
          case AssetTypes.bsc:
            setCurrentNetwork(Network.bsc);
            provider = await getProviderForNetwork(Network.bsc);
            break;
          case AssetTypes.arbitrum:
            setCurrentNetwork(Network.arbitrum);
            provider = await getProviderForNetwork(Network.arbitrum);
            break;
          case AssetTypes.optimism:
            setCurrentNetwork(Network.optimism);
            provider = await getProviderForNetwork(Network.optimism);
            break;
          default:
            setCurrentNetwork(network);
        }
        setCurrentProvider(provider);
      }
    };
    updateNetworkAndProvider();
  }, [currentNetwork, network, prevNetwork, selected.type, sendUpdateSelected]);

  const onPressAddress = () => {
    goBack();
  };

  return (
    <Container>
      <SheetHandleFixedToTop />
      {isTinyPhone ? null : (
        <SendSheetTitle>{lang.t('contacts.send_header')}</SendSheetTitle>
      )}
      {/* <ButtonPressAnimation
        onPress={onResetAssetSelection}
        overflowMargin={30}
        scaleTo={0.925}
      >
        <ShadowStack
          alignSelf="center"
          backgroundColor={colors.white}
          borderRadius={20}
          height={SendCoinRow.selectedHeight}
          overflow={isTinyPhone ? 'visible' : 'hidden'}
          shadows={isTinyPhone ? noShadows : shadows}
          width={deviceWidth - 38}
        >
          {isTinyPhone ? null : <AssetRowGradient />}
          <AssetRowElement
            badgeYPosition={5}
            disablePressAnimation
            item={selected}
            selected
            showNativeValue={showNativeValue}
            testID="send-asset-form"
          >
            <Text
              align="center"
              color={colorForAsset || colors.dark}
              size="large"
              weight="heavy"
            >
              􀁴
            </Text>
          </AssetRowElement>
        </ShadowStack>
      </ButtonPressAnimation> */}
      <TouchableOpacity
        style={styles.addressContainer}
        onPress={onPressAddress}
      >
        <View style={styles.toContainer}>
          <Text style={styles.toHeader}>{lang.t('contacts.to_header')}: </Text>
          <Text style={styles.address}>
            {abbreviations.address(toAddress, 4, 6)}
          </Text>
        </View>
        <Icon name="arrowRight" />
      </TouchableOpacity>
      <FormContainer isNft={isNft}>
        {isNft ? (
          <SendAssetFormCollectible
            asset={selected}
            buttonRenderer={buttonRenderer}
            txSpeedRenderer={txSpeedRenderer}
          />
        ) : (
          <Fragment>
            <SendAssetFormToken
              {...props}
              assetAmount={amountDetails.assetAmount}
              assetInputRef={assetInputRef}
              buttonRenderer={buttonRenderer}
              colorForAsset={colorForAsset}
              nativeAmount={amountDetails.nativeAmount}
              nativeCurrency={nativeCurrency}
              nativeCurrencyInputRef={nativeCurrencyInputRef}
              onChangeAssetAmount={onChangeAssetAmount}
              onChangeNativeAmount={onChangeNativeAmount}
              onFocusAssetInput={onFocusAssetInput}
              onFocusNativeInput={onFocusNativeInput}
              selected={selected}
              sendMaxBalance={sendMaxBalance}
              txSpeedRenderer={txSpeedRenderer}
              network={network}
              buttonDisabled={buttonDisabled}
              onPressTokenSelection={navigateToSelectToken}
              onPressSendButton={showConfirmationSheet}
            />
            <KeyboardArea initialHeight={keyboardHeight} isOpen />
          </Fragment>
        )}
      </FormContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lighterGrey,
    height: 56,
    marginHorizontal: 32,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
  },
  toContainer: {
    flexDirection: 'row',
  },
  toHeader: {
    fontSize: fonts.size.medium,
    color: colors.black50,
  },
  address: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
  },
});
