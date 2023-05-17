import * as React from 'react';
import { useSelector } from 'react-redux';
import Skeleton, { FakeText } from '@/components/skeleton/Skeleton';
import { Box, Heading } from '@/design-system';
import { AppState } from '@/redux/store';
import { Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/styles';

export const ProfileBalanceRowHeight = 24;

export function ProfileBalanceRow({ totalValue }: { totalValue: string }) {
  const isLoadingAssets = useSelector(
    (state: AppState) => state.data.isLoadingAssets
  );

  const placeholderHeight = ProfileBalanceRowHeight;
  const placeholderWidth = 200;

  return (
    <>
      {isLoadingAssets ? (
        <Box
          height={{ custom: placeholderHeight }}
          width={{ custom: placeholderWidth }}
        >
          <Skeleton>
            <FakeText height={placeholderHeight} width={placeholderWidth} />
          </Skeleton>
        </Box>
      ) : (
        <Text style={styles.balance}>{totalValue}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  balance: {
    color: colors.mintBlack80,
    fontSize: 24,
    fontWeight: fonts.weight.bold,
    numberOfLines: 1,
  },
});
