import React from 'react';
import {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
  SvgProps,
} from 'react-native-svg';
import Svg from '../Svg';

const MintShareIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_424_17042)">
      <Circle cx={40} cy={40} r={40} fill="#20EA7D" />
    </G>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M63.75 38.865C61.568 28.81 53.676 23 50.425 23c-2.502 0-4.861 1.852-5.454 4.525-.593 2.67-2.42 4.317-4.971 4.323-2.548-.006-4.375-1.654-4.97-4.323C34.432 24.852 32.076 23 29.574 23c-3.197 0-10.764 4.898-13.325 15.865-.867 4.577.578 8.974 3.47 11.9 3.395 3.435 11.848 6.52 20.28 6.52 8.108 0 16.885-3.085 20.28-6.52 2.892-2.926 4.338-7.323 3.47-11.9zm-28.55-.95a6 6 0 11-12 0 6 6 0 0112 0zm15.6 6a6 6 0 100-12 6 6 0 000 12z"
      fill="#FAFAFA"
    />
    <Defs>
      <ClipPath id="clip0_424_17042">
        <Path fill="#fff" d="M0 0H80V80H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default MintShareIcon;
