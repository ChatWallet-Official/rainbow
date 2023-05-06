import React, { useState, useCallback } from 'react';
import styled from '@/styled-thing';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { IS_ANDROID, IS_IOS } from '@/env';
import { safeAreaInsetValues, deviceUtils } from '@/utils';
import { Column } from '@/components/layout';
import { borders, colors } from '@/styles';
import {
  SheetActionButton,
  SheetHandleFixedToTop,
  SheetTitle,
} from '@/components/sheet';
import lang from 'i18n-js';
import BuyAssetFormField from './BuyAssetFormField';
import {
  useAccountSettings,
  useDimensions,
  useKeyboardHeight,
  useSendSheetInputRefs,
} from '@/hooks';
import { Icon } from '@/components/icons';
import { KeyboardArea } from 'react-native-keyboard-area';
import font from '@/styles/fonts';
import { isString } from 'lodash';
import {
  convertAmountAndPriceToNativeDisplay,
  convertAmountFromNativeValue,
  formatInputDecimals,
} from '@/helpers/utilities';
import { useNavigation } from '@/navigation/Navigation';
import Routes from '@/navigation/routesNames';

const sheetHeight = deviceUtils.dimensions.height - (IS_ANDROID ? 30 : 10);
const statusBarHeight = IS_IOS
  ? safeAreaInsetValues.top
  : StatusBar.currentHeight;

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

const BuySheetTitle = styled(SheetTitle).attrs({
  weight: 'heavy',
})({
  marginBottom: android ? -10 : 32,
  marginTop: android ? 10 : 17,
});

const FormContainer = styled(Column).attrs({
  align: 'center',
  justify: 'start',
})({
  flex: 1,
  minHeight: ({ isSmallPhone, isTinyPhone }) =>
    isTinyPhone ? 104 : android || isSmallPhone ? 134 : 167,
  width: '100%',
});

export default function BuyScreen() {
  const { isSmallPhone, isTinyPhone } = useDimensions();
  const keyboardHeight = useKeyboardHeight();
  const { nativeCurrency } = useAccountSettings();
  const { goBack, navigate } = useNavigation();

  const [selected, setSelected] = useState({
    price: {
      value: 1827.97,
    },
    decimals: 6,
  });

  const [showNativeValue, setShowNativeValue] = useState(true);

  const {
    nativeCurrencyInputRef,
    setLastFocusedInputHandle,
    assetInputRef,
  } = useSendSheetInputRefs();

  const [amountDetails, setAmountDetails] = useState({
    assetAmount: '',
    nativeAmount: '',
  });

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

      setAmountDetails({
        assetAmount: _assetAmount,
        nativeAmount: _nativeAmount,
      });
    },
    [selected.decimals, selected?.price?.value]
  );

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

      setAmountDetails({
        assetAmount: _assetAmount,
        nativeAmount: _nativeAmount,
      });
    },
    [nativeCurrency, selected?.price?.value]
  );

  const onChangeAssetAmount = useCallback(
    newAssetAmount => {
      if (isString(newAssetAmount)) {
        sendUpdateAssetAmount(newAssetAmount);
      }
    },
    [sendUpdateAssetAmount]
  );

  const showPayOptionsSheet = useCallback(async () => {
    navigate(Routes.PAY_OPTIONS_SHEET);
  }, [navigate]);

  const onFocusAssetInput = useCallback(() => {
    setLastFocusedInputHandle(assetInputRef);
    setShowNativeValue(false);
  }, [assetInputRef, setLastFocusedInputHandle]);

  const onFocusNativeInput = useCallback(() => {
    setLastFocusedInputHandle(nativeCurrencyInputRef);
    setShowNativeValue(true);
  }, [nativeCurrencyInputRef, setLastFocusedInputHandle]);

  return (
    <Container>
      <SheetContainer>
        <View style={styles.container}>
          <SheetHandleFixedToTop showBlur={false} />
          <BuySheetTitle>{lang.t('contacts.buy_header')}</BuySheetTitle>
          <FormContainer isSmallPhone={isSmallPhone} isTinyPhone={isTinyPhone}>
            <BuyAssetFormField
              autoFocus
              label="USD"
              placeholder="0"
              onChange={onChangeNativeAmount}
              onFocus={onFocusNativeInput}
              value={amountDetails.nativeAmount}
              ref={nativeCurrencyInputRef}
            />

            <View style={styles.iconContainer}>
              <Icon name="mintBuyForIcon" height={30} />
            </View>

            <BuyAssetFormField
              autoFocus
              label="ETH"
              placeholder="0"
              onChange={onChangeAssetAmount}
              onFocus={onFocusAssetInput}
              value={amountDetails.assetAmount}
              ref={assetInputRef}
            />

            <Text style={styles.rate}>
              1 ETH for USD {selected.price.value}
            </Text>

            <SheetActionButton
              color={colors.mintGreen}
              isTransparent={true}
              label="Review"
              onPress={showPayOptionsSheet}
            />

            <KeyboardArea initialHeight={keyboardHeight} isOpen />
          </FormContainer>
        </View>
      </SheetContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginVertical: 10,
  },
  rate: {
    color: colors.mintBlack30,
    fontSize: font.size.smaller,
    marginTop: 15,
    marginBottom: 110,
    width: '100%',
  },
});
