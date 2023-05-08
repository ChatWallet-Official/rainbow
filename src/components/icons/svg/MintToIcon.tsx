import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintToIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle
      cx={30}
      cy={30}
      r={30}
      transform="rotate(-90 30 30)"
      fill="#20EA7D"
    />
    <Path
      d="M26 17.2L40.4 30 26 42.8"
      stroke="#FAFAFA"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MintToIcon;
