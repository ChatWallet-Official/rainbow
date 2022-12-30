import React, { useCallback, useState } from 'react';
import lang from 'i18n-js';
import Menu from './components/Menu';
import MenuContainer from './components/MenuContainer';
import MenuItem from './components/MenuItem';
import { Icon } from '../icons';
import { View } from 'react-native';
import { useWallets } from '@/hooks';
import WalletTypes from '@/helpers/walletTypes';
import { Navigation, useNavigation } from '@/navigation';

const SecuritySection = () => {
  const { selectedWallet, wallets } = useWallets();
  const walletId = selectedWallet.id;
  const isSecretPhrase = WalletTypes.mnemonic === selectedWallet.type;
  const title = isSecretPhrase
    ? lang.t('back_up.secret.secret_phrase_title')
    : lang.t('back_up.secret.private_key_title');
  const { navigate } = useNavigation();

  const handleViewRecoveryPhrase = useCallback(() => {
    navigate('ShowSecretView', {
      title: title,
      walletId,
    });
  }, [navigate, title, walletId]);

  return (
    <MenuContainer>
      <View style={{ alignItems: 'center', marginTop: 58, marginBottom: 10 }}>
        <Icon name="umbrella" />
      </View>
      <Menu>
        <MenuItem
          hasRightArrow
          onPress={handleViewRecoveryPhrase}
          size={56}
          testID="twitter-section"
          titleComponent={<MenuItem.Title text={title} />}
        />
      </Menu>
    </MenuContainer>
  );
};

export default SecuritySection;
