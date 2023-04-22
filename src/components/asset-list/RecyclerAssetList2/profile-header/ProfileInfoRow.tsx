import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProfileAvatarRow } from './ProfileAvatarRow';
import { ProfileNameRow } from './ProfileNameRow';
import { ProfileBalanceRow } from './ProfileBalanceRow';

export const ProfileInfoRowHeight = 100;
export const ProfileInfoRowTopInset = 60;

export function ProfileInfoRow({
  disableOnPress,
  testIDPrefix,
  totalValue,
}: {
  disableOnPress?: any;
  testIDPrefix?: string;
  totalValue: string;
}) {
  return (
    <View style={styles.infoContainer}>
      <ProfileAvatarRow />
      <View style={styles.columnContainer}>
        <ProfileNameRow
          disableOnPress={disableOnPress}
          testIDPrefix={testIDPrefix}
        />
        <ProfileBalanceRow totalValue={totalValue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  columnContainer: {
    paddingVertical: 10,
    paddingLeft: 20,
    height: ProfileInfoRowHeight,
    justifyContent: 'space-around',
  },
});
