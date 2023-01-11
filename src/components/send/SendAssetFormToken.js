import React, { Fragment } from 'react';
import { getSoftMenuBarHeight } from 'react-native-extra-dimensions-android';
import { Column } from '../layout';
import SendAssetFormField from './SendAssetFormField';
import { useDimensions } from '@/hooks';
import { supportedNativeCurrencies } from '@/references';
import styled from '@/styled-thing';
import { removeLeadingZeros, deviceUtils } from '@/utils';
import { GasSpeedButton } from '../gas';
import { View, StyleSheet } from 'react-native';
import { Text } from '../text';
import { Button } from '../buttons';
import { fonts } from '@/styles';
import lang from 'i18n-js';

const footerMargin = getSoftMenuBarHeight() / 2;
const FooterContainer = styled(Column).attrs({
  justify: 'end',
  align: 'center',
  marginBottom: android ? footerMargin : 0,
})({
  width: '100%',
  zIndex: 3,
});

const FormContainer = styled(Column).attrs({
  align: 'center',
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
  network,
  buttonDisabled,
  onPressTokenSelection,
  onPressSendButton,
  ...props
}) {
  const { isSmallPhone, isTinyPhone } = useDimensions();
  const { colors } = useTheme();

  const {
    mask: nativeMask,
    placeholder: nativePlaceholder,
    symbol: nativeSymbol,
  } = supportedNativeCurrencies[nativeCurrency];

  return (
    <Fragment>
      <FormContainer
        isSmallPhone={isSmallPhone}
        isTinyPhone={isTinyPhone}
        {...props}
      >
        <SendAssetFormField
          colorForAsset={colorForAsset}
          size={32}
          format={removeLeadingZeros}
          label={selected.symbol}
          onChange={onChangeAssetAmount}
          onFocus={onFocusAssetInput}
          onPressButton={sendMaxBalance}
          onPressLabel={onPressTokenSelection}
          placeholder="0"
          ref={assetInputRef}
          testID="selected-asset-field"
          value={assetAmount}
          height={109}
        />
        <Spacer isSmallPhone={isSmallPhone} isTinyPhone={isTinyPhone} />
        <SendAssetFormField
          autoFocus
          colorForAsset={colors.alpha(colors.blueGreyDark, 0.8)}
          size={fonts.size.big}
          label={nativeCurrency}
          mask={nativeMask}
          maxLabelColor={colors.alpha(colors.blueGreyDark, 0.6)}
          onChange={onChangeNativeAmount}
          onFocus={onFocusNativeInput}
          onPressButton={sendMaxBalance}
          placeholder={nativeSymbol + nativePlaceholder}
          ref={nativeCurrencyInputRef}
          testID="selected-asset-quantity-field"
          value={nativeAmount}
          height={66}
        />
      </FormContainer>
      <FooterContainer>
        <GasSpeedButton
          asset={selected}
          currentNetwork={network}
          horizontalPadding={0}
          marginBottom={17}
          theme={'light'}
        />
        <View
          backgroundColor={buttonDisabled ? colors.black10 : colors.black}
          style={styles.buttonContainer}
        >
          <Button
            backgroundColor="clear"
            disabled={buttonDisabled}
            onPress={onPressSendButton}
          >
            <Text
              align="center"
              color={buttonDisabled ? colors.black30 : colors.white}
              style={styles.buttonText}
            >
              {lang.t('button.send')}
            </Text>
          </Button>
        </View>
      </FooterContainer>
    </Fragment>
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
