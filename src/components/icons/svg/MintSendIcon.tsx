import React from 'react';
import { Circle, ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintCaretDownIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_373_17005)">
      <Circle cx={30} cy={30} r={30} fill="#20EA7D" />
      <Path
        d="M28.274 13.943c.773-1.318 2.678-1.318 3.451 0L47.287 40.49c.782 1.333-.18 3.011-1.725 3.011H14.438c-1.545 0-2.507-1.678-1.725-3.011l15.562-26.546z"
        stroke="#FAFAFA"
        strokeWidth={4}
      />
      <Path
        d="M30 42V30"
        stroke="#FAFAFA"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_373_17005">
        <Path fill="#fff" d="M0 0H60V60H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default MintCaretDownIcon;
