import React, { useCallback } from 'react';
import Divider from '../Divider';
import { ButtonPressAnimation } from '../animations';
import { Icon } from '../icons';
import { Centered, Column, Row } from '../layout';
import { TruncatedText } from '../text';
import AvatarCircle from './AvatarCircle';
import { useAccountProfile, useDimensions, useOnAvatarPress } from '@/hooks';
import { useNavigation } from '@/navigation';
import Routes from '@/navigation/routesNames';
import styled from '@/styled-thing';
import { abbreviations } from '@/utils';
import { useForegroundColor } from '@/design-system';
import { colors, fonts } from '@/styles';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// NOTE:
// If you’re trying to edit this file for iOS and you’re not seeing any changes,
// that’s because iOS is using the Swift version — TransactionListViewHeader.
// Only Android is using this file at the moment.

const dropdownArrowWidth = 21;

const AccountName = styled(TruncatedText).attrs({
  align: 'left',
  firstSectionLength: abbreviations.defaultNumCharsPerSection,
  letterSpacing: 'roundedMedium',
  size: 'larger',
  truncationLength: 4,
  weight: 'medium',
})({
  height: android ? 38 : 33,
  marginBottom: android ? 10 : 1,
  marginTop: android ? -10 : -1,
  maxWidth: ({ deviceWidth }) => deviceWidth - dropdownArrowWidth - 60,
  paddingRight: 6,
  color: colors.white,
});

const ProfileMastheadDivider = styled(Divider).attrs(
  ({ theme: { colors } }) => ({
    color: colors.rowDividerLight,
  })
)({
  marginTop: 19,
  bottom: 0,
  position: 'absolute',
});

export default function ProfileMasthead({
  recyclerListRef,
  showBottomDivider = true,
}) {
  const { width: deviceWidth } = useDimensions();
  const { navigate } = useNavigation();
  const {
    accountColor,
    accountSymbol,
    accountName,
    accountImage,
    accountAddress,
  } = useAccountProfile();

  const {
    onAvatarPress,
    avatarActionSheetOptions,
    onSelectionCallback,
  } = useOnAvatarPress();

  const iconColor = useForegroundColor('secondary60 (Deprecated)');

  const handlePressAvatar = useCallback(() => {
    recyclerListRef?.scrollToTop(true);
    setTimeout(
      onAvatarPress,
      recyclerListRef?.getCurrentScrollOffset() > 0 ? 200 : 1
    );
  }, [onAvatarPress, recyclerListRef]);

  const handlePressChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  const LinearBackground = styled(LinearGradient).attrs(
    ({ theme: { colors } }) => ({
      colors: [
        colors.alpha(colors.black, 0.16),
        colors.alpha(colors.black, 0.4),
      ],
      end: { x: 1, y: 0.5 },
      start: { x: 0, y: 0.5 },
    })
  )();

  return (
    <View>
      <View style={styles.background}></View>
      <LinearBackground style={absoluteFillStyle} />
      <Row align="center" height={144} padding={20}>
        {/* [AvatarCircle -> ImageAvatar -> ImgixImage], so no need to sign accountImage here. */}
        <AvatarCircle
          accountColor={accountColor}
          accountSymbol={accountSymbol}
          image={accountImage}
          isAvatarPickerAvailable
          menuOptions={avatarActionSheetOptions}
          onPress={handlePressAvatar}
          onSelectionCallback={onSelectionCallback}
          style={android && { marginTop: 10 }}
        />
        <ButtonPressAnimation onPress={handlePressChangeWallet} flex={1}>
          <Row justify="space-between" align="center">
            <View style={styles.accountContainer}>
              <AccountName
                testID={`profileAddress-${accountName}`}
                deviceWidth={deviceWidth}
              >
                {accountName}
              </AccountName>
              <Text style={styles.address}>
                {abbreviations.address(accountAddress, 4, 6)}
              </Text>
            </View>
            <View style={styles.more}>
              <Icon name="moreProfile" />
            </View>
          </Row>
        </ButtonPressAnimation>
      </Row>
      <View style={styles.corner}>
        <Text style={styles.title}>Transaction</Text>
      </View>
    </View>
  );
}

const absoluteFillStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const styles = StyleSheet.create({
  accountContainer: {
    marginLeft: 16,
  },
  address: {
    fontSize: fonts.size.smedium,
    color: colors.alpha(colors.white, 0.55),
  },
  more: {
    width: 32,
    height: 32,
    backgroundColor: colors.alpha(colors.white, 0.2),
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: colors.greenCW,
    ...absoluteFillStyle,
  },
  corner: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 80,
    justifyContent: 'center',
  },
  title: {
    fontSize: fonts.size.big,
    fontWeight: fonts.weight.bold,
    marginLeft: 24,
  },
});
