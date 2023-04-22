import React from 'react';
import { Path, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintCaretDownIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5 12l9.192 9.192a1 1 0 001.415 0L24.799 12"
      stroke="#000"
      strokeOpacity={0.6}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </Svg>
);

export default MintCaretDownIcon;
