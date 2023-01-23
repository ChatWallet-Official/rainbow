import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { ButtonPressAnimation } from '../animations';
import { Text } from '@/design-system';

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
    <ButtonPressAnimation
      disabled={editMode}
      onPress={onPress}
      scaleTo={0.96}
      testID={testID}
    >
      <Text
        color={colors.greenCW}
        letterSpacing="roundedMedium"
        size="medium"
        weight="bold"
      >
        {label}
      </Text>
    </ButtonPressAnimation>
  );
};

export default React.memo(WalletOption);
