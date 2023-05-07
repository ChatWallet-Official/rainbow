import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintRightIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 25l9.192-9.192a1 1 0 000-1.415L12 5.201"
      stroke="#fff"
      strokeOpacity={0.6}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </Svg>
);

export default MintRightIcon;
