import React, { Fragment } from 'react';
import { getSoftMenuBarHeight } from 'react-native-extra-dimensions-android';
import { Column } from '../layout';
import SendAssetFormField from './SendAssetFormField';
import { useDimensions } from '@/hooks';
import { supportedNativeCurrencies } from '@/references';
import styled from '@/styled-thing';
import { removeLeadingZeros } from '@/utils';
import MintAssetFormField from '@/screens/BuyScreen/MintAssetFormField';
import { Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/styles';

const footerMargin = getSoftMenuBarHeight() / 2;
const FooterContainer = styled(Column).attrs({
  justify: 'end',
  marginBottom: android ? footerMargin : 0,
})({
  width: '100%',
  zIndex: 3,
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

const Spacer = styled.View({
  height: ({ isSmallPhone, isTinyPhone }) =>
    isTinyPhone ? 8 : isSmallPhone ? 12 : 15,
  width: '100%',
});

export default function SendAssetFormToken({
  assetAmount,
  assetInputRef,
  buttonRenderer,
  colorForAsset,
  nativeAmount,
  nativeCurrency,
  nativeCurrencyInputRef,
  onChangeAssetAmount,
  onChangeNativeAmount,
  onFocusAssetInput,
  onFocusNativeInput,
  selected,
  sendMaxBalance,
  txSpeedRenderer,
  onPressSelectAsset,
  ...props
}) {
  const { isSmallPhone, isTinyPhone } = useDimensions();
  const { colors } = useTheme();

  const {
    mask: nativeMask,
    placeholder: nativePlaceholder,
  } = supportedNativeCurrencies[nativeCurrency];

  return (
    <Fragment>
      <FormContainer
        isSmallPhone={isSmallPhone}
        isTinyPhone={isTinyPhone}
        {...props}
      >
        <MintAssetFormField
          colorForAsset={colorForAsset}
          format={removeLeadingZeros}
          symbol="mintCoinETHIcon"
          label={selected.symbol}
          onChange={onChangeAssetAmount}
          onFocus={onFocusAssetInput}
          onPressButton={sendMaxBalance}
          onPressSelect={onPressSelectAsset}
          placeholder="0"
          ref={assetInputRef}
          testID="selected-asset-field"
          value={assetAmount}
        />
        <Text style={styles.balance}>
          {'Balance:' + selected.balance.display}
        </Text>
      </FormContainer>
      <FooterContainer>{buttonRenderer}</FooterContainer>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  balance: {
    textAlign: 'left',
    width: '100%',
    marginTop: 10,
    color: colors.mintBlack30,
    fontSize: fonts.size.smaller,
  },
});
