import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintXIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M42.728 20.1a2 2 0 10-2.828-2.83l-9.9 9.9-9.9-9.9a2 2 0 10-2.828 2.83l9.9 9.899-9.9 9.9a2 2 0 102.829 2.828l9.899-9.9 9.9 9.9a2 2 0 102.828-2.829l-9.9-9.9 9.9-9.899z"
      fill="#000"
      fillOpacity={0.6}
    />
  </Svg>
);

export default MintXIcon;
