import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintGreenAddIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={30} cy={30} r={30} fill="#20EA7D" />
    <Path
      d="M15 30h30M30 15v30"
      stroke="#FAFAFA"
      strokeWidth={4}
      strokeLinecap="round"
    />
  </Svg>
);

export default MintGreenAddIcon;
