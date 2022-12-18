import { toChecksumAddress } from '@/handlers/web3';
import { toLower } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import TouchableBackdrop from '../components/TouchableBackdrop';
import { CopyFloatingEmojis } from '../components/floating-emojis';
import {
  Centered,
  Column,
  ColumnWithMargins,
  Flex,
} from '../components/layout';
import QRCode from '../components/qr-code/QRCode';
import ShareButton from '../components/qr-code/ShareButton';
import { SheetHandle } from '../components/sheet';
import { Text, TruncatedAddress } from '../components/text';
import { CopyToast, ToastPositionContainer } from '../components/toasts';
import { useNavigation } from '../navigation/Navigation';
import { abbreviations, deviceUtils } from '../utils';
import { useAccountProfile } from '@/hooks';
import styled from '@/styled-thing';
import { colors, padding, shadow } from '@/styles';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import { AvatarCircle } from '@/components/profile';

const QRCodeSize = ios ? 250 : Math.min(230, deviceUtils.dimensions.width - 20);

const AddressText = styled(TruncatedAddress).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.whiteLabel,
  lineHeight: 'loosest',
  opacity: 0.6,
  size: 'large',
  weight: 'semibold',
}))({
  width: '100%',
});

const Container = styled(Flex).attrs({
  direction: 'column',
  align: 'center',
  justify: 'space-between',
})({
  flex: 1,
});

const Handle = styled(SheetHandle).attrs(({ theme: { colors } }) => ({
  color: colors.whiteLabel,
}))({
  marginBottom: 19,
});

const QRWrapper = styled(Column).attrs({ align: 'center' })(
  ({ theme: { colors } }) => ({
    ...shadow.buildAsObject(0, 10, 50, colors.shadowBlack, 0.6),
    ...padding.object(24),
    backgroundColor: colors.whiteLabel,
    borderRadius: 39,
  })
);

const NameText = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.whiteLabel,
  letterSpacing: 'roundedMedium',
  size: 'bigger',
  weight: 'bold',
}))({});

const accountAddressSelector = state => state.settings.accountAddress;
const lowercaseAccountAddressSelector = createSelector(
  accountAddressSelector,
  toLower
);

export default function ReceiveModal() {
  const { goBack } = useNavigation();
  const accountAddress = useSelector(lowercaseAccountAddressSelector);
  const {
    accountColor,
    accountSymbol,
    accountName,
    accountImage,
  } = useAccountProfile();

  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);
  const handleCopiedText = useCallback(text => {
    setCopiedText(abbreviations.formatAddressForDisplay(text));
    setCopyCount(count => count + 1);
  }, []);

  const checksummedAddress = useMemo(() => toChecksumAddress(accountAddress), [
    accountAddress,
  ]);

  const LinearBackground = styled(LinearGradient).attrs(
    ({ theme: { colors } }) => ({
      colors: ['#32D975', colors.alpha('#00C7C7', 0.6)],
      end: { x: 0.5, y: 1 },
      start: { x: 0.5, y: 0 },
    })
  )();

  const absoluteFillStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  return (
    <Container testID="receive-modal">
      <LinearBackground onPress={goBack} style={absoluteFillStyle} />
      <Handle style={styles.handle} />
      <AvatarCircle
        showcaseAccountColor={colors.greenCW}
        accountSymbol={accountSymbol}
        image={accountImage}
      />
      <QRWrapper>
        <QRCode size={QRCodeSize} value={checksummedAddress} />
      </QRWrapper>
      <CopyFloatingEmojis
        onPress={handleCopiedText}
        textToCopy={checksummedAddress}
      >
        <ColumnWithMargins margin={2}>
          <NameText>{accountName}</NameText>
          <AddressText address={checksummedAddress} />
        </ColumnWithMargins>
      </CopyFloatingEmojis>
      <ShareButton accountAddress={checksummedAddress} style={styles.share} />
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  handle: {
    marginVertical: 8,
  },
  share: {
    marginBottom: 44,
  },
});
