import lang from 'i18n-js';
import React, { useCallback, useMemo, useState } from 'react';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddCashForm, AddCashStatus } from '../components/add-cash';
import { Column, ColumnWithMargins, FlexItem } from '../components/layout';
import {
  SheetHandle,
  SheetSubtitleCycler,
  SheetTitle,
} from '../components/sheet';
import { deviceUtils } from '../utils';
import {
  useAddCashLimits,
  useDimensions,
  useShakeAnimation,
  useTimeout,
  useWyreApplePay,
  useSquarePay,
} from '@/hooks';
import styled from '@/styled-thing';
import { borders, fonts } from '@/styles';
import { useTheme } from '@/theme';
import { IS_IOS } from '@/env';
import { useNavigation } from '@/navigation';
import Routes from '@/navigation/routesNames';
import { Navbar } from '@/components/navbar/Navbar';
import { Icon } from '@/components/icons';
import { TouchableOpacity, View } from 'react-native';

const deviceHeight = deviceUtils.dimensions.height;
const statusBarHeight = getStatusBarHeight(true);
const sheetHeight =
  deviceHeight -
  statusBarHeight -
  (IS_IOS ? (deviceHeight >= 812 ? 10 : 20) : 0);

const subtitleInterval = 3000;

const SheetContainer = styled(Column)({
  ...borders.buildRadiusAsObject('top', IS_IOS ? 0 : 16),
  backgroundColor: ({ colors }) => colors.white,
  height: IS_IOS ? deviceHeight : sheetHeight,
  top: IS_IOS ? 0 : statusBarHeight,
  width: '100%',
});

export default function AddCashSheet() {
  const { colors } = useTheme();
  const { isNarrowPhone } = useDimensions();
  const insets = useSafeAreaInsets();

  const [errorAnimation, onShake] = useShakeAnimation();
  const [startErrorTimeout, stopErrorTimeout] = useTimeout();
  const { goBack, navigate, dangerouslyGetParent } = useNavigation();
  const [errorIndex, setErrorIndex] = useState(null);
  const onClearError = useCallback(() => setErrorIndex(null), []);

  const { weeklyRemainingLimit, yearlyRemainingLimit } = useAddCashLimits();

  const cashLimits = useMemo(
    () => ({
      weekly:
        weeklyRemainingLimit > 0
          ? lang.t('add_funds.limit_left_this_week', {
              remainingLimit: weeklyRemainingLimit,
            })
          : lang.t('add_funds.weekly_limit_reached'),
      yearly:
        yearlyRemainingLimit > 0
          ? lang.t('add_funds.limit_left_this_year', {
              remainingLimit: yearlyRemainingLimit,
            })
          : lang.t('add_funds.yearly_limit_reached'),
    }),
    [weeklyRemainingLimit, yearlyRemainingLimit]
  );

  const {
    error,
    isPaymentComplete,
    onPurchase,
    orderCurrency,
    orderId,
    orderStatus,
    resetAddCashForm,
    transferStatus,
  } = useWyreApplePay();

  const { onPurchaseByCard } = useSquarePay();

  const onLimitExceeded = useCallback(
    limit => {
      stopErrorTimeout();
      setErrorIndex(Object.keys(cashLimits).indexOf(limit));
      startErrorTimeout(() => onClearError(), subtitleInterval);
    },
    [stopErrorTimeout, cashLimits, startErrorTimeout, onClearError]
  );

  return (
    <SheetContainer colors={colors}>
      <Column
        align="center"
        height={IS_IOS ? sheetHeight : '100%'}
        paddingTop={statusBarHeight}
        paddingBottom={isNarrowPhone ? 15 : insets.bottom + 11}
      >
        <Column align="center" paddingVertical={6}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: deviceUtils.dimensions.width,
            }}
          >
            <TouchableOpacity
              onPress={goBack}
              style={{
                width: 50,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: 10,
              }}
            >
              <Icon name="closeMarkIconCW" color="black" />
            </TouchableOpacity>

            <ColumnWithMargins
              align="center"
              margin={4}
              paddingTop={IS_IOS ? 7 : 5}
            >
              <SheetTitle size={fonts.size.medium} weight={fonts.weight.medium}>
                {lang.t('wallet.buy')}
              </SheetTitle>
              {/* <SheetSubtitleCycler
                errorIndex={errorIndex}
                interval={subtitleInterval}
                isPaymentComplete={isPaymentComplete}
                items={Object.values(cashLimits)}
                sharedValue={errorAnimation}
              /> */}
            </ColumnWithMargins>
          </View>
        </Column>
        <FlexItem width="100%">
          {isPaymentComplete ? (
            <AddCashStatus
              error={error}
              orderCurrency={orderCurrency}
              orderId={orderId}
              orderStatus={orderStatus}
              resetAddCashForm={resetAddCashForm}
              transferStatus={transferStatus}
            />
          ) : (
            <AddCashForm
              limitWeekly={weeklyRemainingLimit}
              onClearError={onClearError}
              onLimitExceeded={onLimitExceeded}
              onPurchase={onPurchase}
              onPurchaseByCard={onPurchaseByCard}
              onShake={onShake}
              shakeAnim={errorAnimation}
            />
          )}
        </FlexItem>
      </Column>
    </SheetContainer>
  );
}
