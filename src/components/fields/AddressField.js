import lang from 'i18n-js';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { isHexString } from '../../handlers/web3';
import { Input } from '../inputs';
import { Row } from '../layout';
import { Label } from '../text';
import { useClipboard, useDimensions } from '@/hooks';
import styled from '@/styled-thing';
import { abbreviations, addressUtils } from '@/utils';
import { TouchableOpacity } from 'react-native';
import { Icon } from '../icons';

const AddressInput = styled(Input).attrs({
  autoCapitalize: 'none',
  autoCorrect: false,
  keyboardType: android ? 'visible-password' : 'default',
  maxLength: addressUtils.maxLength,
  selectTextOnFocus: true,
  size: 'large',
  spellCheck: false,
  weight: 'medium',
})({
  ...(android ? { height: 56 } : {}),
  flexGrow: 1,
  marginTop: 1,
  zIndex: 1,
});

const Placeholder = styled(Row)({
  marginLeft: android ? 4 : 0,
  marginTop: android ? 11 : 0,
  position: 'absolute',
  top: 0,
  zIndex: 1,
});

const PlaceholderText = styled(Label).attrs({
  size: 'large',
  weight: 'regular',
})({
  color: ({ theme: { colors } }) => colors.mintBlack30,
  opacity: 1,
});

const formatValue = value =>
  isHexString(value) && value.length === addressUtils.maxLength
    ? abbreviations.address(value, 4, 4)
    : value;

const AddressField = (
  {
    address,
    autoFocus,
    editable,
    name,
    isValid,
    onChangeText,
    onFocus,
    testID,
    ...props
  },
  ref
) => {
  const { isTinyPhone } = useDimensions();
  const { colors } = useTheme();
  const { clipboard, setClipboard } = useClipboard();
  const [inputValue, setInputValue] = useState(address ?? '');

  const expandAbbreviatedClipboard = useCallback(() => {
    if (clipboard === abbreviations.formatAddressForDisplay(address)) {
      setClipboard(address);
    }
  }, [address, clipboard, setClipboard]);

  const handleChangeText = useCallback(
    text => {
      expandAbbreviatedClipboard();
      setInputValue(text);
      onChangeText(text);
    },
    [setInputValue, expandAbbreviatedClipboard, onChangeText]
  );

  useEffect(() => {
    if (name !== inputValue || name !== address) {
      setInputValue(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, editable, name]);

  const clean = () => {
    handleChangeText('');
  };

  return (
    <Row flex={1}>
      <AddressInput
        {...props}
        autoFocus={autoFocus}
        color={colors.mintBlack80}
        editable={editable}
        onBlur={expandAbbreviatedClipboard}
        onChangeText={handleChangeText}
        onFocus={onFocus}
        ref={ref}
        testID={testID}
        value={formatValue(inputValue)}
      />
      {!inputValue && (
        <Placeholder>
          <TouchableWithoutFeedback onPress={ref?.current?.focus}>
            <PlaceholderText>
              {lang.t('fields.address.short_placeholder')}
            </PlaceholderText>
          </TouchableWithoutFeedback>
        </Placeholder>
      )}
      {inputValue.length > 0 && (
        <TouchableOpacity onPress={clean}>
          <Icon name="mintXIcon" />
        </TouchableOpacity>
      )}
    </Row>
  );
};

export default React.forwardRef(AddressField);
