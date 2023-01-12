import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SheetHandleFixedToTop } from '@/components/sheet';
import { SendSheetTitle } from '@/components/send/SendHeader';
import { Icon } from '@/components/icons';
import lang from 'i18n-js';
import { colors, fonts } from '@/styles';
import { useRoute, useIsFocused, useNavigation } from '@react-navigation/core';
import { TransactionCoinRow } from '@/components/coin-row';
import { useAccountTransactions } from '@/hooks';
import { deviceUtils } from '@/utils';
import Routes from '@/navigation/routesNames';

export default function SendResult() {
  const [activityListInitialized, setActivityListInitialized] = useState(false);
  const isFocused = useIsFocused();
  const { reset } = useNavigation();
  const { params } = useRoute();
  const accountTransactions = useAccountTransactions(
    activityListInitialized,
    isFocused
  );

  const { sections } = accountTransactions;

  useEffect(() => {
    setTimeout(() => {
      setActivityListInitialized(true);
    }, 5000);
  }, []);

  const onPressDone = () => {
    reset({
      index: 0,
      routes: [{ name: Routes.STACK }],
    });
  };

  const onPressHistory = () => {
    reset({
      index: 0,
      routes: [{ name: Routes.WALLET_SCREEN }],
    });
    params.onPressHistoryOnSendResult();
  };

  return (
    <View style={styles.container}>
      <SheetHandleFixedToTop />
      <SendSheetTitle>{lang.t('contacts.send_header')}</SendSheetTitle>
      <Icon name="tickGreenCW" style={styles.icon} />
      <Text style={styles.status}>Submitted</Text>
      {sections.length > 0 && <TransactionCoinRow item={sections[0].data[0]} />}

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.done} onPress={onPressDone}>
          <Text style={styles.doneText}>{lang.t('button.done')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.history} onPress={onPressHistory}>
          <Text style={styles.historyText}>
            {lang.t('button.transaction_history')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  icon: {
    marginTop: 52,
    marginBottom: 16,
  },
  status: {
    fontSize: fonts.size.larger,
    fontWeight: fonts.weight.medium,
    marginBottom: 48,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 88,
  },
  done: {
    backgroundColor: colors.black10,
    borderRadius: 16,
    width: deviceUtils.dimensions.width - 64,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  doneText: {
    color: colors.greenCW,
    fontSize: fonts.size.bmedium,
    fontWeight: fonts.weight.medium,
  },
  history: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: {
    color: colors.greenCW,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium,
  },
});
