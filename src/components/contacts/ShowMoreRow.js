import lang from 'i18n-js';
import { Text } from '../text';
import React from 'react';
import { colors } from '@/styles';
import { View } from 'react-native';
import { ButtonPressAnimation } from '../animations';

const ShowMoreRow = ({ ...props }) => {
  return (
    <ButtonPressAnimation
      style={{ marginHorizontal: 20, marginBottom: 10 }}
      onPress={props.onPress}
    >
      <Text
        color={colors.greenCW}
        lineHeight="loose"
        size="smedium"
        suppressHighlighting
        weight="semibold"
      >
        {lang.t('contacts.more')}
      </Text>
    </ButtonPressAnimation>
  );
};

export default React.memo(ShowMoreRow);
