import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintEthIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={15} cy={15} r={15} fill="#ADC5FF" />
    <Path
      d="M14.953 19.975L8.816 16.35 14.952 25l6.142-8.65-6.143 3.625h.002zM15.046 5L8.908 15.186l6.138 3.628 6.137-3.625L15.046 5z"
      fill="#000"
    />
  </Svg>
);

export default MintEthIcon;
