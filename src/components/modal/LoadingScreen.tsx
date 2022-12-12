import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '../text';
import lang from 'i18n-js';
import { colors, fonts } from '@/styles';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lang.t('wallet.new.creating_wallet')}</Text>
      <ActivityIndicator size="large" color={colors.greenCW} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.h2,
    fontWeight: fonts.weight.bold,
    position: 'relative',
    bottom: 150,
  },
});
