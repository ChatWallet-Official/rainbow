import { AddressZero } from '@ethersproject/constants';
import { useRoute } from '@react-navigation/native';
import { toChecksumAddress } from 'ethereumjs-util';
import lang from 'i18n-js';
import { capitalize, isEmpty } from 'lodash';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Keyboard, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button } from '@/components/buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContactRowInfoButton from '../components/ContactRowInfoButton';
import Divider from '../components/Divider';
import L2Disclaimer from '../components/L2Disclaimer';
import Pill from '../components/Pill';
import TouchableBackdrop from '../components/TouchableBackdrop';
import ButtonPressAnimation from '../components/animations/ButtonPressAnimation';
import Callout from '../components/callout/Callout';
import { CoinIcon } from '../components/coin-icon';
import RequestVendorLogoIcon from '../components/coin-icon/RequestVendorLogoIcon';
import { ContactAvatar } from '../components/contacts';
import ImageAvatar from '../components/contacts/ImageAvatar';
import CheckboxField from '../components/fields/CheckboxField';
import { GasSpeedButton } from '../components/gas';
import ENSCircleIcon from '../components/icons/svg/ENSCircleIcon';
import { Centered, Column, Row } from '../components/layout';
import { SendButton } from '../components/send';
import { SheetTitle, SlackSheet } from '../components/sheet';
import { Text as OldText } from '../components/text';
import { ENSProfile } from '../entities/ens';
import abbreviations, { address } from '../utils/abbreviations';
import {
  addressHashedColorIndex,
  addressHashedEmoji,
} from '../utils/profileUtils';
import useExperimentalFlag, { PROFILES } from '@/config/experimentalHooks';
import { Box, Heading, Inset, Stack, Text } from '@/design-system';
import { AssetTypes } from '@/entities';
import {
  estimateENSReclaimGasLimit,
  estimateENSSetAddressGasLimit,
  estimateENSSetRecordsGasLimit,
  formatRecordsForTransaction,
} from '@/handlers/ens';
import svgToPngIfNeeded from '@/handlers/svgs';
import { estimateGasLimit } from '@/handlers/web3';
import {
  removeFirstEmojiFromString,
  returnStringFirstEmoji,
} from '@/helpers/emojiHandler';
import { add, convertAmountToNativeDisplay } from '@/helpers/utilities';
import { isENSAddressFormat, isValidDomainFormat } from '@/helpers/validators';
import {
  useAccountSettings,
  useAccountTransactions,
  useColorForAsset,
  useContacts,
  useDimensions,
  useENSAvatar,
  useGas,
  useUserAccounts,
  useWallets,
} from '@/hooks';
import { useNavigation } from '@/navigation';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { position, fonts, colors } from '@/styles';
import { useTheme } from '@/theme';
import { deviceUtils, getUniqueTokenType, promiseUtils } from '@/utils';
import logger from '@/utils/logger';

const Container = styled(Centered).attrs({
  direction: 'column',
})(({ deviceHeight, height }: { deviceHeight: number; height: number }) => ({
  ...(height && { height: height + deviceHeight }),
  ...position.coverAsObject,
}));

const SendButtonWrapper = styled(Column).attrs({
  align: 'center',
})({
  height: 56,
});

export type Checkbox = {
  checked: boolean;
  id:
    | 'clear-records'
    | 'set-address'
    | 'transfer-control'
    | 'not-sending-to-exchange'
    | 'has-wallet-that-supports';
  label: string;
};

const hasClearProfileInfo = (ensProfile?: ENSProfile) =>
  isEmpty({
    ...ensProfile?.data?.records,
    ...ensProfile?.data?.coinAddresses,
  }) && !ensProfile?.data?.contenthash;
const doesNamePointToRecipient = (
  ensProfile?: ENSProfile,
  recipientAddress?: string
) =>
  ensProfile?.data?.address?.toLowerCase() === recipientAddress?.toLowerCase();
const isRegistrant = (ensProfile?: ENSProfile) => ensProfile?.isRegistrant;

const gasOffset = 120;
const checkboxOffset = 44;

export function getDefaultCheckboxes({
  isENS,
  ensProfile,
  network,
  toAddress,
}: {
  isENS: boolean;
  ensProfile: ENSProfile;
  network: string;
  toAddress: string;
}): Checkbox[] {
  if (isENS) {
    return [
      !hasClearProfileInfo(ensProfile) &&
        ensProfile?.isOwner && {
          checked: false,
          id: 'clear-records',
          label: lang.t(
            'wallet.transaction.checkboxes.clear_profile_information'
          ),
        },
      !doesNamePointToRecipient(ensProfile, toAddress) &&
        ensProfile?.isOwner && {
          checked: false,
          id: 'set-address',
          label: lang.t(
            'wallet.transaction.checkboxes.point_name_to_recipient'
          ),
        },
      isRegistrant(ensProfile) &&
        ensProfile?.data?.owner?.address?.toLowerCase() !==
          toAddress.toLowerCase() && {
          checked: false,
          id: 'transfer-control',
          label: lang.t('wallet.transaction.checkboxes.transfer_control'),
        },
    ].filter(Boolean) as Checkbox[];
  }
  return [
    {
      checked: false,
      id: 'not-sending-to-exchange',
      label: lang.t(
        'wallet.transaction.checkboxes.im_not_sending_to_an_exchange'
      ),
    },
    {
      checked: false,
      id: 'has-wallet-that-supports',
      label: lang.t(
        'wallet.transaction.checkboxes.has_a_wallet_that_supports',
        {
          networkName: capitalize(network),
        }
      ),
    },
  ];
}

export function getSheetHeight({
  shouldShowChecks,
  isL2,
  isENS,
  checkboxes,
}: {
  shouldShowChecks: boolean;
  isL2: boolean;
  isENS: boolean;
  checkboxes: Checkbox[];
}) {
  let height = android ? 400 : 377;
  if (isL2) height = height + 70;
  if (shouldShowChecks) height = height + 80;
  if (isENS) {
    height = height + gasOffset + 20;
    height = height + checkboxes?.length * checkboxOffset || 0;
  }
  return height;
}

const ChevronDown = () => {
  const { colors } = useTheme();
  return (
    <Column
      align="center"
      height={ios ? 34.5 : 30}
      marginTop={android ? -14 : 0}
      position="absolute"
      width={50}
    >
      <OldText
        align="center"
        color={colors.alpha(colors.blueGreyDark, 0.15)}
        letterSpacing="zero"
        size="larger"
        weight="semibold"
      >
        􀆈
      </OldText>
      <OldText
        align="center"
        color={colors.alpha(colors.blueGreyDark, 0.09)}
        letterSpacing="zero"
        size="larger"
        style={{ top: -13 }}
        weight="semibold"
      >
        􀆈
      </OldText>
    </Column>
  );
};

export default function SendConfirmationSheet() {
  const { colors, isDarkMode } = useTheme();
  const { accountAddress, nativeCurrency } = useAccountSettings();
  const { goBack, navigate, setParams } = useNavigation();
  const {
    height: deviceHeight,
    isSmallPhone,
    isTinyPhone,
    width: deviceWidth,
  } = useDimensions();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const insets = useSafeAreaInsets();
  const { contacts } = useContacts();
  const profilesEnabled = useExperimentalFlag(PROFILES);

  useEffect(() => {
    android && Keyboard.dismiss();
  }, []);

  const {
    params: {
      amountDetails,
      asset,
      callback,
      ensProfile,
      isL2,
      isNft,
      network,
      to,
      toAddress,
    },
  } = useRoute<any>();

  const [
    alreadySentTransactionsTotal,
    setAlreadySentTransactionsTotal,
  ] = useState(0);
  const [
    alreadySentTransactionsCurrentNetwork,
    setAlreadySentTransactionsCurrentNetwork,
  ] = useState(0);

  const { transactions } = useAccountTransactions(true, true);
  const { userAccounts, watchedAccounts } = useUserAccounts();
  const { walletNames } = useWallets();
  const isSendingToUserAccount = useMemo(() => {
    // @ts-expect-error From JavaScript hook
    const found = userAccounts?.find(account => {
      return account.address.toLowerCase() === toAddress?.toLowerCase();
    });
    return !!found;
  }, [toAddress, userAccounts]);

  const { isSufficientGas, isValidGas, updateTxFee } = useGas();

  useEffect(() => {
    if (!isSendingToUserAccount) {
      let sends = 0;
      let sendsCurrentNetwork = 0;
      transactions.forEach(tx => {
        if (tx.to?.toLowerCase() === toAddress?.toLowerCase()) {
          sends++;
          if (tx.network === network) {
            sendsCurrentNetwork++;
          }
        }
      });
      if (sends > 0) {
        setAlreadySentTransactionsTotal(sends);
        if (sendsCurrentNetwork > 0) {
          setAlreadySentTransactionsCurrentNetwork(sendsCurrentNetwork);
        }
      }
    }
  }, [isSendingToUserAccount, network, toAddress, transactions]);

  const contact = useMemo(() => {
    return contacts?.[toAddress?.toLowerCase()];
  }, [contacts, toAddress]);

  const uniqueTokenType = getUniqueTokenType(asset);
  const isENS = uniqueTokenType === 'ENS' && profilesEnabled;

  const [checkboxes, setCheckboxes] = useState<Checkbox[]>(
    getDefaultCheckboxes({ ensProfile, isENS, network, toAddress })
  );

  useEffect(() => {
    if (isENS) {
      const promises = [
        estimateGasLimit(
          {
            address: accountAddress,
            amount: 0,
            asset: asset,
            recipient: toAddress,
          },
          true
        ),
      ];
      const sendENSOptions = Object.fromEntries(
        checkboxes.map(option => [option.id, option.checked])
      ) as {
        [key in Checkbox['id']]: Checkbox['checked'];
      };
      const cleanENSName = asset?.name?.split(' ')?.[0] ?? asset?.name;

      if (sendENSOptions['clear-records']) {
        let records = Object.keys({
          ...(ensProfile?.data?.contenthash
            ? { contenthash: ensProfile?.data?.contenthash }
            : {}),
          ...(ensProfile?.data?.coinAddresses ?? {}),
          ...(ensProfile?.data?.records ?? {}),
        }).reduce((records, recordKey) => {
          return {
            ...records,
            [recordKey]: '',
          };
        }, {});
        if (sendENSOptions['set-address']) {
          records = { ...records, ETH: toAddress };
        } else {
          records = { ...records, ETH: AddressZero };
        }
        promises.push(
          estimateENSSetRecordsGasLimit({
            name: cleanENSName,
            ownerAddress: accountAddress,
            records,
          })
        );
      } else if (sendENSOptions['set-address']) {
        promises.push(
          estimateENSSetAddressGasLimit({
            name: cleanENSName,
            ownerAddress: accountAddress,
            records: formatRecordsForTransaction({ ETH: toAddress }),
          })
        );
      }
      if (sendENSOptions['transfer-control']) {
        promises.push(
          estimateENSReclaimGasLimit({
            name: cleanENSName,
            ownerAddress: accountAddress,
            toAddress,
          })
        );
      }
      promiseUtils
        .PromiseAllWithFails(promises)
        .then(gasLimits => {
          const gasLimit = gasLimits.reduce(add, 0);
          updateTxFee(gasLimit, null);
        })
        .catch(e => {
          logger.sentry('Error calculating gas limit', e);
          updateTxFee(null, null);
        });
    }
  }, [
    accountAddress,
    asset,
    checkboxes,
    ensProfile?.data?.coinAddresses,
    ensProfile?.data?.contenthash,
    ensProfile?.data?.records,
    isENS,
    toAddress,
    updateTxFee,
  ]);

  const handleCheckbox = useCallback(
    checkbox => {
      const newCheckboxesState = [...checkboxes];
      newCheckboxesState[checkbox.index] = checkbox;
      setCheckboxes(newCheckboxesState);
    },
    [checkboxes]
  );

  const handleENSConfigurationPress = useCallback(() => {
    navigate(Routes.EXPLAIN_SHEET, {
      type: 'ens_configuration',
    });
  }, [navigate]);

  const handleL2DisclaimerPress = useCallback(() => {
    navigate(Routes.EXPLAIN_SHEET, {
      type: asset.type,
    });
  }, [asset.type, navigate]);

  const nativeDisplayAmount = useMemo(
    () =>
      convertAmountToNativeDisplay(amountDetails.nativeAmount, nativeCurrency),
    [amountDetails.nativeAmount, nativeCurrency]
  );

  let color = useColorForAsset({
    address: asset.mainnet_address || asset.address,
    type: asset?.mainnet_address ? AssetTypes.token : asset?.type,
  });

  if (isNft) {
    color = colors.appleBlue;
  }

  const shouldShowChecks =
    isL2 &&
    !isSendingToUserAccount &&
    alreadySentTransactionsCurrentNetwork < 3;

  useEffect(() => {
    setParams({ shouldShowChecks });
  }, [setParams, shouldShowChecks]);

  const canSubmit =
    isSufficientGas &&
    isValidGas &&
    (!shouldShowChecks ||
      checkboxes.filter(check => check.checked === false).length === 0);

  const insufficientEth = isSufficientGas === false && isValidGas;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    try {
      setIsAuthorizing(true);
      if (isENS) {
        const clearRecords = checkboxes.some(
          ({ checked, id }) => checked && id === 'clear-records'
        );
        const setAddress = checkboxes.some(
          ({ checked, id }) => checked && id === 'set-address'
        );
        const transferControl = checkboxes.some(
          ({ checked, id }) => checked && id === 'transfer-control'
        );
        await callback({
          ens: { clearRecords, setAddress, transferControl },
        });
      } else {
        await callback();
      }
    } catch (e) {
      logger.sentry('TX submit failed', e);
      setIsAuthorizing(false);
    }
  }, [callback, canSubmit, checkboxes, isENS]);

  const existingAccount = useMemo(() => {
    let existingAcct = null;
    if (toAddress) {
      const allAccounts = [...userAccounts, ...watchedAccounts].filter(
        acct => acct.visible
      );
      for (const account of allAccounts) {
        if (
          toChecksumAddress(account.address) === toChecksumAddress(toAddress)
        ) {
          existingAcct = account;
          break;
        }
      }
    }
    return existingAcct;
  }, [toAddress, userAccounts, watchedAccounts]);

  const avatarName =
    removeFirstEmojiFromString(existingAccount?.label || contact?.nickname) ||
    (isValidDomainFormat(to)
      ? to
      : walletNames?.[to]
      ? walletNames[to]
      : address(to, 4, 6));

  const avatarValue =
    returnStringFirstEmoji(existingAccount?.label) ||
    addressHashedEmoji(toAddress);

  const avatarColor =
    existingAccount?.color ||
    contact?.color ||
    addressHashedColorIndex(toAddress);

  const { data: avatar } = useENSAvatar(to, {
    enabled: isENSAddressFormat(to),
  });

  const accountImage = profilesEnabled
    ? avatar?.imageUrl || existingAccount?.image
    : existingAccount?.image;

  const imageUrl = svgToPngIfNeeded(
    asset.image_thumbnail_url || asset.image_url,
    true
  );

  const contentHeight = getSheetHeight({
    checkboxes,
    isENS,
    isL2,
    shouldShowChecks,
  });

  return (
    <Container
      deviceHeight={deviceHeight}
      height={contentHeight}
      insets={insets}
    >
      {ios && <TouchableBackdrop onPress={goBack} />}

      {/* @ts-expect-error JavaScript component */}
      <SlackSheet
        additionalTopPadding={android}
        contentHeight={contentHeight}
        scrollEnabled={false}
      >
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <OldText style={styles.title}>
              {lang.t('wallet.transaction.sending_to_title')}
            </OldText>
            <ContactAvatar color={colors.greenCW} size="medium" value={'👦'} />
          </View>
          <OldText style={styles.address}>
            {abbreviations.address(toAddress, 4, 6)}
          </OldText>
          <OldText
            style={styles.asset}
          >{`${amountDetails.assetAmount} ${asset.symbol}`}</OldText>
          <OldText style={styles.native}>
            Amount Sending {nativeDisplayAmount}
          </OldText>
          <View style={styles.buttonContainer}>
            <Button backgroundColor="clear" onPress={handleSubmit}>
              <OldText align="center" style={styles.confirm}>
                {lang.t('button.confirm')}
              </OldText>
            </Button>
          </View>
          <TouchableOpacity onPress={goBack}>
            <OldText align="center" style={styles.cancel}>
              {lang.t('button.cancel')}
            </OldText>
          </TouchableOpacity>
        </View>
      </SlackSheet>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.big,
    marginRight: 8,
  },
  address: {
    marginTop: 10,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
  },
  asset: {
    fontSize: fonts.size.h1,
    fontWeight: fonts.weight.bold,
    marginTop: 32,
  },
  native: {
    fontSize: fonts.size.bmedium,
    fontWeight: fonts.weight.medium,
    color: colors.black50,
  },
  buttonContainer: {
    backgroundColor: colors.black,
    borderRadius: 16,
    marginTop: 64,
    marginBottom: 18,
    width: deviceUtils.dimensions.width - 64,
  },
  confirm: {
    fontWeight: fonts.weight.medium,
    fontSize: fonts.size.bmedium,
    color: colors.white,
  },
  cancel: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium,
  },
});
