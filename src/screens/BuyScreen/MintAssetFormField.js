import lang from 'i18n-js';
import React, { useCallback } from 'react';
import RadialGradient from 'react-native-radial-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { ButtonPressAnimation } from '@/components/animations';
import { BubbleField } from '@/components/fields';
import { RowWithMargins, Row } from '@/components/layout';
import { Text } from '@/components/text';
import { analytics } from '@/analytics';
import { useDimensions } from '@/hooks';
import styled from '@/styled-thing';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@/components/icons';

const GradientBackground = styled(RadialGradient).attrs(
  ({ theme: { colors }, width }) => {
    const FieldWidth = width - 38;

    return {
      center: [0, (FieldWidth - 38) / 2],
      colors: [colors.mintTab, colors.mintTab],
      stops: [0, 1],
    };
  }
)({
  height: ({ width }) => width - 38,
  left: 0,
  position: 'absolute',
  top: ({ isSmallPhone, isTinyPhone, width }) =>
    -((width - 38 - (isTinyPhone ? 40 : isSmallPhone ? 46 : 59)) / 2),
  transform: [{ scaleY: 0.175074184 }],
  width: ({ width }) => width - 38,
});

const Wrapper = styled(android ? Row : ButtonPressAnimation).attrs({
  scaleTo: 1.05,
})({
  borderRadius: 29.5,
  height: ({ isSmallPhone, isTinyPhone }) =>
    isTinyPhone ? 40 : isSmallPhone ? 46 : 59,
  overflow: 'hidden',
  paddingBottom: ({ isSmallPhone, isTinyPhone }) =>
    isTinyPhone ? 7 : isSmallPhone ? 8 : 11,
  paddingHorizontal: ({ isSmallPhone, isTinyPhone }) =>
    isTinyPhone ? 12 : isSmallPhone ? 15 : 19,
  paddingTop: ({ isSmallPhone, isTinyPhone }) =>
    isTinyPhone ? 6 : isSmallPhone ? 7 : 10,
  position: 'relative',
  width: ({ width }) => (android ? width - 38 : '100%'),
});

const MintAssetFormField = (
  {
    autoFocus,
    format,
    label,
    labelMaxLength = 6,
    mask,
    maxLabelColor,
    onChange,
    onFocus,
    onPressButton,
    onPressSelect,
    placeholder,
    value,
    testID,
    ...props
  },
  ref
) => {
  const { isTinyPhone, isSmallPhone, width } = useDimensions();
  const { colors } = useTheme();
  const handlePressMax = useCallback(
    event => {
      analytics.track('Clicked "Max" in Send flow input');
      onPressButton?.(event);
    },
    [onPressButton]
  );

  return (
    <Wrapper
      isSmallPhone={android || isSmallPhone}
      isTinyPhone={isTinyPhone}
      onPress={() => !android && ref?.current.focus()}
      width={width}
    >
      <GradientBackground
        isSmallPhone={android || isSmallPhone}
        isTinyPhone={isTinyPhone}
        width={width}
      />
      <RowWithMargins
        align="center"
        flex={1}
        justify="space-between"
        margin={12}
        {...props}
      >
        <BubbleField
          autoFocus={autoFocus}
          colorForAsset={colors.mintLabel}
          format={format}
          keyboardType="decimal-pad"
          mask={mask}
          maxLabelColor={maxLabelColor}
          onChange={onChange}
          onFocus={onFocus}
          onPressButton={handlePressMax}
          placeholder={placeholder}
          ref={ref}
          testID={testID}
          value={value}
        />
        <TouchableOpacity onPress={onPressSelect}>
          <RowWithMargins margin={8} align={'center'}>
            <Text
              align="right"
              color={colors.mintLabel}
              letterSpacing="roundedTight"
              lineHeight={
                android
                  ? isTinyPhone
                    ? 27
                    : android || isSmallPhone
                    ? 31
                    : 38
                  : null
              }
              size={
                isTinyPhone ? 'big' : android || isSmallPhone ? 'bigger' : 'h3'
              }
              weight="medium"
            >
              {label.length > labelMaxLength
                ? label.substring(0, labelMaxLength)
                : label}
            </Text>
            <Icon name="mintRightIcon" />
          </RowWithMargins>
        </TouchableOpacity>
      </RowWithMargins>
    </Wrapper>
  );
};

export default React.forwardRef(MintAssetFormField);
