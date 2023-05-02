import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintBuyForIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={30} cy={30} r={30} fill="#20EA7D" />
    <Path
      d="M42.8 25.998L30 40.398l-12.8-14.4"
      stroke="#FAFAFA"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MintBuyForIcon;
