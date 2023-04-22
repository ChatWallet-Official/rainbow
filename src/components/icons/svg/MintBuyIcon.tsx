import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
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
    <Circle cx={30} cy={30} r={30} fill="#20EA7D" />
    <Rect
      x={14}
      y={18}
      width={32}
      height={24}
      rx={4}
      stroke="#FAFAFA"
      strokeWidth={4}
    />
    <Path d="M14 26h32" stroke="#fff" strokeWidth={4} />
  </Svg>
);

export default MintCaretDownIcon;
