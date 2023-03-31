import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { ButtonPressAnimation } from '../animations';
import { Text } from '../text';
import { Row } from '../layout';
import styled from '@/styled-thing';
import { padding } from '@/styles';

const Container = styled(Row).attrs({
  align: 'center',
  scaleTo: 0.97,
})({
  ...padding.object(0, 30),
  height: 49,
});

const WalletOption = ({
  editMode,
  label,
  onPress,
  testID,
}: {
  editMode: boolean;
  label: string;
  onPress: () => void;
  testID?: string;
}) => {
  const { colors } = useTheme();
  return (
    <Container as={ButtonPressAnimation} disabled={editMode} onPress={onPress}>
      <Text
        color={colors.greenCW}
        letterSpacing="roundedMedium"
        size="medium"
        weight="bold"
      >
        {label}
      </Text>
    </Container>
  );
};

export default React.memo(WalletOption);
