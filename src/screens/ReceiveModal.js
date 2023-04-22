import { toChecksumAddress } from '@/handlers/web3';
import { toLower } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import TouchableBackdrop from '../components/TouchableBackdrop';
import { CopyFloatingEmojis } from '../components/floating-emojis';
import { Centered, Column, ColumnWithMargins } from '../components/layout';
import QRCode from '../components/qr-code/QRCode';
import ShareButton from '../components/qr-code/ShareButton';
import { SheetHandle } from '../components/sheet';
import { Text, TruncatedAddress } from '../components/text';
import { CopyToast, ToastPositionContainer } from '../components/toasts';
import { useNavigation } from '../navigation/Navigation';
import { abbreviations, deviceUtils } from '../utils';
import { useAccountProfile } from '@/hooks';
import styled from '@/styled-thing';
import { padding, shadow, colors } from '@/styles';
import { View, StyleSheet } from 'react-native';
import { EmojiAvatar } from '@/components/asset-list/RecyclerAssetList2/profile-header/ProfileAvatarRow';

const QRCodeSize = ios ? 250 : Math.min(230, deviceUtils.dimensions.width - 20);

const AddressText = styled(TruncatedAddress).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.mintBlack30,
  lineHeight: 'loosest',
  opacity: 0.6,
  size: 12,
  weight: 'semibold',
}))({
  width: '100%',
});

const Container = styled(Centered).attrs({
  direction: 'column',
})({
  bottom: 16,
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
  color: colors.mintBlack80,
  letterSpacing: 'roundedMedium',
  size: 20,
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
  const { accountName } = useAccountProfile();

  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);
  const handleCopiedText = useCallback(text => {
    setCopiedText(abbreviations.formatAddressForDisplay(text));
    setCopyCount(count => count + 1);
  }, []);

  const checksummedAddress = useMemo(() => toChecksumAddress(accountAddress), [
    accountAddress,
  ]);

  return (
    <Container testID="receive-modal">
      <TouchableBackdrop onPress={goBack} />
      <ColumnWithMargins align="center" margin={24}>
        <View style={styles.avatarContainer}>
          <EmojiAvatar size={80} />
        </View>
        <QRWrapper>
          <View style={styles.qrContainer}>
            <QRCode size={QRCodeSize} value={checksummedAddress} />
          </View>
          <CopyFloatingEmojis
            onPress={handleCopiedText}
            textToCopy={checksummedAddress}
          >
            <ColumnWithMargins margin={2}>
              <NameText>{accountName}</NameText>
              <AddressText address={checksummedAddress} />
            </ColumnWithMargins>
          </CopyFloatingEmojis>
        </QRWrapper>
      </ColumnWithMargins>
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    borderColor: colors.white,
    borderWidth: 10,
    borderRadius: 90 / 2.5,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: -60,
    zIndex: 1,
  },
  qrContainer: {
    marginVertical: 20,
  },
});
