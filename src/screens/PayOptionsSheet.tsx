import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { SheetTitle, SlackSheet } from '../components/sheet';
import styled from '@/styled-thing';
import { Centered, Column } from '../components/layout';
import { colors, fonts, position } from '@/styles';
import { useDimensions } from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TouchableBackdrop from '@/components/TouchableBackdrop';
import { useNavigation } from '@/navigation';
import lang from 'i18n-js';
import { Icon } from '@/components/icons';

const Container = styled(Centered).attrs({
  direction: 'column',
})(({ deviceHeight, height }: { deviceHeight: number; height: number }) => ({
  ...(height && { height: height + deviceHeight }),
  ...position.coverAsObject,
}));

export default function PayOptionsSheet() {
  const { height: deviceHeight } = useDimensions();

  const insets = useSafeAreaInsets();
  const { goBack } = useNavigation();
  const contentHeight = 400;

  const onPressAddCard = () => {
    console.log('onPressAddCard');
  };

  return (
    <Container
      deviceHeight={deviceHeight}
      height={contentHeight}
      insets={insets}
    >
      {ios && <TouchableBackdrop onPress={goBack} />}

      {/* @ts-expect-error JavaScript component */}
      <SlackSheet
        additionalTopPadding={android}
        contentHeight={contentHeight}
        scrollEnabled={false}
      >
        <SheetTitle>{lang.t('wallet.transaction.pay_title')}</SheetTitle>
        <Column height={contentHeight} style={styles.column}>
          <TouchableOpacity onPress={onPressAddCard}>
            <View style={styles.container}>
              <Icon name="mintPlusIcon" />
              <Text style={styles.title}>Add Card</Text>
            </View>
          </TouchableOpacity>
        </Column>
      </SlackSheet>
    </Container>
  );
}

const styles = StyleSheet.create({
  column: {
    marginVertical: 30,
  },
  container: {
    backgroundColor: colors.mintBlack06,
    borderRadius: 20,
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontSize: fonts.size.lmedium,
    color: colors.mintBlack80,
    fontWeight: fonts.weight.medium,
    marginLeft: 10,
  },
});
