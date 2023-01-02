import { useRoute, useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import lang from 'i18n-js';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  createdWithBiometricError,
  identifyWalletType,
  loadSeedPhraseAndMigrateIfNeeded,
} from '../../model/wallet';
import ActivityIndicator from '../ActivityIndicator';
import Spinner from '../Spinner';
import { BiometricButtonContent, Button } from '../buttons';
import { CopyFloatingEmojis } from '../floating-emojis';
import { Icon } from '../icons';
import SecretDisplayCard from './SecretDisplayCard';
import { Box, Inline, Stack, Text } from '@/design-system';
import WalletTypes, { EthereumWalletType } from '@/helpers/walletTypes';
import { useWallets } from '@/hooks';
import styled from '@/styled-thing';
import { margin, position, shadow, colors, fonts } from '@/styles';
import { useTheme } from '@/theme';
import logger from '@/utils/logger';
import {
  StyleSheet,
  View,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';

const CopyButtonIcon = styled(Icon).attrs(({ theme: { colors } }: any) => ({
  color: colors.appleBlue,
  name: 'copy',
}))({
  ...position.sizeAsObject(16),
  marginTop: 0.5,
});

const ToggleSecretButton = styled(Button)(({ theme: { colors } }: any) => ({
  ...margin.object(0, 20),
  ...shadow.buildAsObject(0, 5, 15, colors.purple, 0.3),
  backgroundColor: colors.appleBlue,
}));

const LoadingSpinner = android ? Spinner : ActivityIndicator;

interface SecretDisplaySectionProps {
  onSecretLoaded?: (seedExists: boolean) => void;
  onWalletTypeIdentified?: (walletType: EthereumWalletType) => void;
}

export default function SecretDisplaySection({
  onSecretLoaded,
  onWalletTypeIdentified,
}: SecretDisplaySectionProps) {
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const { selectedWallet, wallets } = useWallets();
  const walletId = (params as any)?.walletId || selectedWallet.id;
  const currentWallet = wallets?.[walletId];
  const [visible, setVisible] = useState(true);
  const [isRecoveryPhraseVisible, setIsRecoveryPhraseVisible] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);
  const [type, setType] = useState(currentWallet?.type);

  const loadSeed = useCallback(async () => {
    try {
      const s = await loadSeedPhraseAndMigrateIfNeeded(walletId);
      if (s) {
        const walletType = identifyWalletType(s);
        setType(walletType);
        onWalletTypeIdentified?.(walletType);
        setSeed(s);
      }
      setVisible(!!s);
      onSecretLoaded?.(!!s);
      setIsRecoveryPhraseVisible(!!s);
    } catch (e: any) {
      logger.sentry('Error while trying to reveal secret', e);
      if (e?.message === createdWithBiometricError) {
        setIsRecoveryPhraseVisible(false);
      }
      captureException(e);
      setVisible(false);
      onSecretLoaded?.(false);
    }
  }, [onSecretLoaded, onWalletTypeIdentified, walletId]);

  useEffect(() => {
    // Android doesn't like to show the faceID prompt
    // while the view isn't fully visible
    // so we have to add a timeout to prevent the app from freezing
    android
      ? setTimeout(() => {
          loadSeed();
        }, 300)
      : loadSeed();
  }, [loadSeed]);

  const typeLabel =
    type === WalletTypes.privateKey ? 'private key' : 'secret phrase';

  const { colors } = useTheme();

  const renderStepNoSeeds = useCallback(() => {
    if (isRecoveryPhraseVisible) {
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="60px"
        >
          <Stack space="10px">
            <Text
              align="center"
              color="secondary (Deprecated)"
              size="18px / 27px (Deprecated)"
              weight="regular"
            >
              {lang.t('back_up.secret.you_need_to_authenticate', {
                typeName: typeLabel,
              })}
            </Text>
            <ToggleSecretButton onPress={loadSeed}>
              {/* @ts-ignore */}
              <BiometricButtonContent
                color={colors.white}
                label={lang.t('back_up.secret.show_recovery', {
                  typeName: upperFirst(typeLabel),
                })}
                showIcon={!seed}
              />
            </ToggleSecretButton>
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="60px"
        >
          <Text
            align="center"
            color="secondary60 (Deprecated)"
            size="16px / 22px (Deprecated)"
          >
            {lang.t('back_up.secret.biometrically_secured')}
          </Text>
        </Box>
      );
    }
  }, [isRecoveryPhraseVisible, typeLabel, loadSeed, colors.white, seed]);

  return (
    <>
      {visible ? (
        <Box
          alignItems="center"
          justifyContent="center"
          paddingBottom="30px (Deprecated)"
          paddingHorizontal={{ custom: 46 }}
        >
          {seed ? (
            <>
              <View style={styles.container}>
                <Text
                  align="center"
                  color="secondary60 (Deprecated)"
                  size="16px / 22px (Deprecated)"
                >
                  {lang.t('back_up.secret.please_keep_safe', {
                    typeName: typeLabel,
                  })}
                </Text>
                <View style={styles.keyContainer}>
                  {/* @ts-ignore */}
                  <SecretDisplayCard seed={seed} type={type} />
                  <Box paddingBottom="19px (Deprecated)">
                    {/* @ts-ignore */}
                    <CopyFloatingEmojis textToCopy={seed}>
                      <Inline alignVertical="center" space="6px">
                        <RNText style={styles.copy}>
                          {lang.t('wallet.copy')}
                        </RNText>
                      </Inline>
                    </CopyFloatingEmojis>
                  </Box>
                </View>
                <TouchableOpacity style={styles.ok} onPress={goBack}>
                  <RNText style={styles.okText}>{lang.t('button.ok')}</RNText>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <LoadingSpinner color={colors.blueGreyDark50} />
          )}
        </Box>
      ) : (
        renderStepNoSeeds()
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  keyContainer: {
    backgroundColor: colors.lighterGrey,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 42,
    marginBottom: 69,
    paddingHorizontal: 24,
  },
  copy: {
    color: colors.greenCW,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
  },
  ok: {
    backgroundColor: colors.greenCW,
    borderRadius: 16,
    width: 238,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okText: {
    color: colors.white,
    fontSize: fonts.size.bmedium,
    fontWeight: fonts.weight.medium,
  },
});
