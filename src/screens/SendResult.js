import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SheetHandleFixedToTop } from '@/components/sheet';
import { SendSheetTitle } from '@/components/send/SendHeader';
import { Icon } from '@/components/icons';
import lang from 'i18n-js';
import { fonts } from '@/styles';
import { useRoute } from '@react-navigation/core';

export default function SendResult() {
  const { params } = useRoute();

  return (
    <View style={styles.container}>
      <SheetHandleFixedToTop />
      <SendSheetTitle>{lang.t('contacts.send_header')}</SendSheetTitle>
      <Icon name="tickGreenCW" style={styles.icon} />
      <Text style={styles.status}>Submitted</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    marginTop: 52,
    marginBottom: 16,
  },
  status: {
    fontSize: fonts.size.larger,
    fontWeight: fonts.weight.medium,
  },
});
