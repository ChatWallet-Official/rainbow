import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system';

const sx = StyleSheet.create({
  activityListHeader: {
    paddingHorizontal: 24,
  },
});

const ActivityListHeader = ({ title }: { title: string }) => (
  <View style={sx.activityListHeader}>
    <Text
      numberOfLines={1}
      color="labelSecondary"
      size="15px / 21px (Deprecated)"
    >
      {title}
    </Text>
  </View>
);

export default React.memo(ActivityListHeader);
