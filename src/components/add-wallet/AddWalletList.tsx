import React from 'react';
import { AddWalletItem, AddWalletRow } from './AddWalletRow';
import { Separator, Stack } from '@/design-system';

type AddWalletListProps = {
  items: AddWalletItem[];
  totalHorizontalInset: number;
};

export const AddWalletList = ({
  items,
  totalHorizontalInset,
}: AddWalletListProps) => {
  return (
    <Stack space="16px">
      {items.map((item: AddWalletItem) => (
        <AddWalletRow
          key={item.icon}
          content={item}
          totalHorizontalInset={totalHorizontalInset}
        />
      ))}
    </Stack>
  );
};
