import React from 'react';
import { Circle, ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintMoreIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_373_17007)">
      <Circle cx={30} cy={30} r={30} fill="#20EA7D" />
      <Circle cx={18} cy={30} r={3} fill="#FAFAFA" />
      <Circle cx={30} cy={30} r={3} fill="#FAFAFA" />
      <Circle cx={42} cy={30} r={3} fill="#FAFAFA" />
    </G>
    <Defs>
      <ClipPath id="clip0_373_17007">
        <Path fill="#fff" d="M0 0H60V60H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default MintMoreIcon;
