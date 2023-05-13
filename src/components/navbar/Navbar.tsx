import React from 'react';
import { Box, Cover, Inline, Inset, Text } from '@/design-system';

import { NavbarSvgIcon } from './NavbarSvgIcon';
import { NavbarItem } from './NavbarItem';
import { NavbarTextIcon } from './NavbarTextIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextColor } from '@/design-system/color/palettes';
import { CustomColor } from '@/design-system/color/useForegroundColor';

type NavbarProps = {
  hasStatusBarInset?: boolean;
  leftComponent?: React.ReactElement | null;
  rightComponent?: React.ReactElement | null;
  testID?: string;
  title?: string;
  titleColor?: TextColor | CustomColor;
};

export const navbarHeight = 48;

export function Navbar({
  hasStatusBarInset = false,
  leftComponent = <Box />,
  rightComponent = <Box />,
  testID,
  title,
  titleColor = 'label',
}: NavbarProps) {
  const { top: topInset } = useSafeAreaInsets();

  return (
    <Box testID={testID}>
      {hasStatusBarInset && <Box height={{ custom: topInset }} />}
      <Box
        height={{ custom: navbarHeight }}
        justifyContent="center"
        alignItems="center"
      >
        <Cover alignVertical="center" alignHorizontal="justify">
          <Box width="full">
            <Inset horizontal="19px (Deprecated)">
              <Inline alignHorizontal="justify" alignVertical="center">
                {leftComponent}
                {rightComponent}
              </Inline>
            </Inset>
          </Box>
        </Cover>
        <Inset top="1px (Deprecated)">
          <Text color={titleColor} size="20pt" weight="heavy">
            {title}
          </Text>
        </Inset>
      </Box>
    </Box>
  );
}

Navbar.Item = NavbarItem;
Navbar.TextIcon = NavbarTextIcon;
Navbar.SvgIcon = NavbarSvgIcon;
