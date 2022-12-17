import lang from 'i18n-js';
import React, { useCallback, useMemo } from 'react';
import { KeyboardArea } from 'react-native-keyboard-area';
import ActivityIndicator from '../components/ActivityIndicator';
import Spinner from '../components/Spinner';
import { Button, MiniButton } from '../components/buttons';
import { Input } from '../components/inputs';
import { Column, Flex } from '../components/layout';
import { SheetHandle } from '../components/sheet';
import { Text } from '../components/text';
import {
  InvalidPasteToast,
  ToastPositionContainer,
} from '../components/toasts';
import { useTheme } from '../theme/ThemeContext';
import { isValidWallet } from '@/helpers/validators';
import {
  useAccountSettings,
  useClipboard,
  useDimensions,
  useImportingWallet,
  useInvalidPaste,
  useKeyboardHeight,
} from '@/hooks';
import { sheetVerticalOffset } from '@/navigation/effects';
import styled from '@/styled-thing';
import { borders, fonts, padding, colors } from '@/styles';
import { deviceUtils } from '@/utils';
import { IS_ANDROID, IS_IOS } from '@/env';
import { StyleSheet, View } from 'react-native';

const sheetBottomPadding = 19;

const Container = styled.View({
  flex: 1,
  paddingTop: 0,

  ...(IS_ANDROID
    ? {
        backgroundColor: ({ theme: { colors } }) => colors.transparent,
        marginTop: sheetVerticalOffset,
      }
    : {}),
});

const Footer = styled(Column).attrs({
  justify: 'center',
})({
  width: '100%',
  ...(IS_ANDROID
    ? {
        marginRight: 18,
        top: ({ isSmallPhone }) => (isSmallPhone ? sheetBottomPadding * 2 : 0),
      }
    : { marginTop: 120 }),
});

const LoadingSpinner = styled(IS_ANDROID ? Spinner : ActivityIndicator).attrs({
  color: 'white',
  size: 15,
})({
  marginRight: 5,
  marginTop: IS_ANDROID ? 0 : 2,
});

const FooterButton = styled(MiniButton).attrs({
  testID: 'import-sheet-button',
})({});

const KeyboardSizeView = styled(KeyboardArea)({
  backgroundColor: ({ theme: { colors } }) => colors.white,
});
const placeholder = lang.t('wallet.new.enter_seeds_placeholder');

const SecretTextArea = styled(Input).attrs({
  align: 'left',
  autoCapitalize: 'none',
  autoComplete: 'off',
  autoCorrect: false,
  autoFocus: true,
  dataDetectorTypes: 'none',
  enablesReturnKeyAutomatically: true,
  keyboardType: IS_ANDROID ? 'visible-password' : 'default',
  lineHeight: 'looser',
  multiline: true,
  numberOfLines: 3,
  placeholder,
  returnKeyType: 'done',
  size: 'large',
  spellCheck: false,
  textContentType: 'none',
  weight: 'regular',
})({
  marginBottom: IS_ANDROID ? 55 : 0,
  minHeight: IS_ANDROID ? 100 : 50,
  width: '100%',
});

const SecretTextAreaContainer = styled(Flex)({
  ...padding.object(0, 0),
  flex: 1,
  justify: 'flex-start',
  marginTop: 40,
  maxHeight: 80,
});

const Sheet = styled(Column).attrs({
  align: 'center',
  flex: 1,
})({
  ...borders.buildRadiusAsObject('top', IS_IOS ? 0 : 16),
  ...padding.object(0, 32, sheetBottomPadding),
  backgroundColor: ({ theme: { colors } }) => colors.white,
  zIndex: 1,
});

export default function ImportSeedPhraseSheetCW() {
  const { isSmallPhone } = useDimensions();
  const keyboardHeight = useKeyboardHeight();
  const {
    busy,
    handleFocus,
    handlePressImportButton,
    handleSetSeedPhrase,
    inputRef,
    isSecretValid,
    seedPhrase,
  } = useImportingWallet();

  const { accountAddress } = useAccountSettings();

  const { getClipboard, hasClipboardData, clipboard } = useClipboard();
  const { onInvalidPaste } = useInvalidPaste();

  const isClipboardValidSecret = useMemo(
    () =>
      deviceUtils.isIOS14
        ? hasClipboardData
        : clipboard !== accountAddress && isValidWallet(clipboard),
    [accountAddress, clipboard, hasClipboardData]
  );

  const handlePressPasteButton = useCallback(() => {
    if (deviceUtils.isIOS14 && !hasClipboardData) return;
    getClipboard(result => {
      if (result !== accountAddress && isValidWallet(result)) {
        return handleSetSeedPhrase(result);
      }
      return onInvalidPaste();
    });
  }, [
    accountAddress,
    getClipboard,
    handleSetSeedPhrase,
    hasClipboardData,
    onInvalidPaste,
  ]);

  const { colors } = useTheme();
  return (
    <Container testID="import-sheet">
      <Sheet>
        <SheetHandle marginBottom={7} marginTop={6} />
        <Text style={styles.title}>
          {lang.t('wallet.action.import_wallet')}
        </Text>
        <SecretTextAreaContainer>
          <SecretTextArea
            backgroundColor="white"
            color={colors.black}
            onChangeText={handleSetSeedPhrase}
            onFocus={handleFocus}
            onSubmitEditing={handlePressImportButton}
            placeholder={lang.t('wallet.new.enter_seeds_placeholder')}
            placeholderTextColor={colors.alpha(colors.blueGreyDark, 0.3)}
            ref={inputRef}
            returnKeyType="done"
            size={fonts.size.bmedium}
            spellCheck={false}
            testID="import-sheet-input"
            value={seedPhrase}
          />
        </SecretTextAreaContainer>
        {isClipboardValidSecret && !seedPhrase && (
          <Text style={styles.paste} onPress={handlePressPasteButton}>
            {lang.t('button.paste_seed_phrase')}
          </Text>
        )}
        <Footer isSmallPhone={isSmallPhone}>
          <View
            backgroundColor={!isSecretValid ? colors.black10 : colors.greenCW}
            style={styles.buttonContainer}
          >
            <Button
              backgroundColor="clear"
              disabled={!isSecretValid}
              {...(IS_ANDROID && {
                height: 30,
                overflowMargin: 15,
                width: 89,
              })}
              onPress={handlePressImportButton}
            >
              <Text
                align="center"
                testID="import-sheet-button-label"
                color={!isSecretValid ? colors.black30 : colors.white}
                style={styles.buttonText}
              >
                {lang.t('button.import')}
              </Text>
            </Button>
          </View>
        </Footer>
      </Sheet>
      <ToastPositionContainer bottom={keyboardHeight}>
        <InvalidPasteToast />
      </ToastPositionContainer>
      {ios ? <KeyboardSizeView isOpen /> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 70,
    alignSelf: 'flex-start',
    fontSize: fonts.size.h2,
    fontWeight: fonts.weight.bold,
  },
  buttonContainer: {
    borderRadius: 16,
  },
  buttonText: {
    weight: fonts.weight.medium,
  },
  paste: {
    color: colors.greenCW,
    alignSelf: 'flex-start',
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
    paddingVertical: 10,
  },
});
