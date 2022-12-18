import * as React from 'react';
import { useSelector } from 'react-redux';
import Skeleton, { FakeText } from '@/components/skeleton/Skeleton';
import { Box, Heading } from '@/design-system';
import { AppState } from '@/redux/store';
import { Text } from '@/components/text';
import { fonts } from '@/styles';

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
        <Text
          color="label"
          numberOfLines={1}
          size={fonts.size.h2}
          weight={fonts.weight.bold}
          testID="balance-text"
        >
          {totalValue}
        </Text>
      )}
    </>
  );
}
