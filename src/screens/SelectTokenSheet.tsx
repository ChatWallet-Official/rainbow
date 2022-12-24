import lang from 'i18n-js';
import React, { useCallback } from 'react';
import styled from '@/styled-thing';
import { Centered } from '@/components/layout';
import { position, fonts, colors } from '@/styles';
import {
  useAccountSettings,
  useCoinListEditOptions,
  useDimensions,
  useSendableUniqueTokens,
  useSendSavingsAccount,
  useSortedAccountAssets,
} from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TouchableBackdrop from '@/components/TouchableBackdrop';
import { useNavigation } from '@/navigation';
import { SlackSheet } from '../components/sheet';
import { SendAssetList } from '@/components/send';
import { useTheme } from '@/theme/ThemeContext';
import { useRoute, StackActions } from '@react-navigation/native';
import { Text } from '@/components/text';

const Container = styled(Centered).attrs({
  direction: 'column',
})(({ deviceHeight, height }: { deviceHeight: number; height: number }) => ({
  ...(height && { height: height + deviceHeight }),
  ...position.coverAsObject,
}));

export default function SelectTokenSheet() {
  const { height: deviceHeight } = useDimensions();
  const insets = useSafeAreaInsets();
  const { goBack, navigate, setParams } = useNavigation();
  const { hiddenCoinsObj, pinnedCoinsObj } = useCoinListEditOptions();
  const { accountAddress, nativeCurrency, network } = useAccountSettings();
  const savings = useSendSavingsAccount();
  const { sortedAssets } = useSortedAccountAssets();
  const theme = useTheme();
  const { sendableUniqueTokens } = useSendableUniqueTokens();
  const {
    params: { sendUpdateSelected },
  } = useRoute<any>();

  const onSelectAsset = (selected: any) => {
    goBack();
    sendUpdateSelected(selected);
  };

  return (
    <Container
      deviceHeight={deviceHeight}
      height={deviceHeight / 2}
      insets={insets}
    >
      {ios && <TouchableBackdrop onPress={goBack} />}

      {/* @ts-expect-error JavaScript component */}
      <SlackSheet
        additionalTopPadding={false}
        contentHeight={deviceHeight / 2}
        scrollEnabled={false}
      >
        <SendAssetList
          hiddenCoins={hiddenCoinsObj}
          nativeCurrency={nativeCurrency}
          network={network}
          onSelectAsset={onSelectAsset}
          pinnedCoins={pinnedCoinsObj}
          savings={savings}
          sortedAssets={sortedAssets}
          theme={theme}
          uniqueTokens={sendableUniqueTokens}
        />
      </SlackSheet>
    </Container>
  );
}
