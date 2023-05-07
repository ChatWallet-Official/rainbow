import React, { Fragment, useMemo } from 'react';
import { KeyboardArea } from 'react-native-keyboard-area';
import LinearGradient from 'react-native-linear-gradient';
import { SendCoinRow } from '../coin-row';
import CollectiblesSendRow from '../coin-row/CollectiblesSendRow';
import SendSavingsCoinRow from '../coin-row/SendSavingsCoinRow';
import { Column } from '../layout';
import SendAssetFormCollectible from './SendAssetFormCollectible';
import SendAssetFormToken from './SendAssetFormToken';
import { AssetTypes } from '@/entities';
import { useDimensions, useKeyboardHeight } from '@/hooks';
import styled from '@/styled-thing';
import { padding, position } from '@/styles';

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
  paddingTop: 20,
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

export default function SendAssetForm({
  assetAmount,
  buttonRenderer,
  colorForAsset,
  nativeAmount,
  nativeCurrency,
  onChangeAssetAmount,
  onChangeNativeAmount,
  setLastFocusedInputHandle,
  nativeCurrencyInputRef,
  assetInputRef,
  onResetAssetSelection,
  selected,
  sendMaxBalance,
  txSpeedRenderer,
  ...props
}) {
  const { isTinyPhone, width: deviceWidth } = useDimensions();
  const keyboardHeight = useKeyboardHeight();
  const [showNativeValue, setShowNativeValue] = useState(true);

  const isNft = selected.type === AssetTypes.nft;
  const isSavings = selected.type === AssetTypes.compound;

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

  const noShadows = [[0, 0, 0, colors.transparent, 0]];
  const shadows = useMemo(() => AssetRowShadow(colors), [colors]);

  return (
    <Container>
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
              assetAmount={assetAmount}
              assetInputRef={assetInputRef}
              buttonRenderer={buttonRenderer}
              colorForAsset={colorForAsset}
              nativeAmount={nativeAmount}
              nativeCurrency={nativeCurrency}
              nativeCurrencyInputRef={nativeCurrencyInputRef}
              onChangeAssetAmount={onChangeAssetAmount}
              onChangeNativeAmount={onChangeNativeAmount}
              onFocusAssetInput={onFocusAssetInput}
              onFocusNativeInput={onFocusNativeInput}
              selected={selected}
              sendMaxBalance={sendMaxBalance}
              txSpeedRenderer={txSpeedRenderer}
              onPressSelectAsset={onResetAssetSelection}
            />
            <KeyboardArea initialHeight={keyboardHeight} isOpen />
          </Fragment>
        )}
      </FormContainer>
    </Container>
  );
}
