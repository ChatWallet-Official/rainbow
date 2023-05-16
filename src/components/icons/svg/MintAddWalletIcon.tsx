import React from 'react';
import { Circle, Path, Rect, SvgProps } from 'react-native-svg';
import Svg from '../Svg';

const MintAddWalletIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M120 60c0 41.421-18.579 60-60 60S0 101.421 0 60 18.579 0 60 0s60 18.579 60 60z"
      fill="#000"
      fillOpacity={0.1}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M62 44a2 2 0 10-4 0v14H44a2 2 0 100 4h14v14a2 2 0 104 0V62h14a2 2 0 100-4H62V44z"
      fill="#FAFAFA"
    />
  </Svg>
);

export default MintAddWalletIcon;
