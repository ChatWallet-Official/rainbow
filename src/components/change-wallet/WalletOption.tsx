import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { ButtonPressAnimation } from '../animations';
import { Text } from '@/design-system';
import { StyleSheet, View } from 'react-native';
import { Icon } from '../icons';
import { colors } from '@/styles';

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
      <View style={styles.container}>
        <Icon name="mintAddWalletIcon" marginRight={10} />
        <Text size="17pt" weight="semibold" color={'black80'}>
          {label}
        </Text>
      </View>
    </ButtonPressAnimation>
  );
};

export default React.memo(WalletOption);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintBlack06,
    padding: 10,
    borderRadius: 20,
  },
});
