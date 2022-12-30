import React from 'react';
import lang from 'i18n-js';
import Menu from './components/Menu';
import MenuContainer from './components/MenuContainer';
import MenuItem from './components/MenuItem';
import { Icon } from '../icons';
import { View } from 'react-native';

const SecuritySection = () => {
  return (
    <MenuContainer>
      <View style={{ alignItems: 'center', marginTop: 58, marginBottom: 10 }}>
        <Icon name="umbrella" />
      </View>
      <Menu>
        <MenuItem
          hasRightArrow
          //   onPress={onPressTwitter}
          size={56}
          testID="twitter-section"
          titleComponent={
            <MenuItem.Title text={lang.t('back_up.secret.private_key_title')} />
          }
        />
      </Menu>
    </MenuContainer>
  );
};

export default SecuritySection;
