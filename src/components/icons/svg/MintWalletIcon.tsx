import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintWalletIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={40} cy={40} r={40} fill="#20EA7D" />
    <Circle cx={50.5} cy={40} r={2.5} fill="#FAFAFA" />
    <Path
      d="M54.667 25A3.333 3.333 0 0158 28.333V34h-9.333A4.667 4.667 0 0044 38.667v2.666A4.667 4.667 0 0048.667 46H58v5.667A3.333 3.333 0 0154.667 55H25.333A3.333 3.333 0 0122 51.667V28.333A3.333 3.333 0 0125.333 25h29.334z"
      stroke="#FAFAFA"
      strokeWidth={4}
    />
  </Svg>
);

export default MintWalletIcon;
