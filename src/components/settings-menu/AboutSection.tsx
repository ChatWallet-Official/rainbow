import React from 'react';
import lang from 'i18n-js';
import Menu from './components/Menu';
import MenuContainer from './components/MenuContainer';
import MenuItem from './components/MenuItem';
import { View, StyleSheet, Text, Image } from 'react-native';
import AppVersionStamp from '../AppVersionStamp';
import Logo from '@/assets/ic-launch.png';
import { fonts, colors } from '@/styles';
import { useAppVersion } from '@/hooks';

const AboutSection = () => {
  const [appVersion] = useAppVersion();

  return (
    <MenuContainer>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.brand}>{lang.t('wallet.new.brand_name')}</Text>
        <Text style={styles.version}>v{appVersion}</Text>
      </View>
      <Menu>
        <MenuItem
          hasRightArrow
          //   onPress={onPressTwitter}
          size={56}
          testID="twitter-section"
          titleComponent={
            <MenuItem.Title
              text={lang.t('settings.about_section.terms_of_use')}
            />
          }
        />
        <MenuItem
          hasRightArrow
          //   onPress={onPressTwitter}
          size={56}
          testID="twitter-section"
          titleComponent={
            <MenuItem.Title
              text={lang.t('settings.about_section.privacy_policy')}
            />
          }
        />
        <MenuItem
          hasRightArrow
          //   onPress={onPressTwitter}
          size={56}
          testID="twitter-section"
          titleComponent={
            <MenuItem.Title text={lang.t('settings.about_section.help')} />
          }
        />
      </Menu>
    </MenuContainer>
  );
};

export default AboutSection;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    marginTop: 54,
    marginBottom: 24,
  },
  brand: {
    fontSize: fonts.size.larger,
    fontWeight: fonts.weight.medium,
    marginBottom: 4,
  },
  version: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium,
    color: colors.black50,
  },
});
